import { useRef, useState } from 'react';
import { useSpotify } from '../hooks/useSpotify';

const DeleteKanye = () => {
  const [songsDeleted, setSongsDeleted] = useState(0);
  const [isComplete, setComplete] = useState(false);
  const { user, callEndpoint, callEndpointWithBody } = useSpotify();

  const incrementSongsComplete = (inc) => {
    setSongsDeleted(songsDeleted + inc);
  }

  const deleteKanyeSongs = async () => {
    let playlists;
    let counter = 0;
    let playlistOffset = 0;
    do {
      playlists = await fetchPlaylist(playlistOffset);
      playlists.items.forEach(async (playlist) => {
        if (playlist.owner.id != user.id) {
          return;
        }
        counter += await deleteSongsFromPlaylist(playlist)
      });
      playlistOffset += 10;
    } while (playlists.items.length > 0);
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
            console.log('kanye song detected ', song.track, playlist);
            songsToDelete.push(songObj);
            counter += 1;
          }
        }
        if (songsToDelete.length > 0) {
          fetchDeleteSong({ playlist_id: playlist.id, songsToDelete });
          songsToDelete = [];
        }
      });
      songOffset += 100;
    }
    console.log(counter)
    incrementSongsComplete(counter);
    return counter;
  };

  const isKanye = (artist) => {
    return artist.name == 'Kanye West';
  };

  const extractSongInfo = (song) => {
    return {
      uri: song.track.uri
      // 'positions': [position]
    };
  };

  const fetchDeleteSong = async ({ playlist_id, songsToDelete }) => {
    const body = { tracks: songsToDelete };
    return await callEndpointWithBody({
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
  }

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();

    try {
      const counter = await deleteKanyeSongs();
      console.log(counter);
      // setSongsDeleted(counter);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div>
        {isComplete ? (
          <div>
            <h3>Songs Deleted!</h3>
            <p>{songsDeleted}</p>
          </div>
        ) : (
          <form>
            <label>Delete all of your Kayne Songs:</label>
            <button type="submit" onClick={handleOnSubmit}>
              Booyah!
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default DeleteKanye;
