'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const stripe = require('stripe')(functions.config().stripe.token);
const endpointSecret = functions.config().stripe.endpoint_secret;
const currency = functions.config().stripe.currency || 'USD';

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
        return response.status(500).end();
      });
  }
  catch (error) {
    return response.status(400).end();
  }
});
// [END events]

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
      return admin.firestore().collection('users').doc(val.uid).set({ stripeConnectStatus: `ERROR: ${error}` }, { merge: true });
    }
});
// [END concludeConnect]

// [START createStripePlan]
// create a Stripe Plan & Product
exports.createStripePlan = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }
  const user = await getUser(data.uid);
  const stripePlan = await stripe.plans
    .create({
      amount: data.amount,
      currency: data.currency,
      interval: data.interval,
      product: { name: data.name },
    }, { stripeAccount: user.stripeConnectAccountID })
    .catch(error => {
      throw new functions.https.HttpsError('error', error);
    })
  return admin.firestore().collection('users').doc(data.uid).collection('plans').doc(stripePlan.id)
    .set({
      name: data.name,
      amount: data.amount,
      currency: data.currency,
      interval: data.interval,
      stripePlanID: stripePlan.id,
      stripeProductID: stripePlan.product,
    })
    .then((docRef) => { return { id: docRef.id } })
    .catch(error => {
      throw new functions.https.HttpsError('error', error);
    });
});
// [END createStripePlan]

// [START deleteStripePlan]
// create a Stripe Plan & Product
exports.deleteStripePlan = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }
  const user = await getUser(data.uid);
  // delete the plan
  const stripePlan = await stripe.plans
    .del(data.planID, { stripeAccount: user.stripeConnectAccountID })
    .catch(error => {
      console.log(error);
      throw new functions.https.HttpsError('error', error);
    })
  // delete the associated product
  await stripe.products
    .del(data.productID, { stripeAccount: user.stripeConnectAccountID })
    .catch(error => {
      console.log(error);
      throw new functions.https.HttpsError('error', error);
    })
  return admin.firestore().collection('users').doc(data.uid).collection('plans').doc(stripePlan.id)
    .delete()
    .catch(error => {
      throw new functions.https.HttpsError('error', error);
    });
});
// [END deleteStripePlan]

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
