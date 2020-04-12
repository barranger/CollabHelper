import React, { useContext }  from "react";
import { Router } from "@reach/router";
import { UserContext } from "../providers/UserProvider";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ProfilePage from "./ProfilePage";
import PasswordReset from "./PasswordReset";
import GroceryTrip from './GroceryTrip';

function Application() {
  const user = useContext(UserContext);
  return (
        user ?
        <Router>
          <ProfilePage path="/" />
          <GroceryTrip path="/trip" />
        </Router>
      :
        <Router>
          <SignUp path="signUp" />
          <SignIn path="/" />
          <PasswordReset path = "passwordReset" />
        </Router>

  );
}
export default Application;