import { Switch, Route, Redirect, Link } from 'react-router-dom';
import DeleteKanye from './components/DeleteKanye';
import SpotifyRedirect from './components/SpotifyRedirect';
import { useSpotify } from './hooks/useSpotify';
import Button from '@mui/material/Button';

export default function App() {
  const { hasLoggedIn, hasRedirectedFromValidPopup, isLoading, login, user } =
    useSpotify();

  return (
    <div id="body">
      <h1>Delete Kanye!</h1>
      <img style={{width:"10em", height:"10em"}} src="xface.png"></img>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Route exact path="/">
            <div>
              {hasLoggedIn ? (
                <>
                  <h3 id="clickHereInstructions">
                    Click here to remove <b>all</b> Kanye songs from your <b>all</b> your
                    spotify playlists.
                  </h3>
                  <h3 id="value" style={{ visibility: 'hidden' }}>
                    0
                  </h3>
                  <DeleteKanye />
                </>
              ) : (
                <>
                  <h3>
                    Heard about all the antisemetic shit Kanye West has been saying, but
                    your spotify is still littered with his music?<br></br>
                    <br></br>
                    Do the right thing, delete all of your Kanye songs!<br></br>
                  </h3>
                  <Button variant="contained" color="primary" onClick={login}>
                    Login
                  </Button>
                </>
              )}
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
