import React, { useState } from "react";
import { Link } from "@reach/router";
import { Button, TextField, Grid, Typography } from '@material-ui/core';
import { auth } from "../firebase";
import { makeStyles } from '@material-ui/core/styles';
import Box from '../controls/Box';

const useStyles = makeStyles((theme) => ({
  box: {
    backgroundColor: theme.cardBackground,
    padding: '2.5em',
    marginTop: '5em',
    borderRadius: 12
  },
  text: {
    marginTop: 14,
    marginBottom: 14,
  },
  button: {
    marginBottom: 14
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
    <Grid item className={classes.box} xs={6}>
      <Box>
        <form action="">

        <Typography className={classes.text} variant="h4" component="h2">Collab(oration) Helper</Typography>
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
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.currentTarget.value)}
            fullWidth
            className={classes.text}
          />
          <Button  className={classes.button}
            variant="contained"
            color="primary"
            onClick={sendResetEmail}
          >
            Send me a reset link
          </Button>
        </form>
        <Link to ="/"> &larr; back to sign in page</Link>
        </Box>
      </Grid>
      </Grid>
  );
};
export default PasswordReset;