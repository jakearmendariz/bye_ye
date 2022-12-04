import { useRef, useState } from 'react';
import { useSpotify } from '../hooks/useSpotify';
import Button from '@mui/material/Button';

const DeleteKanye = () => {
  let kanyeCounter = 0;
  const [isComplete, setComplete] = useState(false);
  const { user, callEndpoint, callEndpointWithBody } = useSpotify();

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
        const value = await deleteSongsFromPlaylist(playlist);
        counter += value;
      });
      playlistOffset += 10;
    } while (playlists.items.length == 10);

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
        if (songsToDelete.length > 0) {
          fetchDeleteSong({ playlist_id: playlist.id, songsToDelete });
          songsToDelete = [];
        }
      });
      songOffset += 100;
    }
    const currentCount = parseInt(document.getElementById('value').innerHTML);
    document.getElementById('value').innerHTML = '' + (currentCount + counter);
    return counter;
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
  };

  const handleOnSubmit = async (evt) => {
    document.getElementById('value').style.visibility = 'visible';
    document.getElementById('clickHereInstructions').innerHTML = "Kayne songs deleted"
    evt.preventDefault();

    try {
      await deleteKanyeSongs();
      setComplete(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div>
        {isComplete ? (
          <></>
        ) : (
          <form>
            <Button
              type="submit"
              onClick={handleOnSubmit}
              color="error"
              variant="contained"
              style={{ width: 100, height: 60 }}
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
