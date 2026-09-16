import { api } from './api';

export const adminService = {
  async getDashboardStats() {
    return api.get('/dashboard/admin');
  },

  async getAllUsers(limit = 50, offset = 0) {
    return api.get(`/users/all?limit=${limit}&offset=${offset}`);
  },

  async getUserById(userId) {
    return api.get(`/users/${userId}`);
  },

  async updateUser(userId, userData) {
    return api.put(`/users/${userId}`, userData);
  },

  async deleteUser(userId) {
    return api.delete(`/users/${userId}`);
  },

  async updateUserRole(userId, roleId) {
    return api.put(`/users/${userId}/role`, { roleId });
  },

  async createUser(userData) {
    return api.post('/users', userData);
  },

  async getAllCourses() {
    return api.get('/courses');
  },

  async uploadThumbnail(file) {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/courses/upload-thumbnail', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async createCourse(courseData) {
    return api.post('/courses', courseData);
  },

  async updateCourse(courseId, courseData) {
    return api.put(`/courses/${courseId}`, courseData);
  },

  async deleteCourse(courseId) {
    return api.delete(`/courses/${courseId}`);
  },

  async getAllQuizzes() {
    return api.get('/quiz');
  },

  async getAllCertificates() {
    return api.get('/certificates');
  },

  async getRecentUsers(limit = 10) {
    return api.get(`/users/all?limit=${limit}`);
  },

  async getAllSessions() {
    return api.get('/sessions');
  },

  async getSessionsByCourse(courseId) {
    return api.get(`/sessions/course/${courseId}`);
  },

  async createSession(sessionData) {
    return api.post('/sessions', sessionData);
  },

  async updateSession(sessionId, sessionData) {
    return api.put(`/sessions/${sessionId}`, sessionData);
  },

  async deleteSession(sessionId) {
    return api.delete(`/sessions/${sessionId}`);
  },

  async getAllVideos() {
    return api.get('/videos');
  },

  async uploadVideo(file) {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/videos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async getVideosBySession(sessionId) {
    return api.get(`/videos/session/${sessionId}`);
  },

  async createVideo(videoData) {
    return api.post('/videos', videoData);
  },

  async updateVideo(videoId, videoData) {
    return api.put(`/videos/${videoId}`, videoData);
  },

  async deleteVideo(videoId) {
    return api.delete(`/videos/${videoId}`);
  },

  async getQuizById(quizId) {
    return api.get(`/quiz/${quizId}`);
  },

  async createQuiz(quizData) {
    return api.post('/quiz', quizData);
  },

  async updateQuiz(quizId, quizData) {
    return api.put(`/quiz/${quizId}`, quizData);
  },

  async deleteQuiz(quizId) {
    return api.delete(`/quiz/${quizId}`);
  },

  async getCertificateById(certificateId) {
    return api.get(`/certificates/${certificateId}`);
  },

  async deleteCertificate(certificateId) {
    return api.delete(`/certificates/${certificateId}`);
  },

  async getAllQuestions(quizId) {
    return api.get(`/questions${quizId ? `?quizId=${quizId}` : ''}`);
  },

  async getQuestionById(questionId) {
    return api.get(`/questions/${questionId}`);
  },

  async createQuestion(questionData) {
    return api.post('/questions', questionData);
  },

  async updateQuestion(questionId, questionData) {
    return api.put(`/questions/${questionId}`, questionData);
  },

  async deleteQuestion(questionId) {
    return api.delete(`/questions/${questionId}`);
  },
};
