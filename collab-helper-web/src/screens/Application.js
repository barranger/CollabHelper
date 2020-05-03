import React, { useContext, useState } from "react";
import { Router } from "@reach/router";
import { Grid, Typography, AppBar, Button, Toolbar } from "@material-ui/core";
import { UserContext } from "../providers/UserProvider";
import { Link, Location } from "@reach/router";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ProfilePage from "./ProfilePage";
import PasswordReset from "./PasswordReset";
import GroceryTrip from "./GroceryTrip";
import RequestItem from "./RequestItem";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { auth } from "../firebase";

const useStyles = makeStyles((theme) => ({
  text: {
    marginBottom: 14,
  },
  header: {
    color: theme.palette.primary.main,
    fontWeight: "900",
  },
  root: {
    flex: 1,
    minHeight: "100vh",
  },
  appBar: {
    backgroundColor: "white",
    paddingTop: "1em",
    paddingLeft: "1em",
  },
  mainButton: {
    marginTop: '1em',
    marginBottom: '1em',
    textDecoration: 'none',
    display: 'flex',
  },
  buttonHolder: {
    display: 'flex',
    flexDirection: 'row-reverse'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function Application() {
  const user = useContext(UserContext);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { displayName } = user || {};

  const margin = 2;
  return user ? (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
          <AppBar position="static" className={classes.appBar}>
            <Toolbar>
            <Typography
              className={[classes.text, classes.header, classes.title].join(" ")}
              variant="h5"
              component="h3"
            >
              CollabHelper
            </Typography>
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={(e) => { console.log('e is', e.currentTarget); setAnchorEl(e.currentTarget)}}
                color="inherit"
              >
                <AccountCircle color="primary" fontSize="large" />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}                
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={()=>{setAnchorEl(null)}}
              >
                <MenuItem>{displayName}</MenuItem>
                <MenuItem onClick={async () => {
                    await auth.signOut();
                    document.location.href = '/';
                  }
                }>Logout</MenuItem>
              </Menu>
            </div>
            </Toolbar>
          </AppBar>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={margin}></Grid>
        <Grid item xs={8} className={classes.buttonHolder}>
          <Location>
            {({ location }) => {
              const link = location.pathname === "/trip" ? "/" : "/trip";
              const text =
                location.pathname === "/trip"
                  ? "Modify My Network"
                  : "Schedule a Grocery Trip";
              return (
                <Link to={link} className={classes.mainButton}>
                  <Button variant="contained" color="primary">
                    {text}
                  </Button>
                </Link>
              );
            }}
          </Location>
        </Grid>
        <Grid item xs={margin}></Grid>
        <Grid item xs={margin}></Grid>
        <Grid item xs={8}>
          <Router>
            <ProfilePage path="/" />
            <GroceryTrip path="/trip" />
            <RequestItem path="/trip/:tripId" />
          </Router>
        </Grid>
      </Grid>
    </div>
  ) : (
    <Router>
      <SignUp path="signUp" />
      <PasswordReset path="passwordReset" />
      <SignIn default />
    </Router>
  );
}
export default Application;
