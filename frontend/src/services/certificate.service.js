import { api } from './api';

export const certificateService = {
  async getMyCertificates() {
    return api.get('/certificates/my');
  },

  async verify(certificateNumber) {
    return api.get(`/certificates/verify/${certificateNumber}`);
  },

  // Admin
  async getAll() {
    return api.get('/certificates');
  },

  async delete(id) {
    return api.delete(`/certificates/${id}`);
  },
};
