import { api } from './api';

export const quizService = {
  // Learner actions
  async getForLearner(quizId) {
    return api.get(`/quiz/${quizId}`);
  },

  async startAttempt(quizId, userId) {
    return api.post(`/exams/start/${quizId}/${userId}`);
  },

  async submitAttempt(attemptId, answers) {
    return api.post(`/exams/submit/${attemptId}`, answers);
  },

  async getStatus(attemptId) {
    return api.get(`/exams/status/${attemptId}`);
  },

  async getMyAttempts(userId) {
    return api.get(`/exams/attempts/${userId}`);
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

