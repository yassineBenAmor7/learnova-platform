import { api } from './api';

export const userService = {
  async getStatistics() {
    return api.get('/users/statistics');
  },

  async getActivity(limit = 10) {
    return api.get(`/users/activity?limit=${limit}`);
  },

  async getSettings() {
    return api.get('/users/settings');
  },

  async updateSettings(settings) {
    return api.put('/users/settings', settings);
  },

  async getNotifications() {
    return api.get('/users/notifications');
  },

  async updateNotifications(notifications) {
    return api.put('/users/notifications', notifications);
  },

  async getPreferences() {
    return api.get('/users/preferences');
  },

  async updatePreferences(preferences) {
    return api.put('/users/preferences', preferences);
  },

  async downloadUserData() {
    return api.get('/users/download-data');
  },

  async deleteAccount(password) {
    return api.post('/users/delete-account', { password });
  }
};
