import { functions } from './firebase';


export const createProduct = (uid, name, amount, currency, interval) => {
  let createStripeProduct = functions.httpsCallable('createStripeProduct');
  return createStripeProduct({uid, name, currency})
}
