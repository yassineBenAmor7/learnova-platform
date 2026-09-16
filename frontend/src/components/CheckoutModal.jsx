import React, { useState } from 'react';
import { 
  X, CreditCard, ShieldCheck, CheckCircle2, 
  Tag, Lock, ArrowRight, Printer, Sparkles, AlertCircle 
} from 'lucide-react';
import { paymentService } from '../services/payment.service';
import { getCourseThumbnail, handleThumbnailError } from '../utils/thumbnailHelper';
import './CheckoutModal.css';

const CheckoutModal = ({ course, onClose, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [receipt, setReceipt] = useState(null);

  // Card Form Dummy Inputs
  const [cardData, setCardData] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardHolder: 'Learner User',
    expiry: '12/28',
    cvv: '999',
  });

  const originalPrice = course?.price || 0;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalPrice = Math.max(0, originalPrice - discountAmount);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setValidatingCoupon(true);
    setCouponError(null);
    try {
      const res = await paymentService.validateCoupon(couponCode, originalPrice);
      setAppliedCoupon(res);
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon code');
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await paymentService.checkout(
        course.id,
        paymentMethod,
        appliedCoupon ? appliedCoupon.code : null
      );
      
      setReceipt(res.receipt);
    } catch (err) {
      setError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleStartLearning = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      window.location.href = `/learning-path/${course.id}`;
    }
  };

  return (
    <div className="checkout-modal-overlay">
      <div className="checkout-modal-container">
        <button className="checkout-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {!receipt ? (
          <div className="checkout-content">
            <div className="checkout-header">
              <h2>Checkout & Complete Enrollment</h2>
              <p>Secure 256-Bit SSL Encrypted Checkout</p>
            </div>

            {error && (
              <div className="alert alert-danger checkout-alert">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="checkout-body">
              {/* Left Column: Order Summary & Coupon */}
              <div className="checkout-summary-column">
                <div className="order-course-card">
                  <img 
                    src={getCourseThumbnail(course)} 
                    alt={course.title} 
                    className="order-course-thumb"
                    onError={(e) => handleThumbnailError(e, course.domain)} 
                  />
                  <div className="order-course-details">
                    <span className="order-domain-badge">{course.domain || 'IT_DATA'}</span>
                    <h3 className="order-course-title">{course.title}</h3>
                    <p className="order-course-level">
                      Level: <strong>{course.level || 'BEGINNER'}</strong>
                    </p>
                  </div>
                </div>

                <div className="order-price-breakdown">
                  <h4>Order Summary</h4>
                  <div className="price-row">
                    <span>Course Price:</span>
                    <span>${originalPrice.toFixed(2)}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="price-row discount-row">
                      <span className="discount-label">
                        <Tag size={14} /> Coupon ({appliedCoupon.code} -{appliedCoupon.percentage}%):
                      </span>
                      <span className="discount-value">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="price-row total-row">
                    <span>Total Amount Due:</span>
                    <span className="final-price-value">${finalPrice.toFixed(2)} USD</span>
                  </div>
                </div>

                {/* Coupon Code Input */}
                <div className="coupon-box">
                  {!appliedCoupon ? (
                    <form onSubmit={handleApplyCoupon} className="coupon-form">
                      <input
                        type="text"
                        placeholder="Enter coupon code (e.g. LEARNOVA100)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="coupon-input"
                      />
                      <button 
                        type="submit" 
                        className="btn btn-secondary btn-sm"
                        disabled={validatingCoupon || !couponCode.trim()}
                      >
                        {validatingCoupon ? 'Checking...' : 'Apply'}
                      </button>
                    </form>
                  ) : (
                    <div className="applied-coupon-tag">
                      <span><Sparkles size={14} /> Code <strong>{appliedCoupon.code}</strong> applied!</span>
                      <button onClick={handleRemoveCoupon} className="remove-coupon-btn">Remove</button>
                    </div>
                  )}
                  {couponError && <p className="coupon-error">{couponError}</p>}
                </div>

                <div className="money-back-guarantee">
                  <ShieldCheck size={24} className="shield-icon" />
                  <div>
                    <h5>30-Day Money-Back Guarantee</h5>
                    <p>Not satisfied? Get a 100% full refund within 30 days of purchase.</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Payment Form */}
              <div className="checkout-payment-column">
                <h4>Select Payment Method</h4>

                <div className="payment-tabs">
                  <button
                    className={`payment-tab ${paymentMethod === 'CREDIT_CARD' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('CREDIT_CARD')}
                  >
                    <CreditCard size={18} />
                    Credit / Debit Card
                  </button>
                  <button
                    className={`payment-tab ${paymentMethod === 'STRIPE' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('STRIPE')}
                  >
                    <Lock size={18} />
                    Stripe Direct
                  </button>
                </div>

                {paymentMethod === 'CREDIT_CARD' && (
                  <div className="card-payment-form">
                    <div className="form-group">
                      <label>Cardholder Name</label>
                      <input
                        type="text"
                        value={cardData.cardHolder}
                        onChange={(e) => setCardData({ ...cardData, cardHolder: e.target.value })}
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Card Number</label>
                      <div className="card-input-wrapper">
                        <input
                          type="text"
                          value={cardData.cardNumber}
                          onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                          className="form-control"
                          required
                        />
                        <CreditCard size={18} className="card-icon" />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiration</label>
                        <input
                          type="text"
                          value={cardData.expiry}
                          onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                          className="form-control"
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>CVV / CVC</label>
                        <input
                          type="text"
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                          className="form-control"
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'STRIPE' && (
                  <div className="stripe-info-box">
                    <p>⚡ Fast 1-Click Instant Checkout via Stripe SSL Secure Sandbox.</p>
                  </div>
                )}

                <button
                  onClick={handleProcessPayment}
                  className="btn btn-primary btn-checkout-submit"
                  disabled={submitting}
                >
                  {submitting ? 'Processing Payment...' : `Complete Purchase - $${finalPrice.toFixed(2)} USD`}
                  {!submitting && <ArrowRight size={18} />}
                </button>

                <p className="security-note">
                  <Lock size={12} /> By completing your purchase you agree to LearnOVA Terms of Service.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Receipt / Confirmation View */
          <div className="checkout-receipt-view">
            <div className="receipt-success-header">
              <CheckCircle2 size={56} className="success-icon" />
              <h2>Enrollment Confirmed & Payment Successful!</h2>
              <p>Thank you for your purchase. A digital copy of your receipt is below.</p>
            </div>

            <div className="receipt-card">
              <div className="receipt-header">
                <h3>Learnova Platform - Purchase Receipt</h3>
                <span className="receipt-status-tag">PAID & VERIFIED</span>
              </div>

              <div className="receipt-details">
                <div className="receipt-row">
                  <span>Transaction ID:</span>
                  <strong>{receipt.transactionId}</strong>
                </div>
                <div className="receipt-row">
                  <span>Date & Time:</span>
                  <span>{new Date(receipt.date).toLocaleString()}</span>
                </div>
                <div className="receipt-row">
                  <span>Course Title:</span>
                  <strong>{receipt.course.title}</strong>
                </div>
                <div className="receipt-row">
                  <span>Payment Method:</span>
                  <span>{receipt.paymentMethod}</span>
                </div>
                <div className="receipt-row receipt-total">
                  <span>Amount Paid:</span>
                  <span className="receipt-amount">${receipt.amountPaid.toFixed(2)} {receipt.currency}</span>
                </div>
              </div>
            </div>

            <div className="receipt-actions">
              <button onClick={handlePrintReceipt} className="btn btn-secondary">
                <Printer size={18} /> Print Receipt
              </button>
              <button onClick={handleStartLearning} className="btn btn-primary btn-start-now">
                Start Learning Now <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
