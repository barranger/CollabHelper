import React, {useState} from 'react';
import {Grid, TextField, Button} from '@material-ui/core';

const GroceryTrip = props => {
  return (
    <>
      <TextField fullWidth label="Where are you going" />
      <TextField fullWidth label="About when will you be leaving" />
      <Button variant="contained" color="primary">Schedule Grocery Trip</Button>
    </>
  )
}

export default GroceryTrip;
