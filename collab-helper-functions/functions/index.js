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

  if (!context.auth || !context.auth.uid) {
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
      throw new functions.https.HttpsError('not-found', 'No location or valid datetime found');
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

    var userContactsSplit = await splitUserContacts(toContacts);

    var newUserContacts = userContactsSplit[0];
    console.log('newUserContacts: ', newUserContacts);

    var existingUserContacts = userContactsSplit[1];
    console.log('existingUserContacts: ', existingUserContacts);


    if (newUserContacts.length > 0) {
      var successNewUsers = await trySendEmails(newUserContacts, storeName, tripDateTime, tripId, helperName, helperEmail, helperPhone, fromEmail, true);
    }
    if (existingUserContacts.length > 0) {
      var successExistingUsers = await trySendEmails(existingUserContacts, storeName, tripDateTime, tripId, helperName, helperEmail, helperPhone, fromEmail, false);
    }

    if (successNewUsers || successExistingUsers) {
      return true;
    } else {
      throw new functions.https.HttpsError('internal', 'Sending emails to contacts failed');
    }

  } catch (error) {
    await logError(error);
    return new functions.https.HttpsError('internal', 'CATCH: Sending emails failed', error);
  }
});

async function splitUserContacts(toContacts) {
  var usersRef = firestore.collection('users');
  var newUserContacts = [];
  var existingUserContacts = [];
  try {
    await toContacts.reduce(async (memo, contact,) => {
      await memo;
      console.log('Contact is: ', contact);

      let query = usersRef.where("email", "==", contact.email);
      var userDocument = await query.limit(1).get();

      console.log('UserDocument empty: ', userDocument.empty);

      if (userDocument.empty) {
        newUserContacts.push(contact);
      } else {
        let userDocs = userDocument.docs;
        for (let userDoc of userDocs) {
          var userDocData = userDoc.data();
          //console.log('UserDocument is: ', userDocData);
          existingUserContacts.push(contact);
        }
      }
    }, {});
    return [newUserContacts, existingUserContacts];
  } catch (error) {
    await logError(error);
    return false;
  }
}

async function trySendEmails(toContacts, storeName, tripDateTime, tripId, helperName, helperEmail, helperPhone, fromEmail, newUsersFlag) {

  var text = await getEmailHtml(storeName, tripDateTime, tripId, helperName, helperEmail, helperPhone, newUsersFlag);
  var subject = await getEmailSubject(storeName, helperName, newUsersFlag);

  var i = 0;
  var bccUserEmails = [];
  try {
    var value = toContacts.forEach(async (contact) => {
      bccUserEmails.push(contact.email);
      console.log(`BCC Email ${i++}: ${contact.email}`);
    });

    var msg = await getEmailMessage(fromEmail, bccUserEmails, text, subject);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    await sgMail.send(msg);
    return true;
  } catch (error) {
    await logError(error);
    return false;
  }
}

async function getEmailSubject(storeName, helperName, newUsersFlag) {
  if (newUsersFlag) {
    return `Welcome to Collab(oration) Helper. ${helperName} is going to ${storeName} soon! Need anything?`;
  } else {
    return `${helperName} is going to ${storeName} soon! Need anything?`;
  }
}

async function logError(error) {
  console.log('Error processing email function:', error);
}

async function getEmailMessage(fromEmail, bccUserEmails, text, subject) {
  var msg = {
    to: fromEmail,
    bcc: bccUserEmails,
    from: fromEmail,
    subject: subject,
    text: text,
    html: text
  };
  return msg;
}

async function getDetailedMessage(storeName, tripDateTime) {
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
  const mDateTime = moment(dt, 'YYYY-MM-DDThh:mm:ss');
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

async function getEmailHtml(storeName, tripDateTime, tripId, helperName, helperEmail, helperPhone, newUsersFlag) {

  if (newUsersFlag) {
    var newUserText =
      `<h4>Introduction</h4>
        <p>Welcome to Collab(oration) Helper! ${helperName} has invited you to be included in their network of family & friends collaborating on grocery shopping or other errands. 
           Please visit ${BASE_URL} to sign up and request items, configure your own network, and start collaborating with your family & friends!.
        </p>`
  }
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

  var text =
    `<div>
    ${newUserText || ""}
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