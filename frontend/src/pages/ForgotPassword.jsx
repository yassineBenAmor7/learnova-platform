import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.forgotPassword(email);
      console.log('Full response:', response);
      setResetToken(response.resetToken);
      setSuccess(true);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="forgot-password-header">
            <h1>Reset Link Generated</h1>
            <p>Click the link below to reset your password.</p>
          </div>

          <div className="forgot-password-success">
            <div className="success-icon">✓</div>
            <p>
              In production, this link would be sent via email. For development, click the link below:
            </p>
            {resetToken ? (
              <button
                onClick={() => navigate(`/reset-password?token=${resetToken}`)}
                className="reset-link-button"
              >
                Reset Password
              </button>
            ) : (
              <p style={{ color: 'red' }}>No reset token available</p>
            )}
          </div>

          <div className="forgot-password-footer">
            <Link to="/login" className="back-link">
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <h1>Forgot your password?</h1>
          <p>Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>

          <button type="submit" className="forgot-password-button" disabled={loading}>
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <div className="forgot-password-footer">
          <Link to="/login" className="back-link">
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
