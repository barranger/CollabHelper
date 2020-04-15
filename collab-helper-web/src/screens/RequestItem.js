import React, { useEffect, useState, useContext } from "react";
import { Typography, TextField, Button, Dialog } from "@material-ui/core";
import Box from "../controls/Box";
import { makeStyles } from "@material-ui/core/styles";
import { getTripById, addItemToTrip } from "../services/tripService";
import {  DialogActions, 
          DialogContent, 
          DialogContentText,
          DialogTitle } from "@material-ui/core";
import { UserContext } from "../providers/UserProvider";

const useStyles = makeStyles((theme) => ({
  whiteBg: {
    backgroundColor: "white",
  },
  button: {
    marginTop: 14,
  },
}));

const RequestItem = ({ tripId }) => {
  const [loaded, setLoaded] = useState(false);
  const [trip, setTrip] = useState({});
  const [item, setItem] = useState();
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  
  const user = useContext(UserContext);

  const requestItem = () => {
    console.log('I will add the item', item)
    addItemToTrip(user, tripId, item);
  };
  useEffect(() => {
    async function getTrip() {
      if (!loaded) {
        const incoming = await getTripById(tripId);
        setTrip(incoming);
        setLoaded(true);
      }
    }
    getTrip();
  });
  return [
    <Box>
      <form onSubmit={e => {e.preventDefault(); setOpen(true)}}>
        <Typography>Request something from {trip.where}</Typography>
        <Typography>on {trip.when}</Typography>
        <TextField
          value={item}
          label="What do you need"
          fullWidth
          onChange={(e) => setItem(e.target.value)}
        />
        <Button
          className={classes.button}
          type="submit"
          variant="contained"
          color="primary"
        >
          Request Item
        </Button>
      </form>
    </Box>,
    <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle className={classes.whiteBg} id="alert-dialog-title">
        {"Request an item??"}
      </DialogTitle>
      <DialogContent className={classes.whiteBg}>
        <DialogContentText id="alert-dialog-description">
          By Requesting an item to be picked up for you, you are acknowledging
          that you will pay for the item. Payment for the item must be done
          between you and the person picking up the item, and will not be done
          by this app.
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.whiteBg}>
        <Button onClick={() => setOpen(false)} color="primary">
          Disagree
        </Button>
        <Button onClick={() => { setOpen(false); requestItem() }} color="primary" autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>,
  ];
};

export default RequestItem;
