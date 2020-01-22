'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const stripe = require('stripe')(functions.config().stripe.token);
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
