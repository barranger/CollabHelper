import React, { useState } from "react";
import { Link } from "@reach/router";
import { auth } from "../firebase";
import { generateUserDocument } from "../firebase";
import { TextField, Typography, Button, Grid } from "@material-ui/core";
import Box from "../controls/Box";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  box: {
    backgroundColor: theme.cardBackground,
    padding: "2.5em",
    marginTop: "5em",
    borderRadius: 12,
  },
  text: {
    marginTop: 14,
    marginBottom: 14,
  },
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
      <Grid item className={classes.box} xs={6}>
        <Box>
          <Typography className={classes.text} variant="h4" component="h2">
            Collab(oration) Helper
          </Typography>
          {error !== null && (
            <div className="py-4 bg-red-600 w-full text-white text-center mb-3">
              {error}
            </div>
          )}
          <form className="">
            <TextField
              type="text"
              fullWidth
              className={classes.text}
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.currentTarget.value)}
            />

            <TextField
              type="email"
              fullWidth
              className={classes.text}
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <TextField
              type="password"
              fullWidth
              className={classes.text}
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <Button
              variant="contained"
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
            <Link to="/" className="text-blue-500 hover:text-blue-600">
              Sign in here
            </Link>
          </p>
        </Box>
      </Grid>
    </Grid>
  );
};
export default SignUp;
