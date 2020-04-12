import React, {useState} from 'react';
import {Grid, TextField, Button} from '@material-ui/core';
import { auth, analytics, functions } from "../firebase";



const GroceryTrip = props => {
  const [where, setWhere] = useState('');
  const [when, setWhen] = useState('');

  const sendEmail = () => {
    const callable = functions.httpsCallable("notifyTripCreated");
    console.log('about to call')
    return callable({
      tripStoreName: where,
      tripDateTime:  when //"2020-04-12T09:00:00"
  
    }).then(console.log).catch(err => {
      console.log('got an error calling', err)
    });
  };

  return (
    <>
      <TextField fullWidth label="Where are you going" onChange={e => setWhere(e.target.value)} value={where} />
      <TextField fullWidth label="About when will you be leaving" onChange={e => setWhen(e.target.value)} value={when} />
      <Button variant="contained" color="primary" onClick={sendEmail}>Schedule Grocery Trip</Button>
    </>
  )
}

export default GroceryTrip;
