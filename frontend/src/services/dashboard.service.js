import { api } from './api';

export const dashboardService = {
  async getPublicOverview() {
    return api.get('/dashboard/public/overview');
  },

  async getMyDashboard() {
    return api.get('/dashboard/me');
  },

  async getAdminDashboard() {
    return api.get('/dashboard/admin');
  },
};
