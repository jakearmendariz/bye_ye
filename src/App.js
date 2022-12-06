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
    // document.getElementById('totalUsers').innerHTML = 0;
    // document.getElementById('totalDeletedSongs').innerHTML = 0;
    // console.log(deletes, users);
    // for (let i = 0; i < users; i++) {
    //   document.getElementById('totalUsers').innerHTML =
    //     parseInt(document.getElementById('totalUsers').innerHTML) + 1;
    //   document.getElementById('totalDeletedSongs').innerHTML =
    //     parseInt(document.getElementById('totalDeletedSongs').innerHTML) + 1;
    //   sleep(1000);
    // }
    // for (let i = users; i < deletes; i++) {
    //   document.getElementById('totalDeletedSongs').innerHTML =
    //     parseInt(document.getElementById('totalDeletedSongs').innerHTML) + 1;
    // }
  });

  const Analytics = () => {
    return (
      <>
        <h3>
          Number of participants <br></br>
          <b style={{ fontSize: '1.5em' }} id="totalUsers">
            <CountUp
              start={0}
              end={totalUsers}
              delay={0}
              duration={0.5}
            ></CountUp>
          </b>
          <br></br> Total Kanye songs deleted <br></br>
          <b style={{ fontSize: '1.5em' }} id="totalDeletedSongs">
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
      <img style={{ width: '10em', height: '10em' }} src="xface.png"></img>

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
                    <span id="value" style={{ visibility: 'hidden', margin: '0px' }}>0</span>
                  </h3>
                  {/* <h3 id="value" style={{ visibility: 'hidden', margin: '0px' }}>
                    0
                  </h3> */}
                  <DeleteKanye />
                </>
              ) : (
                <div>
                  <h3>Upset with Kanye's rampant antisemitisim?</h3>
                  <Analytics></Analytics>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ backgroundColor: '#1DB954' }}
                    onClick={login}
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
