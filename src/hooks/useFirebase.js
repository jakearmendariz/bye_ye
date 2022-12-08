import { createContext, useContext, useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

// Environment variables from `.env` file.
const {
  REACT_APP_API_KEY,
  REACT_APP_AUTH_DOMAIN,
  REACT_APP_DATABASE_URL,
  REACT_APP_PROJECT_ID,
  REACT_APP_STORAGE_BUCKET,
  REACT_APP_MESSENGER_SENDER_ID,
  REACT_APP_APP_ID,
  REACT_APP_MEASUREMENT_ID
} = process.env;
const FIREBASE_CONFIG = {
  apiKey: REACT_APP_API_KEY,
  authDomain: REACT_APP_AUTH_DOMAIN,
  databaseUrl: REACT_APP_DATABASE_URL,
  projectId: REACT_APP_PROJECT_ID,
  storageBucket: REACT_APP_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_MESSENGER_SENDER_ID,
  appId: REACT_APP_APP_ID,
  measurementId: REACT_APP_MEASUREMENT_ID
};

firebase.initializeApp(FIREBASE_CONFIG);

const firebaseContext = createContext();

export const FirebaseProvider = ({ children }) => {
  const fb = useProvideFirebase();

  return (
    <firebaseContext.Provider value={fb}>{children}</firebaseContext.Provider>
  );
};

export const useFirebase = () => {
  return useContext(firebaseContext);
};

const useProvideFirebase = () => {
  const getTotalDeletesAndUsers = async () => {
    let deletes = 0;
    let users = 0;
    const value = firebase
      .database()
      .ref()
      .once('value')
      .then(function (snapshot) {
        deletes = snapshot.child('totals/deletes').val();
        users = snapshot.child('totals/users').val();
        return { deletes, users };
      });
    return value;
  };

  const updateTotalDeletesAndUsers = async (songDeletes) => {
    const updates = {};
    updates[`totals/deletes`] =
      firebase.database.ServerValue.increment(songDeletes);
    updates[`totals/users`] = firebase.database.ServerValue.increment(1);
    firebase.database().ref().update(updates);
  };
  return {
    getTotalDeletesAndUsers,
    updateTotalDeletesAndUsers
  };
};
