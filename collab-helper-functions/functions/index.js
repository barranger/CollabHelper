const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require("@sendgrid/mail");
const moment = require('moment');
//const firestore = require('@google-cloud/firestore');
// @firebase/firestore also was in here for a second

admin.initializeApp();

const firestore = admin.firestore();

// // https://firebase.google.com/docs/functions/write-firebase-functions

require('dotenv').config();

const BASE_URL = "https://collabhelper.web.app";

const fromEmail = 'annie.ellenberger@gmail.com'; // TODO remove this from code & also get a domain-specific noreply email address! 

// Create and Deploy Cloud Functions

exports.testing = functions.https.onCall(async (data, context) => {
  console.log('calling the testing method');

  if(!context.auth || !context.auth.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'No uid found in context');
  }
  const uid = context.auth.uid;
  console.log(`the user ${uid} sent the data`, data);

  return context.auth;
})

exports.notifyTripCreated = functions.https.onCall(async (data, context) => {
    try {

      if (!context.auth) {
        throw new functions.https.HttpsError('failed-precondition', 'Must be logged with an email address');
      }

      const tripId = data.id;
      const uid = context.auth.uid;
      if (!uid || !tripId) {
        throw new functions.https.HttpsError('not-found', 'No uid or tripId found');
      }
      
      const storeName = data.tripStoreName;
      const tripDateTime = data.tripDateTime; 
      
      const isValidDateTime = await validateDateTime(tripDateTime);

      if (!storeName || !isValidDateTime) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid location or datetime');
      }

      const userRecord = await getUserRecord(uid); //await admin.auth().getUser(uid);
      console.log('Successfully fetched user data:', JSON.stringify(userRecord));

      const helperName = userRecord.displayName || null;
      const helperEmail = userRecord.email || null;
      const helperPhone = userRecord.phoneNumber || null; // TODO add this to contact entry UI? would require switching to read User from datastore too, or custom attributes(?)

      if (!helperEmail || !helperName) {
        throw new functions.https.HttpsError('not-found', `No helperEmail and/or name found for ${uid}`);
      }

      const toContactsObj = await getUserContacts(uid);
      const toContacts = toContactsObj.contacts;
      if (toContacts === undefined || toContacts.length === 0) {
        throw new functions.https.HttpsError('not-found', `No contacts found for ${helperName}`);
      }
      var success = await trySendEmails(toContacts, storeName, tripDateTime, tripId, helperName, helperEmail, helperPhone, fromEmail);


      if (success) {
        return true; 
      } else {
        throw new functions.https.HttpsError('internal', 'Sending emails failed');
      }

    } catch (error) {
      await logError(error);
      return new functions.https.HttpsError('internal', 'CATCH: Sending emails failed', error); 
    }
  });

async function trySendEmails(toContacts, storeName, tripDateTime, tripId, helperName, helperEmail, helperPhone, fromEmail) {
  var text = await getEmailHtml(storeName, tripDateTime, tripId, helperName, helperEmail, helperPhone);
  var i = 0;
  var bccUserEmails = [];
  try {
    var value = toContacts.forEach(async (contact) => {
      bccUserEmails.push(contact.email);
      console.log(`BCC Email ${i++}: ${contact.email}`);
    });
    
    var msg = await getEmailMessage(bccUserEmails, fromEmail, helperName, text);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    await sgMail.send(msg);
    return true;
  } catch (error) {
    await logError(error);
    return false;
  }
}


async function logError(error) {
  console.log('Error processing email function:', error);
}

async function getEmailMessage(bccUserEmails, fromEmail, helperName, text) {
  var msg = {
    to: fromEmail,
    bcc: bccUserEmails, 
    from: fromEmail,
    subject: `Need anything? ${helperName} is going to the store soon!`,
    text: text,
    html: text
  };
  return msg;
}

async function getDetailedMessage(storeName, tripDateTime) {
  // TODO - split into date & time parts for formatting email .... 
  var formattedDateTime = await formatDateTime(tripDateTime);
  return `Taking a trip to <strong>${storeName}</strong> at ${formattedDateTime}.`
}

async function formatDateTime(dt) {
  if (!dt) {
    return 'N/A';
  }
  return moment(dt, 'YYYY-MM-DDThh:mm:ss').format('MM/DD/YYYY hh:mm a')
}

async function validateDateTime(dt) {
  const mDateTime = moment(dt,'YYYY-MM-DDThh:mm:ss');
  if (!mDateTime.isValid()) {
    logError(`User submitted invalid tripDateTime. Rejecting request. Val: ${dt}`);
    return false;
  } else if (!mDateTime.isAfter()) {
    logError(`User submitted tripDateTime before now. Rejecting request. Val: ${dt}`);
    return false;
  }
  return true;
}

async function getUserRecord(uid) {
  if (!uid) return null;
  try {
    const document = await firestore.doc(`users/${uid}`).get();
    let userRecord = document.data();
    return userRecord;

  } catch (error) {
    await logError(error);
    return null;
  }

}

async function getUserContacts(uid) {
  if (!uid) return null;
  try {
    const document = await firestore.doc(`contacts/${uid}`).get();
    let userContacts = document.data();
    return userContacts;

  } catch (error) {
    await logError(error);
    return null;
  }
}

async function getEmailHtml(storeName, tripDateTime, tripId, helperName, helperEmail, helperPhone) {

  var detailedMessage = await getDetailedMessage(storeName, tripDateTime);

  var requestURL = `${BASE_URL}/trip/${tripId}`

  var dirConstantMessage = `Request items soon, <a href="${requestURL}">by visiting Collab(oration) Helper here</a>!`;  // TODO: add URL to where people request items??

  if (helperName) {
    var helperNameText = `<li>Name - ${helperName}</li>`
  }
  if (helperEmail) {
    var helperEmailText = `<li>Email - <a href="mailto: ${helperEmail}">${helperEmail}</a></li>`
  }
  if (helperPhone) {
    var helperPhoneText = `<li>Phone - ${helperPhone}</li>`
  }
  var text = `<div>
  <h4>Message</h4>
  <p>${detailedMessage || ""}</p>
  <p>${dirConstantMessage || ""}</p>
  <h4>Helper Contact Information</h4>
  <ul>
    ${helperNameText || ""}
    ${helperEmailText || ""}
    ${helperPhoneText || ""}
  </ul>

</div>`;
  return text;
}