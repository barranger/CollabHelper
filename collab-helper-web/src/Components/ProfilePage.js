import React, { useContext } from "react";
import { UserContext } from "../providers/UserProvider";
import { Grid, Avatar, Typography, Button, ListSubheader } from "@material-ui/core";
import { List, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import { auth, analytics } from "../firebase";
import { makeStyles } from "@material-ui/core/styles";
import Box from '../controls/Box';

const tempNetwork = [
  { name: "Barranger Ridler", email: "barranger@gmail.com" },
  { name: "Annie Ellenberger", email: "annie.ellenberger@gmail.com"}
]

const useStyles = makeStyles(theme => ({
  box: {
    backgroundColor: "#bccbde",
    padding: "2.5em",
    marginTop: "5em",
    borderRadius: 12
  },
  profilePic: {
    width: 120,
    height: 120
  }
}));

const ProfilePage = () => {
  const user = useContext(UserContext);
  const { photoURL, displayName, email } = user;
  const classes = useStyles();

  analytics.logEvent("Loading user page: " + displayName);

  return (
    <Grid container>
      <Grid item xs={3}>
        <Box>
          <Avatar className={classes.profilePic} src={ photoURL } />
          <Typography variant="h4">{displayName}</Typography>
          <Typography variant="h6">{email}</Typography>
          <Button onClick={() => auth.signOut()}>Sign out</Button>
        </Box>
      </Grid>
      <Grid item xs={9}>
        <Box>
          
        <Typography className={classes.text} variant="h4" component="h2">Collab(oration) Helper</Typography>
      <List className={classes.root} subheader={<ListSubheader>People in your network</ListSubheader>}>
        {tempNetwork.map( p => 
          (<ListItem alignItems="flex-start" key={p.email}>
            <ListItemAvatar>
              <Avatar src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary={p.name}
              secondary={
                <React.Fragment>
                  <Typography component="span" variant="body2" color="textPrimary">{p.email}</Typography>
                </React.Fragment>
              }
            />
          </ListItem>)
      )}
          </List>
          <Button variant="contained" color="primary">Add New Contact</Button>
          </Box>
      </Grid>
    </Grid>
  );
};
export default ProfilePage;
