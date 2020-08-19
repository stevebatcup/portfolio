import * as functions from 'firebase-functions';
import * as sgMail from '@sendgrid/mail';
const HttpsError = require('https-error');


const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_KEY);

export const contactEmail = functions.https.onCall(async (data, context) => {
  new Promise(function (resolve, reject) {
    const msg = {
      to: 'steve.batcup@gmail.com',
      from: 'steve@maawol.com',
      templateId: TEMPLATE_ID,
      dynamic_template_data: {
        sender_name: data.name,
        sender_email: data.email,
        sender_message: data.message,
        subject: "New Portfolio enquiry"
      },
    };

    return sgMail.send(msg)
      .then(() => {
        resolve(
          { message: "Email sent" }
        );
      }).catch(err => {
        console.log(err);
        console.log(err.response.body)
        reject(
          new HttpsError('unknown', 'Error sending email')
        );
      });
  });
});