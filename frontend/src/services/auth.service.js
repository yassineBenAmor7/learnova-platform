import { api } from './api';

export const authService = {
  async login(email, password) {
    const data = await api.post('/auth/login', { email, password });
    if (data.access_token) {
      localStorage.setItem('learnova_token', data.access_token);
    }
    return data;
  },

  async register(firstName, lastName, email, password) {
    return api.post('/auth/register', { firstName, lastName, email, password });
  },

  async getMe() {
    return api.get('/users/me');
  },

  async updateProfile(profileData) {
    return api.put('/users/me', profileData);
  },

  logout() {
    localStorage.removeItem('learnova_token');
  },
};
