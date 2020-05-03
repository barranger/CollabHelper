import firebase from 'firebase/app';
import { firestore } from '../firebase';
import Logger from './loggingService';


export const saveNewContact = async (user, name, email, phone) => {
  Logger.log('I have the user', user);

  let validPhone = phone;
  if (!user) return;
  const contactRef = firestore.doc(`contacts/${user.uid}`);
  const snapshot = await contactRef.get();
  if (/^(\()?\s{3}(\))?(-|\s)?\s{3}(-|\s)\s{4}$/.test(phone)) {
    validPhone = null;
  }
  if (!snapshot.exists) {
    try {
      await contactRef.set({
        contacts: [
          { name, email, validPhone },
        ],
      });
    } catch (error) {
      Logger.error('Error creating contact document', error);
    }
  } else {
    contactRef.update({
      contacts: firebase.firestore.FieldValue.arrayUnion({ name, email, validPhone }),
    });
  }
};

export const getContactDoc = async (uid) => {
  if (!uid) return null;
  try {
    const contactDoc = await firestore.doc(`contacts/${uid}`).get();
    return {
      uid,
      ...contactDoc.data(),
    };
  } catch (error) {
    Logger.error('Error fetching contact', error);
  }
  return null;
};
