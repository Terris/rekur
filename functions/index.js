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
      // add stripeUserID, refreshToken to user & cleanup connect doc
      await admin.firestore().collection('users').doc(val.uid)
        .set({
          stripeConnectAccountID: response.stripe_user_id,
          stripeConnectStatus: "CONNECTED",
          stripeRefreshToken: response.refresh_token,
        }, { merge: true });
      // delete stripe_connect record
      return snap.ref.delete();
    } catch(error) {
      // log error
      await logError(error, val, "functions.concludeConnect");
      return admin.firestore().collection('users').doc(val.uid).set({ stripeConnectStatus: `ERROR: ${error}` }, { merge: true });
    }
});
// [END concludeConnect]

// [START createStripeProduct]
// create a stripe product and a firestore product
exports.createStripeProduct = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }
  const user = await getUser(data.uid);
  const stripeProduct = await stripe.products
    .create({ name: data.name, type: 'service' }, { stripe_account: user.stripeConnectAccountID })
    .catch(error => {
      logError(error, context, "functions.createStripeProduct.stripeProduct");
      throw new functions.https.HttpsError('error', error);
    })
  return admin.firestore().collection('users').doc(data.uid).collection('products')
    .add({ name: data.name, stripeProductID: stripeProduct.id })
    .catch(error => {
      logError(error, context, "functions.createStripeProduct");
      throw new functions.https.HttpsError('error', error);
    });
});
// [END createStripeProduct]

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
      .catch((error) => {
        logError(error, event, "functions.events - collection('events').add" )
        return response.status(500).end();
      });
  }
  catch (error) {
    logError(error, event, "functions.events" )
    return response.status(400).end();
  }
});
// [END events]

// exports.exampleStripeHookTrigger = functions.database.ref('/stripe_events/{eventId}').onCreate((snapshot, context) => {
//   return console.log({
//     eventId: context.params.eventId,
//     data: snapshot.val()
//   });
// });

// [START Utilities]
// get user
function getUser(uid) {
  return admin.firestore().collection('users').doc(uid)
    .get()
    .then(doc => {
      return doc.data();
    })
    .catch(error => logError(error, uid, "functions.getUser"))
}

function logError(error, context, note) {
  admin.firestore().collection('errors').add({ error: error, context: context, note: note })
}
// [END Utilities]
