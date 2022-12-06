import { BrowserRouter as Router } from "react-router-dom";
import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
const history = createBrowserHistory();
import { SpotifyProvider } from "./hooks/useSpotify";
import { FirebaseProvider } from "./hooks/useFirebase";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <Router history={history}>
      <FirebaseProvider>
      <SpotifyProvider>
        <App />
      </SpotifyProvider>
      </FirebaseProvider>
    </Router>
  </StrictMode>,
  rootElement
);
