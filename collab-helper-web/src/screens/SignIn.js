import React, { useState } from "react";
import { Link } from "@reach/router";
import { auth, analytics, signInWithGoogle } from "../firebase";
import {TextField, Typography, Button, Grid} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Box from "../controls/Box";

const useStyles = makeStyles((theme) => ({
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

    <Grid container 
    align="center"
    justify="center"
    className={classes.root} 
    spacing={0}>
    <Grid item className={classes.box} xs={6}>
      <Box>
       
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
        <p>or</p>
        <Button variant="contained" color="secondary"
          onClick={signInWithGoogle}>
          Sign in with Google
        </Button>
        <p>
          <Link to="signUp">Sign up here</Link> | <Link to="passwordReset">Forgot Password?</Link>
        </p>
        </Box>
     </Grid>
     </Grid>
  );
};
export default SignIn;
