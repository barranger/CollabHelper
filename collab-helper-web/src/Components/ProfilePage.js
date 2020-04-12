import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import {
  Grid,
  Avatar,
  Typography,
  Button,
  ListSubheader,
} from "@material-ui/core";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import { auth, analytics, functions } from "../firebase";
import { makeStyles } from "@material-ui/core/styles";
import Box from "../controls/Box";
import NewContact from "../controls/NewContact";
import { getContactDoc } from "../services/constactService";
import { Link } from "@reach/router";

const useStyles = makeStyles((theme) => ({
  box: {
    backgroundColor: "#bccbde",
    padding: "2.5em",
    marginTop: "5em",
    borderRadius: 12,
  },
  profilePic: {
    width: 120,
    height: 120,
  },
}));

const sendEmail = () => {
  const callable = functions.httpsCallable("genericemail");
  return callable({
    text: "Sending email with React and SendGrid is fun!",
    subject: "Email from React",
  }).then(console.log);
};

const ProfilePage = () => {
  const user = useContext(UserContext);
  const { photoURL, displayName, email } = user;
  const classes = useStyles();
  const [contacts, setContacts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function getContacts() {
      if (!loaded) {
        const contactDoc = await getContactDoc(user.uid);
        console.log("contacts are", contactDoc);

        setContacts(contactDoc.contacts);
        setLoaded(true);
      }
    }
    getContacts();
  });

  analytics.logEvent("Loading user page: " + displayName);

  return (
    <Grid container>
      <Grid item xs={3}>
        <Box>
          <Avatar className={classes.profilePic} src={photoURL} />
          <Typography variant="h4">{displayName}</Typography>
          <Typography variant="h6">{email}</Typography>
          <Button onClick={() => auth.signOut()}>Sign out</Button>

          <Link to="/trip">
          <Button variant="contained" color="secondary">
            Schedule a Grocery Trip
          </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={9}>
        <Box>
          <Typography className={classes.text} variant="h4" component="h2">
            Collab(oration) Helper
          </Typography>
          <List
            className={classes.root}
            subheader={<ListSubheader>People in your network</ListSubheader>}
          >
            {contacts.map((p) => (
              <ListItem alignItems="flex-start" key={p.email}>
                <ListItemAvatar>
                  <Avatar src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <ListItemText
                  primary={p.name}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                      >
                        {p.email}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
            ))}
            <NewContact onAdded={() => setLoaded(false)}/>
          </List>
        </Box>
      </Grid>
    </Grid>
  );
};
export default ProfilePage;
