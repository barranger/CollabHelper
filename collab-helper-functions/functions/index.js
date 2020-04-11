const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require("@sendgrid/mail");
const cors = require('cors')({ origin: true });

// // https://firebase.google.com/docs/functions/write-firebase-functions

const path = require('path')
require('dotenv').config()

console.log('Process env: ', process.env);

admin.initializeApp();

// Create and Deploy Cloud Functions

exports.genericemail = functions.https.onRequest((req, res) => {
  const { toEmail, fromEmail, name, email, phone, message } = req.body;
  return cors(req, res, () => {
    var text = `<div>
      <h4>Information</h4>
      <ul>
        <li>
          Name - ${name || ""}
        </li>
        <li>
          Email - ${email || ""}
        </li>
        <li>
          Phone - ${phone || ""}
        </li>
      </ul>
      <h4>Message</h4>
      <p>${message || ""}</p>
    </div>`;
    const msg = {
      to: toEmail,
      from: fromEmail,
      subject: `Need anything? ${name} is going to the store soon!`,
      text: text,
      html: text
    };
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    sgMail.send(msg).then(() => {
      res.status(200).send('{ "status": "success"}');
      return res;
    }).catch((err) => {
      res.status(500).send('{ "status": "error", "errorMessage": "' + err + '"}');
    });
  });
});