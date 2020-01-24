import { functions } from './firebase';


export const createProduct = (uid, name) => {
  let createStripeProduct = functions.httpsCallable('createStripeProduct');
  return createStripeProduct({uid: uid, name: name})
}
