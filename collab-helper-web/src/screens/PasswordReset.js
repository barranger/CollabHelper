import React, { useState } from "react";
import { Link } from "@reach/router";
import { Button, TextField, Grid, Typography } from '@material-ui/core';
import { auth } from "../firebase";
import { makeStyles } from '@material-ui/core/styles';

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
        <form action="">

        <Typography className={classes.text} variant="h4" component="h2">Collab(oration) Helper</Typography>
          {emailHasBeenSent && (
            <div className="py-3 bg-green-400 w-full text-white text-center mb-3">
              An email has been sent to you!
            </div>
          )}
          {error !== null && (
            <div className="py-3 bg-red-600 w-full text-white text-center mb-3">
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
          <Button
            variant="contained"
            color="primary"
            onClick={sendResetEmail}
          >
            Send me a reset link
          </Button>
        </form>
        <Link
         to ="/"
          className="my-2 text-blue-700 hover:text-blue-800 text-center block"
        >
          &larr; back to sign in page
        </Link>
      </Grid>
      </Grid>
  );
};
export default PasswordReset;