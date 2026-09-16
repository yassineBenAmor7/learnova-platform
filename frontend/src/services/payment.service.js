import { api } from './api';

export const paymentService = {
  async checkout(courseId, paymentMethod, couponCode) {
    return api.post('/payments/checkout', {
      courseId,
      paymentMethod,
      couponCode,
    });
  },

  async validateCoupon(code, originalPrice) {
    return api.post('/payments/validate-coupon', {
      code,
      originalPrice,
    });
  },

  async getMyTransactions() {
    return api.get('/payments/my-transactions');
  },
};
