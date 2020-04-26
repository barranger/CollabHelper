import React, { useState } from "react";
import { Link } from "@reach/router";
import { auth } from "../firebase";
import { generateUserDocument } from "../firebase";
import { Typography, Button, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
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
  root: {
    marginTop: '4em',
  }
}));

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(null);
  const createUserWithEmailAndPasswordHandler = async (
    event,
    email,
    password
  ) => {
    event.preventDefault();
    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      generateUserDocument(user, { displayName });
    } catch (error) {
      setError("Error Signing up with email and password");
    }

    setEmail("");
    setPassword("");
    setDisplayName("");
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
          <Typography className={[classes.text, classes.header].join(' ')} variant="h4" component="h2">CollabHelper</Typography>
          {error !== null && (
            <div className="py-4 bg-red-600 w-full text-white text-center mb-3">
              {error}
            </div>
          )}
          <form className="">
            <TextBox
              type="text"
              fullWidth
              className={classes.text}
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.currentTarget.value)}
            />

            <TextBox
              type="email"
              fullWidth
              className={classes.text}
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <TextBox
              type="password"
              fullWidth
              className={classes.text}
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <Button
              variant="contained"
              fullWidth
              color="primary"
              onClick={(event) => {
                createUserWithEmailAndPasswordHandler(event, email, password);
              }}
            >
              Sign up
            </Button>
          </form>
          <p>
            Already have an account?{" "}
            <Button component={Link} color="primary" to="/">
              Sign in here
            </Button>
          </p>
      </Grid>
    </Grid>
  );
};
export default SignUp;
