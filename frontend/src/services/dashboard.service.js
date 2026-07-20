import { api } from './api';

export const dashboardService = {
  async getMyDashboard() {
    return api.get('/dashboard/me');
  },

  async getAdminDashboard() {
    return api.get('/dashboard/admin');
  },
};
