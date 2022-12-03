import { Switch, Route, Redirect, Link } from "react-router-dom";
import DeleteKanye from "./components/DeleteKanye";
import ScrollToTop from "./components/ScrollToTop";
import SpotifyRedirect from "./components/SpotifyRedirect";
import { useSpotify } from "./hooks/useSpotify";

export default function App() {
  const {
    hasLoggedIn,
    hasRedirectedFromValidPopup,
    isLoading,
    login,
    logout,
    user,
  } = useSpotify();

  return (
    <>
      <h1>Bye Ye</h1>

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
                  <button onClick={logout}>Logout</button>
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
    </>
  );
}
