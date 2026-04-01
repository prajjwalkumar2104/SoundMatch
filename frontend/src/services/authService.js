import api from '../lib/api';

export const login = async (credentials) => {
  // credentials = { email, password }
  const response = await api.post('/auth/login', credentials);
  
  // If successful, save the token to localStorage
  if (response.data.token) {
    localStorage.setItem('soundmatch_token', response.data.token);
  }
  
  return response.data;
};

export const signup = async (userData) => {
  // userData = { name, email, password, musicPreferences }
  const response = await api.post('/auth/signup', userData);
  
  if (response.data.token) {
    localStorage.setItem('soundmatch_token', response.data.token);
  }
  
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('soundmatch_token');
  window.location.href = '/login';
};