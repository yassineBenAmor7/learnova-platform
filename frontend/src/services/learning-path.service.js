import { api } from './api';

export const learningPathService = {
  async getCoursePath(courseId) {
    return api.get(`/learning-path/course/${courseId}`);
  },

  async completeSession(sessionId) {
    return api.post(`/learning-path/session/${sessionId}/complete`);
  },

  async trackVideoWatch(videoId, watchedSeconds, completed) {
    return api.post(`/learning-path/video/${videoId}/watch`, {
      watchedSeconds,
      completed,
    });
  },

  async checkAndGenerateCertificate(courseId) {
    return api.post(`/learning-path/course/${courseId}/check-certificate`);
  },
};

export default learningPathService;
