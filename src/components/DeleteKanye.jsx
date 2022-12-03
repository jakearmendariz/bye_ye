import { useRef, useState } from 'react';
import { useSpotify } from '../hooks/useSpotify';

const DeleteKanye = () => {
  const MY_PLAYLISTS_URI = '/me/playlists';

  const [songsDeleted, setSongsDeleted] = useState(0);

  const { user, callEndpoint, callEndpointWithBody } = useSpotify();

  const deleteKanyeSongs = async () => {
    const playlists = await callEndpoint({ path: MY_PLAYLISTS_URI });
    let counter = 0;
    playlists.items.forEach(async (playlist) => {
      if (playlist.owner.id != user.id) {
        return;
      }
      const songs = await fetchSongsFromPlaylist({ playlist_id: playlist.id });
      // console.log()
      let songPosition = 0;
      let songsToDelete = [];
      songs.items.forEach((song) => {
        if (song !== null && song.track !== null) {
          // console.log(song);
          if (song.track.artists.some(isKanye)) {
            const songObj = extractSongInfo(song, songPosition);
            console.log('kanye song detected ', song.track, playlist);
            songsToDelete.push(songObj);
          }
          counter += 1;
        }
        songPosition += 1;
        if (songsToDelete.length > 0) {
          fetchDeleteSong({ playlist_id: playlist.id, songsToDelete });
          songsToDelete = []
        }
      });
    });
    // console.log(`Kanye songs in ${playlist.name}`)
    // console.log(songsToDelete)
    // songsToDelete.forEach((song) => console.log(song));
    // await fetchDeleteSong(songsToDelete)

    return counter;
  };

  const isKanye = (artist) => {
    return artist.name == 'Kanye West';
  };

  const extractSongInfo = (song, position) => {
    return {
      'uri': song.track.uri
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
