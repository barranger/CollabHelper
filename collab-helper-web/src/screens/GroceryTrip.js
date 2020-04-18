import React, {useState, useContext} from 'react';
import {TextField, Button} from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import { functions } from "../firebase";
import { UserContext } from "../providers/UserProvider";
import {saveNewTrip} from '../services/tripService';


const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: '2em'
  }
}));

const GroceryTrip = props => {
  const [where, setWhere] = useState('');
  const [when, setWhen] = useState('');

  const user = useContext(UserContext);
  const classes = useStyles();

  const sendEmail = async () => {

    const id = await saveNewTrip(user, where, when);
    const callable = functions.httpsCallable("notifyTripCreated");
    return callable({
      tripStoreName: where,
      tripDateTime:  when, //"2020-04-12T09:00:00"
      id
    }).then(console.log).catch(err => {
      console.log('got an error calling', err)
    });
  };

  return (
    <>
      <TextField fullWidth label="Where are you going" onChange={e => setWhere(e.target.value)} value={where} />
      <TextField fullWidth label="About when will you be leaving" onChange={e => setWhen(e.target.value)} value={when} />
      <Button className={classes.button} variant="contained" disabled={!where || !when} color="primary" onClick={sendEmail}>Schedule Grocery Trip</Button>
    </>
  )
}

export default GroceryTrip;
