import {firestore} from "../firebase";


export const saveNewTrip = async (user, where, when) => {
  console.log('I have the user', user);

  if (!user) return;

  const doc = await firestore.collection('trips').add({
    uid: user.uid,
    where,
    when
  });
  return doc.id;
}

export const getTripById = async (id) => {
  
  const contactRef = firestore.doc(`trips/${id}`);
  const snapshot = await contactRef.get();
  return snapshot.data();
}