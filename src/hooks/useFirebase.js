import { createContext, useContext, useEffect, useState } from "react";
// import * as firebase from "firebase";
// // import {firebase} from firebase;
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"


// Environment variables from `.env` file.
const { FIREBASE_CONFIG } = process.env;

const firebaseContext = createContext();

export const FirebaseProvider = ({ children }) => {
  const fb = useProvideFirebase();

  return (
    <firebaseContext.Provider value={fb}>
      {children}
    </firebaseContext.Provider>
  );
};

export const useFirebase = () => {
  return useContext(firebaseContext);
};

const useProvideFirebase = () => {

    firebase.initializeApp(FIREBASE_CONFIG);
    const getTotalDeletesAndUsers = async () => {
        let deletes = 0;
        let users = 0;
        firebase.database().ref().once("value").then(function(snapshot) {
          deletes = snapshot.child("totals/deletes").val();
          users = snapshot.child("totals/users").val();
        });
        return {
          deletes: deletes,
          users: users
        }
      }
    
      const updateTotalDeletesAndUsers = async (songDeletes) => {
        const updates = {};
        updates[`totals/deletes`] = firebase.database.ServerValue.increment(songDeletes);
        updates[`totals/users`] = firebase.database.ServerValue.increment(1);
        firebase.database().ref().update(updates);
      }
  return {
    getTotalDeletesAndUsers,
    updateTotalDeletesAndUsers
  };
};
