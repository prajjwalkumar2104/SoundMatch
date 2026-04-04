import api from '../lib/api';

// Get the real user profile from backend
export const getProfile = async () => {
  const response = await api.get('/user/profile');
  return response.data;
};

// Update profile (bio, theme color, etc.)
export const updateProfile = async (profileData) => {
  const response = await api.patch('/user/profile', profileData);
  return response.data;
};

// This returns the URL the user needs to visit to authorize Spotify
export const getSpotifyAuthUrl = async () => {
  const response = await api.get('/auth/spotify/url');
  return response.data.url; 
};