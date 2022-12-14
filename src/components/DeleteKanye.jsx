import { useRef, useState } from 'react';
import { useSpotify } from '../hooks/useSpotify';
import Button from '@mui/material/Button';
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"
import Confetti from 'react-confetti'
// import useWindowSize from './useWindowSize';

const DeleteKanye = () => {
  let kanyeCounter = 0;
  const [isComplete, setComplete] = useState(false);
  const { user, callEndpoint, callEndpointWithBody } = useSpotify();
  // const { getTotalDeletesAndUsers } = useFirebase();

  const {
    REACT_APP_API_KEY,
    REACT_APP_AUTH_DOMAIN,
    REACT_APP_DATABASE_URL,
    REACT_APP_PROJECT_ID,
    REACT_APP_STORAGE_BUCKET,
    REACT_APP_MESSENGER_SENDER_ID,
    REACT_APP_APP_ID,
    REACT_APP_MEASUREMENT_ID
  } = process.env;
  const FIREBASE_CONFIG = {
    apiKey: REACT_APP_API_KEY,
    authDomain: REACT_APP_AUTH_DOMAIN,
    databaseUrl: REACT_APP_DATABASE_URL,
    projectId: REACT_APP_PROJECT_ID,
    storageBucket: REACT_APP_STORAGE_BUCKET,
    messagingSenderId: REACT_APP_MESSENGER_SENDER_ID,
    appId: REACT_APP_APP_ID,
    measurementId: REACT_APP_MEASUREMENT_ID
  };
  var app = firebase.initializeApp(FIREBASE_CONFIG);

  const deleteKanyeSongs = async () => {
    let counter = 0;

    //Delete all Kanye songs off playlists
    let playlists;
    let playlistOffset = 0;
    do {
      playlists = await fetchPlaylist(playlistOffset);
      playlists.items.forEach(async (playlist) => {
        if (playlist.owner.id != user.id) {
          return;
        }
        const value = await deleteSongsFromPlaylist(playlist);
        counter += value;
      });
      playlistOffset += 10;
    } while (playlists.items.length == 10);

    //Delete all Kanye songs from liked songs
    let savedTracks;
    let savedTracksOffset = 0;
    let tracksIDsToDelete = [];
    do {
      savedTracks = await fetchSavedTracks(savedTracksOffset);
      savedTracks.items.forEach(async (song) => {
        if(song.track.artists.some(isKanye)){
          console.log('kanye song detected in linked songs', song.track);
          tracksIDsToDelete.push(song.track.id);
        }
      });
      savedTracksOffset += 50;
    } while (savedTracks.items.length == 50);

    counter += tracksIDsToDelete.length;
    let deleteTracksStart = 0;
    let deleteTracksOffset = 50;
    do {
      let currDeletes = tracksIDsToDelete.slice(deleteTracksStart, deleteTracksStart+deleteTracksOffset);
      await deleteSavedTracks(currDeletes);
      deleteTracksStart += currDeletes.length;
    } while (deleteTracksStart < tracksIDsToDelete.length);
    document.getElementById('value').innerHTML = '' + counter;

    //Remove all Kanye albums from liked albums

    setComplete(true);
    return counter;
  };

  const deleteSongsFromPlaylist = async (playlist) => {
    let totalSongs = playlist.tracks.total;
    let songsToDelete = [];
    let songOffset = 0;
    let counter = 0;
    for (let i = 0; i < totalSongs / 100 + 1; i++) {
      const songs = await fetchSongsFromPlaylist({
        playlist_id: playlist.id,
        songOffset
      });
      songs.items.forEach((song) => {
        if (song !== null && song.track !== null) {
          if (song.track.artists.some(isKanye)) {
            const songObj = extractSongInfo(song);
            console.log(playlist.name, 'kanye song detected ', song.track);
            songsToDelete.push(songObj);
            counter += 1;
            kanyeCounter += 1;
          }
        }
      });
      songOffset += 100;
    }
    if (songsToDelete.length > 0) {
      for (let i = 0; i < songsToDelete.length; i += 85) {
        fetchDeleteSong({ playlist_id: playlist.id, songsToDelete: songsToDelete.slice(i, i+85) });
      }
      songsToDelete = [];
    }
    if (counter > 0) {
      incDeletes(counter)
      const currentCount = parseInt(document.getElementById('value').innerHTML);
      document.getElementById('value').innerHTML = '' + (currentCount + counter);
    }
    return counter;
  };

  const deleteSavedTracks = async (tracks) => {
    // const body = { ids: tracks };
    await callEndpointWithBody({
      path: `/me/tracks`,
      method: 'DELETE',
      body: JSON.stringify(tracks)
    });
  };

  const isKanye = (artist) => {
    return artist.name == 'Kanye West';
  };

  const extractSongInfo = (song) => {
    return {
      uri: song.track.uri
    };
  };

  const fetchDeleteSong = async ({ playlist_id, songsToDelete }) => {
    const body = { tracks: songsToDelete };
    await callEndpointWithBody({
      path: `/playlists/${playlist_id}/tracks`,
      method: 'DELETE',
      body: JSON.stringify(body)
    });
  };

  const fetchSongsFromPlaylist = async ({ playlist_id, songOffset }) => {
    // https://api.spotify.com/v1/playlists/5IGMBRvW60usILlePZNdJD/tracks?limit=1000
    return await callEndpoint({
      path: `/playlists/${playlist_id}/tracks?limit=100&offset=${songOffset}`
    });
  };

  const fetchPlaylist = async (offset) => {
    return await callEndpoint({
      path: `/me/playlists?limit=10&offset=${offset}`
    });
  };

  const fetchSavedTracks = async (offset) => {
    return await callEndpoint({
      path: `/me/tracks?limit=50&offset=${offset}`
    });
  };

  const incDeletes = async (songDeletes) => {
    const updates = {};
    updates[`totals/deletes`] = firebase.database.ServerValue.increment(songDeletes);
    firebase.database().ref().update(updates);
  }

  const updateTotalDeletesAndUsers = async (songDeletes) => {
    const updates = {};
    updates[`totals/deletes`] = firebase.database.ServerValue.increment(songDeletes);
    updates[`totals/users`] = firebase.database.ServerValue.increment(1);
    firebase.database().ref().update(updates);
  }

  const handleOnSubmit = async (evt) => {
    document.getElementById('value').style.display = 'inline';
    document.getElementById('clickHereInstructions').innerHTML = "Kayne songs deleted";
    evt.preventDefault();

    try {
      deleteKanyeSongs().then((fuckme) => {
        // while (!isComplete) {console.log('yolobitches')}
        const songDeletes = parseInt(document.getElementById('value').innerHTML)
        updateTotalDeletesAndUsers(songDeletes);
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div>
        {isComplete ? (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
          />
        ) : (
          <form>
            <Button
              type="submit"
              onClick={handleOnSubmit}
              color="error"
              variant="contained"
              id="formButton"
            >
              Delete!
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default DeleteKanye;
