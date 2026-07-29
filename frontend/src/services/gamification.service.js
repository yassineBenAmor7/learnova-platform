import { api } from './api';

export const gamificationService = {
  async getMyPoints() {
    return api.get('/gamification/points/me');
  },

  async getMyBadges() {
    return api.get('/gamification/badges/me');
  },

  async getMyStreak() {
    return api.get('/gamification/streak/me');
  },

  async awardPoints(userId, points, reason) {
    return api.post('/gamification/award', {
      userId,
      points,
      reason,
    });
  },

  // Admin actions
  async getAllUsersGamification() {
    return api.get('/gamification/all');
  },
};
