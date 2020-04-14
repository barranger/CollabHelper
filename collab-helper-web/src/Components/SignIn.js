import React, { useState } from "react";
import { Link } from "@reach/router";
import { auth, analytics, signInWithGoogle } from "../firebase";
import {TextField, Typography, Button, Grid} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  text: {
    marginTop: 14,
    marginBottom: 14,
  },
}));

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  analytics.logEvent('Analytics from SignIn');
  const signInWithEmailAndPasswordHandler = (event, email, password) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password).catch(error => {
      setError("Error signing in with password and email!");
      console.error("Error signing in with password and email", error);
    });
  };

  const classes = useStyles();

  return (
    <Grid container className={classes.root} spacing={2}>
    <Grid item xs={6}>
       
        {error !== null && (
          <div >
            {error}
          </div>
        )}
        <form className="">
          <Typography className={classes.text} variant="h4" component="h2">Collab(oration) Helper</Typography>
          <TextField
            className={classes.text}
            fullWidth
            type="email"
            label="Email"
            value={email}
            onChange={(e, val) => setEmail(e.currentTarget.value)}
          />
          <TextField
            fullWidth
            className={classes.text}
            type="password"
            label="Password"
            value={password}
            onChange={e => setPassword(e.currentTarget.value)}
          />
          <Button color="primary" variant="contained"
            onClick={event => {
              signInWithEmailAndPasswordHandler(event, email, password);
            }}
          >
            Sign in
          </Button>
        </form>
        <p className="text-center my-3">or</p>
        <Button variant="contained" color="secondary"
          onClick={signInWithGoogle}>
          Sign in with Google
        </Button>
        <p className="text-center my-3">
          Don't have an account?{" "}
          <Link to="signUp" className="text-blue-500 hover:text-blue-600">
            Sign up here
          </Link>{" "}
          <br />{" "}
          <Link
            to="passwordReset"
            className="text-blue-500 hover:text-blue-600"
          >
            Forgot Password?
          </Link>
        </p>
        
     </Grid>
     </Grid>
  );
};
export default SignIn;
