import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import { List, ListSubheader, Card } from "@material-ui/core";
import NewContact from "../controls/NewContact";
import ContactListItem from "../controls/ContactListItem";
import { getContactDoc } from "../services/contactService";


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
  return (
    <Card>
    <List subheader={<ListSubheader>Your Contacts</ListSubheader>}>
      {contacts.map((p) => (<ContactListItem key={p.email} contact={p} />))}
      <NewContact onAdded={() => setLoaded(false)}/>
    </List>
    </Card>
  );
};
export default ProfilePage;
