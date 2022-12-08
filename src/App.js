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
import CountUp from 'react-countup';

// import { initializeApp } from 'firebase/app';

export default function App() {
  const { hasLoggedIn, hasRedirectedFromValidPopup, isLoading, login, user } =
    useSpotify();

  const { getTotalDeletesAndUsers } = useFirebase();

  const [totalDeletedSongs, setTotalDeletedSongs] = React.useState(0);
  const [totalUsers, setTotalUsers] = React.useState(0);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  useEffect(async () => {
    const { deletes, users } = await getTotalDeletesAndUsers();
    setTotalDeletedSongs(deletes);
    setTotalUsers(users);
  });

  const Analytics = () => {
    return (
      <>
        <h3>
          Number of participants <br></br>
          <b className="numbers" id="totalUsers">
            <CountUp
              start={0}
              end={totalUsers}
              delay={0}
              duration={0.5}
            ></CountUp>
          </b>
          <br></br> Total Kanye songs deleted <br></br>
          <b className="numbers" id="totalDeletedSongs">
            <CountUp
              start={0}
              end={totalDeletedSongs}
              delay={0}
              duration={1}
            ></CountUp>
          </b>
          <br></br>
        </h3>
      </>
    );
  };

  return (
    <div id="body">
      <h1>Delete Kanye!</h1>
      <img id="img" src="xface.png"></img>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Route exact path="/">
            <div>
              {hasLoggedIn ? (
                <>
                 <Analytics></Analytics>
                  <h3 id="clickHereInstructions">
                    Click here to remove <b>all</b> Kanye songs from your{' '}
                    <b>all</b> your spotify playlists.<br></br>
                  </h3>
                  <h3 className= "numbers">
                  <b className= "numbers" id="value">0</b>
                  </h3>
                  <DeleteKanye />
                </>
              ) : (
                <div>
                  <h3>Upset with Kanye's rampant antisemitisim?</h3>
                  <Analytics></Analytics>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={login}
                    id="spotifyButton"
                  >
                    Login to Spotify
                  </Button>
                </div>
              )}
              {/* <h3>
                Total Users: <span id="totalUsers">{0}</span>
                <br></br>Total Songs Deleted:{' '}
                <span id="totalDeletedSongs">{0}</span>
              </h3> */}
            </div>
          </Route>

          <Route path="/callback">
          {hasLoggedIn ? (
              <Redirect to="/dashboard" />
            ) : hasRedirectedFromValidPopup ? (
              <SpotifyRedirect />
            ) : (
              <SpotifyRedirect />
            )}
          </Route>

          <Switch>
            <Route path="/dashboard">
              {hasLoggedIn ? (
                <div>Dashboard: {JSON.stringify(user)}</div>
              ) : (
                 <SpotifyRedirect />
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
