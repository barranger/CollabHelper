const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require("@sendgrid/mail");
const moment = require('moment');
//const firestore = require('@google-cloud/firestore');
// @firebase/firestore also was in here for a second

admin.initializeApp();

const firestore = admin.firestore();

// // https://firebase.google.com/docs/functions/write-firebase-functions

//const path = require('path')
require('dotenv').config();

//console.log('Process env: ', process.env);

// Create and Deploy Cloud Functions

exports.testing = functions.https.onCall(async (data, context) => {
  console.log('calling the testing method');

  if(!context.auth || !context.auth.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'No uid found in context');
  }
  const uid = context.auth.uid;
  console.log(`the user ${uid} sent the data`, data);

  return context.auth;

  // return new Promise((resolve, reject) => {
  //   const v = true;
  //   if (v) {
  //     resolve();
  //   } else {
  //     reject(new functions.https.HttpsError('internal', 'Test function failed!'));
  //   }
  // })
})

exports.notifyTripCreated = functions.https.onCall(async (data, context) => {
    try {

      if (!context.auth) {
        throw new functions.https.HttpsError('failed-precondition', 'Must be logged with an email address');
      }

      const fromEmail = 'annie.ellenberger@gmail.com'; // TODO remove this! 
      const storeName = data.tripStoreName;
      const time = data.tripDateTime; // TODO update this to proper format? in combo with UI handling? 
      const uid = context.auth.uid;
      if (!uid) {
        throw new functions.https.HttpsError('not-found', 'No uid found in context');
      }
      var userRecord = await admin.auth().getUser(uid);

      const helperName = userRecord.displayName || null;
      const helperEmail = userRecord.email || null;
      const helperPhone = userRecord.phoneNumber || null; // TODO get this one reading from user? ... userRecById.phoneNumber;

      if (!helperEmail || !helperName) {
        throw new functions.https.HttpsError('not-found', `No helperEmail and/or name found for ${uid}`);
      }

      const toContactsObj = await getUserContacts(uid);
      const toContacts = toContactsObj.contacts;
      if (toContacts === undefined || toContacts.length === 0) {
        throw new functions.https.HttpsError('not-found', `No contacts found for ${helperName}`);
      }
      var success = await trySendEmails(toContacts, storeName, time, helperName, helperEmail, helperPhone, fromEmail);


      if (success) {
        return true; 
      } else {
        throw new functions.https.HttpsError('internal', 'Sending emails failed');
      }

    } catch (error) {
      logError(error);
      return new functions.https.HttpsError('internal', 'CATCH: Sending emails failed', error); 
    }
  });

async function trySendEmails(toContacts, storeName, time, helperName, helperEmail, helperPhone, fromEmail) {
  var text = getEmailHtml(storeName, time, helperName, helperEmail, helperPhone);
  var i = 0;
  var bccUserEmails = [];
  try {
    const value = toContacts.forEach(async (contact) => {
      bccUserEmails.push(contact.email);
      console.log(`BCC Email ${i++}: ${contact.email}`);
    });
    
    var msg = getEmailMessage(bccUserEmails, fromEmail, helperName, text);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    await sgMail.send(msg);
    return true;
  } catch (error) {
    logError(error);
    return false;
  }
}


function logError(error) {
  console.log('Error processing email function:', error);
}

function getEmailMessage(bccUserEmails, fromEmail, helperName, text) {
  const msg = {
    to: fromEmail,
    bcc: bccUserEmails, 
    from: fromEmail,
    subject: `Need anything? ${helperName} is going to the store soon!`,
    text: text,
    html: text
  };
  return msg;
}

function getDetailedMessage(storeName, time) {
  const formattedTime = formatDate(time);
  return `Taking a trip to <strong>${storeName}</strong> at ${formattedTime}.`
}

function formatDate(dt) {
  if (!dt) {
    return 'N/A';
  }
  return moment(dt, 'YYYY-MM-DDThh:mm:ss').format('MM/DD/YYYY hh:mm a')
}

async function getUserContacts(uid) {
  if (!uid) return null;
  try {
    const document = await firestore.doc(`contacts/${uid}`).get();
    let userContacts = document.data();
    return userContacts;

  } catch (error) {
    console.error("Error fetching user contacts", error);
  }
  return null;
}

function getEmailHtml(storeName, time, helperName, helperEmail, helperPhone) {

  const detailedMessage = getDetailedMessage(storeName, time);
  const dirConstantMessage = 'Request your items soon!';  // TODO: add URL to where people request items??
  if (helperName) {
    var helperNameText = `<li>Name - ${helperName}</li>`
  }
  if (helperEmail) {
    var helperEmailText = `<li>Email - <a href="${helperEmail}">${helperEmail}</a></li>`
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