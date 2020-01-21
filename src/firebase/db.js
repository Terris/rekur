import moment from 'moment';
import { db } from './firebase';

// User API
// ----------------------------------
export const user = (uid) =>
  db.collection("users").doc(uid)

export const userByEmail = (email) =>
  db.collection('users').where("email", "==", email).limit(1)

export const createUser = (displayName, email, photoURL, uid) =>
  db.collection('users').doc(uid).set({ displayName, email, photoURL, uid, created_at: moment().format() })

// Alerts API
// ----------------------------------
export const userAlerts = (uid) =>
  db.collection('users').doc(uid).collection('alerts')

export const userAlert = (uid, id) =>
  user(uid).collection('alerts').doc(id)

export const createUserAlert = (uid, alert) =>
  user(uid).collection('alerts').add({ ...alert, created_at: moment().format() })

export const deleteUserAlert = (uid, alertId) =>
  user(uid).collection('alerts').doc(alertId).delete()
