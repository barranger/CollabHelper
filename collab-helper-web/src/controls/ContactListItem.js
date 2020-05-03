import React from 'react';
import {
  ListItem, ListItemAvatar, ListItemText, Typography,
} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';

const ContactListItem = ({ contact }) => (
  <ListItem alignItems="flex-start" key={contact.email}>
    <ListItemAvatar>
      <AccountCircle color="secondary" style={{ fontSize: 50 }} />
    </ListItemAvatar>
    <ListItemText
      primary={contact.name}
      secondary={(
        <>
          <Typography component="span" variant="body2" color="textPrimary">
            {contact.email}
            <br />
            {contact.phone}
          </Typography>
        </>
        )}
    />
  </ListItem>
);

export default ContactListItem;
