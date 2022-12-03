import { useRef, useState } from 'react';
import { useSpotify } from '../hooks/useSpotify';

const DeleteKanye = () => {
  const MY_PLAYLISTS_URI = '/me/playlists';

  const [songsDeleted, setSongsDeleted] = useState(0);

  const { callEndpoint } = useSpotify();

  const deleteKanyeSongs = async () => {
    const playlists = await callEndpoint({ path: MY_PLAYLISTS_URI });
    let counter = 0;
    let songsToDelete = []
    playlists.items.forEach(async (playlist) => {
      const songs = await fetchSongsFromPlaylist({ playlist_id: playlist.id });
      // console.log()
      let songPosition = 0;
      songs.items.forEach((song) => {
        if (song !== null && song.track !== null) {
          // console.log(song);
          if (song.track.artists.some(isKanye)) {
            const songObj = extractSongInfo(song, songPosition);
            console.log('kanye song detected ', songObj)
            songsToDelete.push(songObj);
          }
          counter += 1;
        }
        songPosition += 1;
      });
    });
    // console.log(`Kanye songs in ${playlist.name}`)
    songsToDelete.forEach((song) => console.log(song));
    return counter;
  };

  const isKanye = (artist) => {
    return artist.name == "Kanye West";
  }

  const extractSongInfo = (song, position) => {
    return {
      'track': song.track.uri,
      'positions': [position]
    }
  }

  // fetchDeleteSong = async ({ song_id }) => 

  const fetchSongsFromPlaylist = async ({ playlist_id }) => {
    return await callEndpoint({ path: `/playlists/${playlist_id}/tracks` });
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();

    try {
      const counter = await deleteKanyeSongs();
      console.log(counter);
      setSongsDeleted(counter);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div>
        {songsDeleted > 0 ? (
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
