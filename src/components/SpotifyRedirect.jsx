import { useEffect } from "react";
import { useSpotify } from "../hooks/useSpotify";

const SpotifyRedirect = () => {
  const { storeTokenAtRedirect } = useSpotify();

  useEffect(() => {
    storeTokenAtRedirect();
  }, []);
  return <body><h1>Redirecting...</h1></body>;
};

export default SpotifyRedirect;
