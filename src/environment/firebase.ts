import * as firebase from 'firebase-admin';

export class Environment {
  static firebaseAdminConfig = {
    credential: firebase.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,

      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  };

  static firebaseConfig = {
    apiKey: 'AIzaSyBZPTLYSCBuiaNSvT6J3UOCoF4KBNQlXQY',
    authDomain: 'integrated-ii.firebaseapp.com',
    projectId: 'integrated-ii',
    storageBucket: 'integrated-ii.appspot.com',
    messagingSenderId: '560687771272',
    appId: '1:560687771272:web:6ba9812655b942c731b93d',
    measurementId: 'G-CBRB1BW741',
  };
}
