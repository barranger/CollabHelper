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
import Box from '../controls/Box';
import RequestItem from "./RequestItem";

function Application() {
  const user = useContext(UserContext);
  return (
        user ?
        <Grid container>
          <Grid item xs={3}>
            <Location>
              <Sidebar />
            </Location>
          </Grid>
          <Grid item xs={9}>
            <Box>

              <Typography variant="h4" component="h2">
                Collab(oration) Helper
              </Typography>
              <Router>
                <ProfilePage path="/" />
                <GroceryTrip path="/trip" />
                <RequestItem path="/trip/:tripId" />
              </Router>
            </Box>
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