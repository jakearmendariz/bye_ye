import { Switch, Route, Redirect, Link } from "react-router-dom";
import DeleteKanye from "./components/DeleteKanye";
import ScrollToTop from "./components/ScrollToTop";
import SpotifyRedirect from "./components/SpotifyRedirect";
import { useSpotify } from "./hooks/useSpotify";
import { useFirebase } from "./hooks/useFirebase";
import { useEffect } from "react";


export default function App() {
  const {
    hasLoggedIn,
    hasRedirectedFromValidPopup,
    isLoading,
    login,
    logout,
    user,
  } = useSpotify();

  const {
    getTotalDeletesAndUsers
  } = useFirebase();

  const [totalDeletedSongs, setTotalDeletedSongs] = useState(0); 
  const [totalUsers, setTotalUsers] = useState(0); 

  useEffect(() => {
    getTotalDeletesAndUsers().then((result) => {
      setTotalDeletedSongs(result.deletes);
      setTotalUsers(result.users);
    }, []);
  })

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
                  {/* <button onClick={logout}>Logout</button> */}
                  <h3 id="value" style={{visibility:'hidden'}}>0</h3>
                  <DeleteKanye />
                </>
              ) : (
                <button onClick={login}>Login</button>
              )}
              Join the {totalUsers} users who have collectively deleted {totalDeletedSongs} Kanye songs off their playlists
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
