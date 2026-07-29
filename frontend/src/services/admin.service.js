import { api } from './api';

export const adminService = {
  async getDashboardStats() {
    return api.get('/dashboard/admin');
  },

  async getAllUsers() {
    return api.get('/users');
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

  async getAllCourses() {
    return api.get('/courses');
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
    return api.get(`/users?limit=${limit}`);
  },
};
