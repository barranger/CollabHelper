import React, { useEffect, useState, useContext } from "react";
import { Typography, TextField, Button } from "@material-ui/core";
import Box from "../controls/Box";
import { makeStyles } from "@material-ui/core/styles";
import { getTripById, addItemToTrip } from "../services/tripService";
import RequestDialog from "../controls/RequestDialog";
import { UserContext } from "../providers/UserProvider";

const useStyles = makeStyles((theme) => ({
  whiteBg: {
    backgroundColor: "white",
  },
  button: {
    marginTop: 14,
  },
}));

const renderMyTrip = ( myTrip, trip ) => {
  if(!myTrip) {
    return;
  }

  const { items } = trip;

  if(!items) {
    return <Typography>No items have been requested yet.</Typography>
  }

  return (
    <>
      <Typography>
        Here are the Items people have requested for you to pick up
      </Typography>


      <ul>
        { items.map((i) => (
          <li key={i.user.uid}>
            {i.user.displayName}: {i.what}
          </li>
        ))}
      </ul>
    </>
  )
}

const RequestItem = ({ tripId }) => {
  const [loaded, setLoaded] = useState(false);
  const [trip, setTrip] = useState({});
  const [item, setItem] = useState("");
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const user = useContext(UserContext);

  const requestItem = () => {
    console.log("I will add the item", item);
    
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

  const myTrip = trip.uid === user.uid;
  const alreadyReq =
    trip.items &&
    trip.items.filter((i) => i.user && i.user.uid === user.uid).length > 0;

  return (
    <div>
      <Box>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          <Typography>Request something from {trip.where}</Typography>
          <Typography>on {trip.when}</Typography>

          {!myTrip && !alreadyReq && (
            <>
              <TextField
                value={item}
                label="What do you need"
                fullWidth
                onChange={(e) => setItem(e.target.value)}
              />
              <Button
                className={classes.button}
                disabled={!item || item.length === 0}
                type="submit"
                variant="contained"
                color="primary"
              >
                Request Item
              </Button>
            </>
          )}

          { renderMyTrip( myTrip, trip ) }

          {alreadyReq && (
            <>
              <Typography>
                You have requested:
              </Typography>
              {trip.items.filter((i) => i.user && i.user.uid === user.uid).map(i => <Typography key={i.user.uid}>{i.what}</Typography>)}
            </>
          )}
        </form>
      </Box>
      <RequestDialog open={open} setOpen={setOpen} requestItem={requestItem} />
    </div>
  );
};

export default RequestItem;
