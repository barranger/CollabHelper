import React, { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";
import Box from "../controls/Box";
import { getTripById } from "../services/tripService";

const RequestItem = ({ tripId }) => {
  const [loaded, setLoaded] = useState(false);
  const [trip, setTrip] = useState();
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
  return (
    <Box>
      <Typography>Here is the Request Item for the trip: </Typography>
      <pre>{JSON.stringify(trip, null, 4)}</pre>
    </Box>
  );
};

export default RequestItem;