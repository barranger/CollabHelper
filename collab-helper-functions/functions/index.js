const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require("@sendgrid/mail");
const cors = require('cors')({ origin: true });
const moment = require('moment');
//const firestore = require('@google-cloud/firestore');
// @firebase/firestore also was in here for a second

admin.initializeApp();

const firestore = admin.firestore();

// // https://firebase.google.com/docs/functions/write-firebase-functions

const path = require('path')
require('dotenv').config()

//console.log('Process env: ', process.env);

// Create and Deploy Cloud Functions

exports.genericemail = functions.https.onRequest((req, res) => {
  const { email, storeName, time } = req.body;

  admin.auth().getUserByEmail(email)
    .then((userRec) => {
      getUser(userRec)

      const helperName = userRec.displayName;
      const phone = userRec.phoneNumber;
      const message1 = getMessage(storeName, time);
      const message2 = 'Request your items soon!';

      let userContacts = getUserContacts(userRec.uid);

      //TODO - foreach to send email to all contacts ... once we get ONE working properly :) 
      //const toEmail = userContacts.contacts[0].email;
      //console.log("ToEmail: ", toEmail);

      return cors(req, res, () => {
        var text = `<div>
                      <h4>Information</h4>
                      <ul>
                        <li>
                          Name - ${helperName || ""}
                        </li>
                        <li>
                          Email - ${email || ""}
                        </li>
                        <li>
                          Phone - ${phone || ""}
                        </li>
                      </ul>
                      <h4>Message</h4>
                      <p>${message1 || ""}</p>
                      <p>${message2 || ""}</p>
                    </div>`;
        const msg = {
          to: 'annie.ellenberger+hardcodedToEmail@gmail.com',  //TODO remove hardcoded
          from: 'annie.ellenberger@gmail.com', //TODO remove hardcoded
          subject: `Need anything? ${helperName} is going to the store soon!`,
          text: text,
          html: text
        };
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        sgMail.send(msg)
          .then(() => {
            res.status(200).send('{ "status": "success"}');
            return res;
          }).catch((err) => {
            res.status(500).send('{ "status": "error", "errorMessage": "' + err + '"}');
          });
      })

    }).catch((error) => {
      logError(error);
      res.status(500).send('{ "status": "error", "errorMessage": "' + error + '"}');
    });
});

function getUser(userRecord) {
  // See the UserRecord reference doc for the contents of userRecord.
  console.log('Successfully fetched user data:', userRecord.toJSON());
}

function logError(error) {
  console.log('Error fetching user data:', error);
}

function getMessage(storeName, time) {
  const formattedTime = formatDate(time);
  return `Taking a trip to ${storeName} at ${formattedTime}.`
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
    console.log('UserContacts: ', userContacts);
    return userContacts;
    
  } catch (error) {
    console.error("Error fetching user contacts", error);
  }
  return null;
}