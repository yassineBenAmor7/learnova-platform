import { api } from './api';

export const courseService = {
  // Public / Learner Actions
  async getAll() {
    return api.get('/courses');
  },

  async getById(id) {
    return api.get(`/courses/${id}`);
  },

  async enroll(courseId) {
    return api.post('/enrollments', { courseId });
  },

  async getMyEnrollments() {
    return api.get('/enrollments/my');
  },

  // Admin Actions
  async create(courseData) {
    return api.post('/courses', courseData);
  },

  async update(id, courseData) {
    return api.put(`/courses/${id}`, courseData);
  },

  async delete(id) {
    return api.delete(`/courses/${id}`);
  },
};
