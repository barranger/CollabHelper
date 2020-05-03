import React, { useState, useContext } from 'react';
import { Button, Card } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { KeyboardDateTimePicker } from '@material-ui/pickers';
import { functions } from '../firebase';
import { UserContext } from '../providers/UserProvider';
import { saveNewTrip } from '../services/tripService';
import TextBox from '../controls/TextBox';
import Logger from '../services/loggingService';

const useStyles = makeStyles(() => ({
  root: {
    padding: '1em',
  },
}));

const GroceryTrip = () => {
  const [where, setWhere] = useState('');
  const [when, setWhen] = useState(null);

  const user = useContext(UserContext);
  const classes = useStyles();

  const sendEmail = async () => {
    const id = await saveNewTrip(user, where, when.format());
    const callable = functions.httpsCallable('notifyTripCreated');
    return callable({
      tripStoreName: where,
      tripDateTime: when.format(), // "2020-04-12T09:00:00"
      id,
    }).then(() => {
      document.location = `/trip/${id}`;
    }).catch((err) => {
      Logger.log('got an error calling', err);
    });
  };

  return (
    <Card className={classes.root}>
      <TextBox fullWidth label="Where are you going" onChange={(e) => setWhere(e.target.value)} value={where} />
      <KeyboardDateTimePicker
        variant="inline"
        value={when}
        onChange={setWhen}
        label="About when will you be leaving"
        onError={Logger.log}
        minDate={new Date()}
        disablePast="true"
        format="MM/DD/YYYY hh:mm a"
        fullWidth
      />
      <Button className={classes.button} variant="contained" disabled={!where || !when} color="primary" onClick={sendEmail}>Schedule Grocery Trip</Button>
    </Card>
  );
};

export default GroceryTrip;
