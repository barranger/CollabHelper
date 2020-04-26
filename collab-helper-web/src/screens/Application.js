import React, { useContext }  from "react";
import { Router } from "@reach/router";
import {Grid, Typography} from "@material-ui/core";
import { UserContext } from "../providers/UserProvider";
import {Location} from '@reach/router';
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ProfilePage from "./ProfilePage";
import PasswordReset from "./PasswordReset";
import GroceryTrip from './GroceryTrip';
import Sidebar from '../controls/Sidebar';
import RequestItem from "./RequestItem";
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  text: {
    marginBottom: 14,
  },
  header: {
    color: theme.palette.primary.main,
    fontWeight: '900',
  },
  root: {
    marginTop: '4em',
  }
}));

function Application() {
  const user = useContext(UserContext);
  const classes = useStyles();
  return (
        user ?
        <Grid container>
          <Grid item xs={2}></Grid>
          <Grid item xs={2}>
            <Location>
              <Sidebar />
            </Location>
          </Grid>
          <Grid item xs={6}>
            <Typography className={[classes.text, classes.header]} variant="h4" component="h2">CollabHelper</Typography>
              <Router>
                <ProfilePage path="/" />
                <GroceryTrip path="/trip" />
                <RequestItem path="/trip/:tripId" />
              </Router>
          </Grid>
        </Grid>
      :
        <Router>
          <SignUp path="signUp" />
          <SignIn path="/" />
          <PasswordReset path = "passwordReset" />
        </Router>

  );
}
export default Application;