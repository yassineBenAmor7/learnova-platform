import { api } from './api';

export const videoService = {
  async getBySessionId(sessionId) {
    return api.get(`/videos/session/${sessionId}`);
  },

  async getById(id) {
    return api.get(`/videos/${id}`);
  },

  async updateWatchProgress(videoId, watchedSeconds, completed = false) {
    return api.put(`/videos/${videoId}`, {
      watchedSeconds,
      completed,
    });
  },

  async markAsWatched(videoId) {
    return api.put(`/videos/${videoId}`, {
      completed: true,
    });
  },
};
