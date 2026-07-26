import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { certificateService } from '../services/certificate.service';
import './Certificates.css';

function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const data = await certificateService.getMyCertificates();
      setCertificates(data);
    } catch (err) {
      setError('Failed to load certificates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (certificate) => {
    // In a real implementation, this would generate and download the certificate
    console.log('Downloading certificate:', certificate.id);
    alert('Certificate download feature would be implemented here');
  };

  const handleVerify = (certificate) => {
    window.open(`/certificates/verify/${certificate.certificateNumber}`, '_blank');
  };

  if (loading) {
    return (
      <div className="certificates-container">
        <div className="loading">Loading certificates...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="certificates-container">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="certificates-container">
      <div className="certificates-header">
        <h1>My Certificates</h1>
        <p>View and download your earned certificates</p>
      </div>

      <div className="certificates-grid">
        {certificates.length === 0 ? (
          <div className="no-certificates">
            <h3>No Certificates Yet</h3>
            <p>Complete courses and pass quizzes to earn certificates</p>
            <Link to="/courses" className="btn btn-primary">
              Browse Courses
            </Link>
          </div>
        ) : (
          certificates.map((certificate) => (
            <div key={certificate.id} className="certificate-card card card-interactive">
              <div className="certificate-header">
                <div className="certificate-status">
                  <span className="tag tag-success">Verified</span>
                </div>
              </div>

              <div className="certificate-body">
                <h3 className="certificate-course">
                  {certificate.course?.title || 'Course Certificate'}
                </h3>
                <p className="certificate-recipient">
                  Awarded to: {certificate.user?.firstName} {certificate.user?.lastName}
                </p>
                <div className="certificate-meta">
                  <div className="meta-item">
                    <span className="meta-label">Date:</span>
                    <span className="meta-value">
                      {new Date(certificate.issuedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Score:</span>
                    <span className="meta-value">{certificate.score}%</span>
                  </div>
                </div>
                <div className="certificate-number">
                  Certificate #: {certificate.certificateNumber}
                </div>
              </div>

              <div className="certificate-actions">
                <button
                  onClick={() => handleDownload(certificate)}
                  className="btn btn-secondary btn-sm"
                >
                  Download
                </button>
                <button
                  onClick={() => handleVerify(certificate)}
                  className="btn btn-primary btn-sm"
                >
                  Verify
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Certificates;
