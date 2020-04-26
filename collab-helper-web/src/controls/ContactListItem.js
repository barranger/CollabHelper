import React from "react";
import { ListItem, ListItemAvatar, ListItemText, Avatar, Typography } from "@material-ui/core";

const ContactListItem = ({ contact }) => {
  return (
    <ListItem alignItems="flex-start" key={contact.email}>
      <ListItemAvatar>
        <Avatar src="/static/images/avatar/1.jpg" />
      </ListItemAvatar>
      <ListItemText
        primary={contact.name}
        secondary={
          <React.Fragment>
            <Typography component="span" variant="body2" color="textPrimary">
              {contact.email}
              <br />
              {contact.phone}
            </Typography>
          </React.Fragment>
        }
      />
    </ListItem>
  );
};

export default ContactListItem;
