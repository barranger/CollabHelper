import React, {useContext} from 'react';
import {Avatar, Typography, Button} from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import {Link, Location} from '@reach/router';
import Box from './Box';
import { UserContext } from "../providers/UserProvider";
import { auth } from "../firebase";

const useStyles = makeStyles((theme) => ({
  box: {
    backgroundColor: theme.background,
    padding: "2.5em",
    marginTop: "5em",
    borderRadius: 12,
  },
  profilePic: {
    width: 120,
    height: 120,
  },
  button: {
    textDecoration: 'none'
  }
}));

const Sidebar = props => {
  const classes = useStyles();
  const user = useContext(UserContext);
  const { photoURL, displayName, email } = user;
  return ( 
    <Location>
    {({ location }) => {
      console.log('loc', location)
      const link = location.pathname === '/trip' ? '/' : '/trip';
      const text = location.pathname === '/trip' ? 'Modify My Network' : 'Schedule a Grocery Trip';
      return(  
          <Box>
            <Avatar className={classes.profilePic} src={photoURL} />
            <Typography variant="h4">{displayName}</Typography>
            <Typography variant="h6">{email}</Typography>
            <Button onClick={() => auth.signOut()}>Sign out</Button>


              <Link to={link} className={classes.button}>
                <Button variant="contained" color="secondary">{text}</Button>
              </Link>
            
          </Box>)
    }}
  </Location>);
}

export default Sidebar;