import React, {useState, useContext} from 'react';
import { UserContext } from "../providers/UserProvider";
import {ListItem, Grid, Button} from '@material-ui/core';
import {saveNewContact} from '../services/contactService';

import TextBox from './TextBox';



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
          <Grid item xs={5} >
            <TextBox fullWidth label="Full Name" value={name} onChange={ e => setName(e.target.value)} />
          </Grid>
          <Grid item xs={5}>
            <TextBox fullWidth label="Email Address" type="email" value={email} onChange={ e => setEmail(e.target.value)} />
          </Grid>
          <Grid item xs={2} style={{display: "flex", flexDirection: "column-reverse"}}>
            <Button type="submit" variant="contained" disabled={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !name} color="primary" >
              Add
            </Button>
          </Grid>
        </Grid>
      </ListItem>
    </form>
)
};

export default NewContact;
