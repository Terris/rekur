'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const stripe = require('stripe')(functions.config().stripe.token);
const currency = functions.config().stripe.currency || 'USD';

// [START concludeConnect]
// Send auth code to stripe to conclude the connect process
exports.concludeConnect = functions.firestore.document('stripe_connects/{documentId}').onCreate(async (snap, context) => {
  const val = snap.data();
  try {
    const response = await stripe.oauth.token({ grant_type: 'authorization_code', code: val.stripeConnectAuthCode });
    return snap.ref.set({ stripeConnectAccountID: response.stripe_user_id }, { merge: true });
  } catch(error) {
    return snap.ref.set({ error: error }, { merge: true });
  }
});
// [END concludeConnect]
