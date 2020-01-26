import { functions } from './firebase';

export const createProduct = (uid, name, amount, currency, interval) => {
  let createStripeProduct = functions.httpsCallable('createStripeProduct');
  return createStripeProduct({ uid, name, amount, currency, interval })
}

export const deleteProduct = (uid, productID) => {
  let deleteStripeProduct = functions.httpsCallable('deleteStripeProduct');
  return deleteStripeProduct({ uid, productID })
}
