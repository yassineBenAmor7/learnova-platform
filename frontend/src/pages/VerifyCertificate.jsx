import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { certificateService } from '../services/certificate.service';
import { CheckCircle, AlertCircle, ShieldCheck, Award, Calendar, User, BookOpen } from 'lucide-react';
import './VerifyCertificate.css';

function VerifyCertificate() {
  const { certificateNumber } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCertificate = async () => {
      setLoading(true);
      setError('');
      
      try {
        const res = await certificateService.verify(certificateNumber);
        if (res && res.isValid) {
          setData(res.certificate);
        } else {
          setError('This certificate number is invalid or does not exist in the official Learnova registry.');
        }
      } catch (err) {
        setError(err.message || 'Unable to verify the certificate. Identifier not found.');
      } finally {
        setLoading(false);
      }
    };

    if (certificateNumber) {
      fetchCertificate();
    }
  }, [certificateNumber]);

  return (
    <div className="verify-container">
      <div className="verify-card">
        {loading ? (
          <div className="verify-loading">
            <div className="spinner"></div>
            <p>Verifying certificate authenticity...</p>
          </div>
        ) : error ? (
          <div className="verify-error">
            <AlertCircle className="icon-error" size={64} />
            <h2>Invalid Certificate</h2>
            <p className="error-text">{error}</p>
            <p className="cert-code">Searched Code: <span>{certificateNumber}</span></p>
            <Link to="/" className="btn-home">Back to Home</Link>
          </div>
        ) : (
          <div className="verify-success">
            <div className="verify-badge">
              <ShieldCheck className="shield-icon" size={48} />
              <span>OFFICIALLY VERIFIED & AUTHENTIC DOCUMENT</span>
            </div>

            <div className="cert-header">
              <h1>Certificate of Completion</h1>
              <p className="subtitle">LEARNOVA ACADEMY</p>
            </div>

            <div className="cert-details-grid">
              <div className="detail-item">
                <User className="item-icon" size={24} />
                <div>
                  <span className="label">Certificate Holder</span>
                  <strong className="value">{data?.user?.firstName} {data?.user?.lastName}</strong>
                </div>
              </div>

              <div className="detail-item">
                <BookOpen className="item-icon" size={24} />
                <div>
                  <span className="label">Course Completed</span>
                  <strong className="value">{data?.course?.title || 'Professional Training'}</strong>
                </div>
              </div>

              <div className="detail-item">
                <Award className="item-icon" size={24} />
                <div>
                  <span className="label">Unique Identifier (QR Code)</span>
                  <strong className="value code">{data?.certificateNumber}</strong>
                </div>
              </div>

              <div className="detail-item">
                <Calendar className="item-icon" size={24} />
                <div>
                  <span className="label">Date of Issuance</span>
                  <strong className="value">
                    {data?.issuedAt ? new Date(data.issuedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Official Date'}
                  </strong>
                </div>
              </div>
            </div>

            <div className="verify-footer-status">
              <CheckCircle className="check-icon" size={20} />
              <span>This certificate was issued in accordance with the evaluation standards of the Learnova platform (Score &ge; 70%).</span>
            </div>

            <div className="action-row">
              <Link to="/login" className="btn-secondary">Access Learnova</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyCertificate;
