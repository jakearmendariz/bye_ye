import { Switch, Route, Redirect, Link } from 'react-router-dom';
import DeleteKanye from './components/DeleteKanye';
import ScrollToTop from './components/ScrollToTop';
import SpotifyRedirect from './components/SpotifyRedirect';
import { useSpotify } from './hooks/useSpotify';
export default function App() {
  const { hasLoggedIn, hasRedirectedFromValidPopup, isLoading, login, user } =
    useSpotify();

  return (
    <div id="body">
      <h1>Delete Kanye!!!</h1>
      <h3>
        Heard about all the shit Kanye West has been saying, but your spotify is
        still litered with his music<br></br>
        Do the right thing, delete all of your Kanye Songs!<br></br>
      </h3>

      <ScrollToTop />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Route exact path="/">
            <div>
              {hasLoggedIn ? (
                <>
                  <h3>Welcome {user.display_name}</h3>
                  <h3 id="value" style={{ visibility: 'hidden' }}>
                    0
                  </h3>
                  <DeleteKanye />
                </>
              ) : (
                <button onClick={login}>Login</button>
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
