import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Application from './screens/Application';
import UserProvider from './providers/UserProvider';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: '100vh',
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
