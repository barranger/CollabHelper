import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Application from "./Components/Application";
import UserProvider from "./providers/UserProvider";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#c2dde6',
    color: 'white',
    minHeight: '100vh'
  },
}));

function App() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Container maxWidth="lg">
        <UserProvider>
          <Application />
        </UserProvider>
      </Container>
    </div>
  );
}
export default App;
