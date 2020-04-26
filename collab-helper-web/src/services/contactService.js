import {firestore} from "../firebase";
import firebase from "firebase/app";


export const saveNewContact = async (user, name, email, phone) => {
  console.log('I have the user', user);

  if (!user) return;
  const contactRef = firestore.doc(`contacts/${user.uid}`);
  const snapshot = await contactRef.get();
  if (/^(\()?\s{3}(\))?(-|\s)?\s{3}(-|\s)\s{4}$/.test(phone)) {
    phone = null;
  }
  if (!snapshot.exists) {
    try {
      await contactRef.set({
        contacts: [
          { name, email, phone}
        ]
      });
    } catch (error) {
      console.error("Error creating contact document", error);
    }
  }
  else {
    contactRef.update({ contacts: firebase.firestore.FieldValue.arrayUnion({ name, email, phone})})
  }
}

export const getContactDoc = async uid => {
  if (!uid) return null;
  try {
    const contactDoc = await firestore.doc(`contacts/${uid}`).get();
    return {
      uid,
      ...contactDoc.data()
    };
  } catch (error) {
    console.error("Error fetching contact", error);
  }
};