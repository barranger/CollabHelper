import React, {useState, useContext} from 'react';
import { UserContext } from "../providers/UserProvider";
import {ListItem, Grid, TextField, Button} from '@material-ui/core';
import {saveNewContact} from '../services/contactService';




const NewContact = ({onAdded}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const user = useContext(UserContext);
  const addNewContact = (e) => {
    e.preventDefault();
    saveNewContact(user, name, email)
    setName('')
    setEmail('')


    if(onAdded) {
      onAdded();
    }
  }

  return (

    <form onSubmit={addNewContact}>
  <ListItem>
    <Grid container spacing={4}>
      <Grid item xs={4}>
        <TextField fullWidth label="Full Name" value={name} onChange={ e => setName(e.target.value)} />
      </Grid>
      <Grid item xs={4}>
        <TextField fullWidth label="Email Address" type="email" value={email} onChange={ e => setEmail(e.target.value)} />
      </Grid>
      <Grid item xs={4}>
        <Button type="submit" variant="contained" color="primary" >
          Add Contact
        </Button>
      </Grid>
    </Grid>
  </ListItem>
    </form>
)
};

export default NewContact;
