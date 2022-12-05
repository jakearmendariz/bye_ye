import { Switch, Route, Redirect, Link } from 'react-router-dom';
import DeleteKanye from './components/DeleteKanye';
import SpotifyRedirect from './components/SpotifyRedirect';
import { useSpotify } from './hooks/useSpotify';
import { useFirebase } from './hooks/useFirebase';
import { useEffect } from 'react';
import Button from '@mui/material/Button';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import React, { useState } from 'react';

// import { initializeApp } from 'firebase/app';

export default function App() {
  const { hasLoggedIn, hasRedirectedFromValidPopup, isLoading, login, user } =
    useSpotify();
  const {
    REACT_APP_API_KEY,
    REACT_APP_authDomain,
    REACT_APP_databaseURL,
    REACT_APP_projectId,
    REACT_APP_storageBucket,
    REACT_APP_messagingSenderId,
    REACT_APP_appId,
    REACT_APP_measurementId
  } = process.env;
  const FIREBASE_CONFIG = {
    apiKey: REACT_APP_API_KEY,
    authDomain: REACT_APP_authDomain,
    databaseUrl: REACT_APP_databaseURL,
    projectId: REACT_APP_projectId,
    storageBucket: REACT_APP_storageBucket,
    messagingSenderId: REACT_APP_messagingSenderId,
    appId: REACT_APP_appId,
    measurementId: REACT_APP_measurementId
  };
  var app = firebase.initializeApp(FIREBASE_CONFIG);
  // console.log(FIREBASE_CONFIG)
  // const app = initializeApp(FIREBASE_CONFIG);
  const getTotalDeletesAndUsers = async () => {
    let deletes = 0;
    let users = 0;
    firebase
      .database(app)
      .ref()
      .once('value')
      .then(function (snapshot) {
        deletes = snapshot.child('totals/deletes').val();
        users = snapshot.child('totals/users').val();
        setTotalDeletedSongs(deletes);
        setTotalUsers(users);
      });

    return {
      deletes: deletes,
      users: users
    };
  };

  const [totalDeletedSongs, setTotalDeletedSongs] = React.useState(0);
  const [totalUsers, setTotalUsers] = React.useState(0);

  useEffect(async () => {
    await getTotalDeletesAndUsers();
  });

  return (
    <div id="body">
      <h1>Delete Kanye!</h1>
      <img style={{ width: '10em', height: '10em' }} src="xface.png"></img>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Route exact path="/">
            <div>
              {hasLoggedIn ? (
                <>
                  <h3 id="clickHereInstructions">
                    Click here to remove <b>all</b> Kanye songs from your{' '}
                    <b>all</b> your spotify playlists.
                  </h3>
                  <h3 id="value" style={{ visibility: 'hidden' }}>
                    0
                  </h3>
                  <DeleteKanye />
                </>
              ) : (
                <>
                  <h3>
                    Heard about all the antisemetic shit Kanye West has been
                    saying, but your spotify is still littered with his music?
                    <br></br>
                    <br></br>
                    Do the right thing, delete all of your Kanye songs!<br></br>
                  </h3>
                  <Button variant="contained" color="primary" onClick={login}>
                    Login
                  </Button>
                </>
              )}
              Join the {totalUsers} users who have collectively deleted{' '}
              {totalDeletedSongs} Kanye songs off their playlists
            </div>
          </Route>

          <Route path="/callback">
            {hasLoggedIn ? (
              <Redirect to="/dashboard" />
            ) : hasRedirectedFromValidPopup ? (
              <SpotifyRedirect />
            ) : (
              <Redirect to="/" />
            )}
          </Route>

          <Switch>
            <Route path="/dashboard">
              {hasLoggedIn ? (
                <div>Dashboard: {JSON.stringify(user)}</div>
              ) : (
                <Redirect to="/" />
              )}
            </Route>
            <Route path="/bye">
              {hasLoggedIn ? <DeleteKanye /> : <Redirect to="/" />}
            </Route>
          </Switch>
        </>
      )}
    </div>
  );
}
