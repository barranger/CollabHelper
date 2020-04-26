import React, { useContext } from 'react';
import { Avatar, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link, Location } from '@reach/router';
import { UserContext } from '../providers/UserProvider';
import { auth } from '../firebase';

const useStyles = makeStyles(() => ({
  profilePic: {
    width: 120,
    height: 120,
  },
  button: {
    textDecoration: 'none',
  },
}));

const Sidebar = () => {
  const classes = useStyles();
  const user = useContext(UserContext);
  const { photoURL, displayName, email } = user;

  return (
    <Location>
      {({ location }) => {
        const link = location.pathname === '/trip' ? '/' : '/trip';
        const text = location.pathname === '/trip' ? 'Modify My Network' : 'Schedule a Grocery Trip';
        return (
          <>
            <Avatar className={classes.profilePic} src={photoURL} />
            <Typography variant="h4">{displayName}</Typography>
            <Typography variant="h6">{email}</Typography>
            <Button onClick={async () => {
              await auth.signOut();
              document.location.href = '/';
            }}
            >
              Sign out
            </Button>


            <br />
            <Link to={link} className={classes.button}>
              <Button variant="contained" color="secondary">{text}</Button>
            </Link>

          </>
        );
      }}
    </Location>
  );
};

export default Sidebar;
