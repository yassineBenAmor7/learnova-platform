import { api } from './api';

export const quizService = {
  // Learner actions
  async getForLearner(quizId) {
    return api.get(`/quiz/${quizId}/learner`);
  },

  async startAttempt(quizId) {
    return api.post(`/quiz/${quizId}/start`);
  },

  async submitAttempt(attemptId, answers) {
    return api.post(`/quiz/attempt/${attemptId}/submit`, { answers });
  },

  // Admin actions
  async getAll() {
    return api.get('/quiz');
  },

  async getByCourse(courseId) {
    return api.get(`/quiz/course/${courseId}`);
  },

  async getById(id) {
    return api.get(`/quiz/${id}`);
  },

  async create(quizData) {
    return api.post('/quiz', quizData);
  },

  async update(id, quizData) {
    return api.put(`/quiz/${id}`, quizData);
  },

  async delete(id) {
    return api.delete(`/quiz/${id}`);
  },
};
