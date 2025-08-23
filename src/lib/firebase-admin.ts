import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: "brc-speedster.appspot.com",
  });
}

const auth = admin.auth();
const db = admin.firestore();
const storage = admin.storage();
const functions = admin.functions();

export { auth, db, storage, functions };
