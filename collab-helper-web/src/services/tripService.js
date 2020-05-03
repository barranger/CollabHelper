import firebase from 'firebase/app';
import { firestore } from '../firebase';


export const saveNewTrip = async (user, where, when) => {
  if (!user) return null;

  const doc = await firestore.collection('trips').add({
    uid: user.uid,
    where,
    when,
  });
  return doc.id;
};

export const getTripById = async (id) => {
  const contactRef = firestore.doc(`trips/${id}`);
  const snapshot = await contactRef.get();
  return snapshot.data();
};

export const addItemToTrip = async (user, tripId, requestedItem) => {
  if (!user) return;

  const docRef = firestore.doc(`trips/${tripId}`);
  await docRef.update({ items: firebase.firestore.FieldValue.arrayUnion({ user, requestedItem }) });
};
