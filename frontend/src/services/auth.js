import api from '../lib/api';

// 1. Get the URL to send the user to Spotify
export const getSpotifyAuthUrl = async () => {
  try {
    const response = await api.get('/auth/spotify/url');
    return response.data.url; // This should be the https://accounts.spotify.com/... link
  } catch (error) {
    console.error("Error fetching Spotify Auth URL", error);
    throw error;
  }
};