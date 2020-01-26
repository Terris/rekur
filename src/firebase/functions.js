import { functions } from './firebase';

export const createPlan = (uid, name, amount, currency, interval) => {
  let createStripePlan = functions.httpsCallable('createStripePlan');
  return createStripePlan({ uid, name, amount, currency, interval })
}

export const deletePlan = (uid, planID, productID) => {
  let deleteStripePlan = functions.httpsCallable('deleteStripePlan');
  return deleteStripePlan({ uid, planID, productID })
}
