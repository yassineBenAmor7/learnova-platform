import { api } from './api';

export const videoService = {
  async getBySessionId(sessionId) {
    return api.get(`/videos/session/${sessionId}`);
  },

  async getById(id) {
    return api.get(`/videos/${id}`);
  },

  async updateWatchProgress(videoId, watchedSeconds, completed = false) {
    return api.post(`/learning-path/video/${videoId}/watch`, {
      watchedSeconds,
      completed,
    });
  },

  async markAsWatched(videoId) {
    return api.post(`/learning-path/video/${videoId}/watch`, {
      watchedSeconds: 0,
      completed: true,
    });
  },
};
