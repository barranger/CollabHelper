import React, { useState } from "react";
import { Link } from "@reach/router";
import { Button, Grid, Typography } from '@material-ui/core';
import { auth } from "../firebase";
import { makeStyles } from '@material-ui/core/styles';
import TextBox from '../controls/TextBox';

const useStyles = makeStyles((theme) => ({
  text: {
    marginTop: 14,
    marginBottom: 14,
  },
  header: {
    color: theme.palette.primary.main,
    fontWeight: '900',
  },
  button: {
    marginBottom: 14
  },
  root: {
    marginTop: '4em',
  }
}));


const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [emailHasBeenSent, setEmailHasBeenSent] = useState(false);
  const [error, setError] = useState(null);
 
  const sendResetEmail = event => {
    event.preventDefault();
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        setEmailHasBeenSent(true);
        setTimeout(() => {setEmailHasBeenSent(false)}, 3000);
      })
      .catch(() => {
        setError("Error resetting password");
      });
  };

  const classes = useStyles();
  return (
    <Grid container 
    align="center"
    justify="center"
    className={classes.root} 
    spacing={0}>
    <Grid item className={classes.box} xs={12} lg={4}>
        <form action="">
          <Typography className={[classes.text, classes.header].join(' ')} variant="h4" component="h2">CollabHelper</Typography>
          {emailHasBeenSent && (
            <div >
              An email has been sent to you!
            </div>
          )}
          {error !== null && (
            <div>
              {error}
            </div>
          )}
          <TextBox
            label="Email:"
            type="email"
            value={email}
            onChange={e => setEmail(e.currentTarget.value)}
            fullWidth
            className={classes.text}
          />
          <Button  className={classes.button}
            variant="contained"
            color="primary"
            fullWidth
            onClick={sendResetEmail}
          >
            Send me a reset link
          </Button>
        </form>
        <Button color="primary" component={Link} to ="/"> &larr; back to sign in page</Button>
      </Grid>
      </Grid>
  );
};
export default PasswordReset;