'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const stripe = require('stripe')(functions.config().stripe.token);
const endpointSecret = functions.config().stripe.endpoint_secret;
const currency = functions.config().stripe.currency || 'USD';

// [START concludeConnect]
// Send auth code to stripe to conclude the connect process
exports.concludeConnect = functions.firestore.document('stripe_connects/{documentId}')
  .onCreate(async (snap, context) => {
    const val = snap.data();
    try {
      // send auth code to stripe
      const response = await stripe.oauth.token({ grant_type: 'authorization_code', code: val.stripeConnectAuthCode });
      // add stripeUserID to user & cleanup fields
      await admin.firestore().collection('users').doc(val.uid)
        .set({
          stripeConnectAccountID: response.stripe_user_id,
          stripeConnectStatus: "CONNECTED"
        }, { merge: true });
      // delete stripe_connect record
      return snap.ref.delete();
    } catch(error) {
      // log error
      return admin.firestore().collection('users').doc(val.uid).set({ error: error, stripeConnectStatus: `ERROR: ${error}` }, { merge: true });
    }
});
// [END concludeConnect]

// [START events]
// receive and process Stripe Hooks
exports.events = functions.https.onRequest((request, response) => {
  const signature = request.headers["stripe-signature"];
  try {
    let event = stripe.webhooks.constructEvent(request.rawBody, signature, endpointSecret);
    return admin.firestore().collection('events').add(event)
      .then((docRef) => {
        return response.json({ received: true, ref: docRef.id });
      })
      .catch((err) => {
        console.error(err)
        return response.status(500).end();
      });
  }
  catch (err) {
    return response.status(400).end();
  }
});
// exports.exampleStripeHookTrigger = functions.database.ref('/stripe_events/{eventId}').onCreate((snapshot, context) => {
//   return console.log({
//     eventId: context.params.eventId,
//     data: snapshot.val()
//   });
// });
// [END events]
