import React, { useContext, useEffect, useState } from 'react';
import { List, ListSubheader } from '@material-ui/core';
import { UserContext } from '../providers/UserProvider';
import NewContact from '../controls/NewContact';
import ContactListItem from '../controls/ContactListItem';
import { getContactDoc } from '../services/contactService';


const ProfilePage = () => {
  const user = useContext(UserContext);
  const [contacts, setContacts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function getContacts() {
      if (!loaded) {
        const contactDoc = await getContactDoc(user.uid);
        setContacts(contactDoc.contacts);
        setLoaded(true);
      }
    }
    getContacts();
  });
  if (contacts) {
    return (
      <List subheader={<ListSubheader>People in your network</ListSubheader>}>
        {contacts.map((p) => (<ContactListItem key={p.email} contact={p} />))}
        <NewContact onAdded={() => setLoaded(false)} />
      </List>
    );
  }
  return (
    <List subheader={<ListSubheader>People in your network</ListSubheader>}>
      <NewContact onAdded={() => setLoaded(false)} />
    </List>
  );
};
export default ProfilePage;
