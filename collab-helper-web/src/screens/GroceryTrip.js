import React, {useState, useContext} from 'react';
import {Button} from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import { functions } from "../firebase";
import { UserContext } from "../providers/UserProvider";
import { Card } from '@material-ui/core';
import {saveNewTrip} from '../services/tripService';
import { KeyboardDateTimePicker } from "@material-ui/pickers";
import TextBox from '../controls/TextBox';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1em'
  }
}));

const GroceryTrip = props => {
  const [where, setWhere] = useState('');
  const [when, setWhen] = useState(null);

  const user = useContext(UserContext);
  const classes = useStyles();

  const sendEmail = async () => {
    const id = await saveNewTrip(user, where, when.format());
    const callable = functions.httpsCallable("notifyTripCreated");
    return callable({
      tripStoreName: where,
      tripDateTime:  when.format(), //"2020-04-12T09:00:00"
      id
    }).then( result => {
      console.log('result is', result)
      document.location = `/trip/${id}`;
    }).catch(err => {
      console.log('got an error calling', err)
    });
  };

  return (
    <Card className={classes.root}>
      <TextBox fullWidth label="Where are you going" onChange={e => setWhere(e.target.value)} value={where} />
      <KeyboardDateTimePicker
        variant="inline"
        value={when}
        onChange={setWhen}
        label="About when will you be leaving"
        onError={console.log}
        minDate={new Date()}
        disablePast="true"
        format="MM/DD/YYYY hh:mm a"
        fullWidth
      />
      <Button className={classes.button} variant="contained" disabled={!where || !when} color="primary" onClick={sendEmail}>Schedule Grocery Trip</Button>
      </Card>
  )
}

export default GroceryTrip;
