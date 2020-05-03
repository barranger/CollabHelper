import React, { useState } from 'react';
import { Link } from '@reach/router';
import { Typography, Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { auth, analytics, signInWithGoogle } from '../firebase';
import TextBox from '../controls/TextBox';
import Logger from '../services/loggingService';

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
  },
}));

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  analytics.logEvent('Analytics from SignIn');
  const signInWithEmailAndPasswordHandler = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password).catch((err) => {
      setError('Error signing in with password and email!');
      Logger.error('Error signing in with password and email', err);
    });
  };

  const classes = useStyles();

  return (

    <Grid
      container
      align="center"
      justify="center"
      className={classes.root}
      spacing={0}
    >
      <Grid item className={classes.box} xs={12} lg={4}>

        {error !== null && (
        <div>
          {error}
        </div>
        )}
        <form className="">
          <Typography className={[classes.text, classes.header].join(' ')} variant="h4" component="h2">CollabHelper</Typography>
          <TextBox
            className={classes.text}
            fullWidth
            label="Email:"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <TextBox
            fullWidth
            className={classes.text}
            type="password"
            label="Password:"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={(event) => {
              signInWithEmailAndPasswordHandler(event, email, password);
            }}
          >
            Sign in
          </Button>
        </form>
        <p>OR</p>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={signInWithGoogle}
        >
          Sign in with Google
        </Button>
        <p>
          <Button component={Link} to="passwordReset" color="primary">Forgot Password?</Button>
          <br />
          Don&apos;t have an account?
          {' '}
          <Button component={Link} color="primary" to="signUp">Sign up</Button>
        </p>
      </Grid>
    </Grid>
  );
};
export default SignIn;
