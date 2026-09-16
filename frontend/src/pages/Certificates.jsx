import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { certificateService } from '../services/certificate.service';
import Certificate from '../components/Certificate/Certificate';
import './Certificates.css';

function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showCertificateView, setShowCertificateView] = useState(false);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      console.log('=== LOADING CERTIFICATES ===');
      
      // Charger les certificats depuis l'API uniquement
      const apiCertificates = await certificateService.getMyCertificates();
      console.log('API Certificates data:', apiCertificates);
      
      // Nettoyer le localStorage pour supprimer les certificats incorrects
      localStorage.removeItem('userCertificates');
      
      console.log('Certificates length:', apiCertificates?.length);
      setCertificates(apiCertificates);
    } catch (err) {
      console.error('Failed to load certificates:', err);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setShowCertificateView(true);
  };

  const handleBack = () => {
    setShowCertificateView(false);
    setSelectedCertificate(null);
  };

  const handleDownload = () => {
    window.print();
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

  if (showCertificateView && selectedCertificate) {
    return (
      <div className="certificates-view-container">
        <div className="view-header">
          <button onClick={handleBack} className="btn btn-secondary">
            ← Back to Certificates
          </button>
          <button onClick={handleDownload} className="btn btn-primary">
            Download PDF
          </button>
        </div>
        <Certificate 
          certificate={selectedCertificate}
          user={selectedCertificate.user}
          course={selectedCertificate.course}
        />
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
                    <span className="meta-label">Certificate #:</span>
                    <span className="meta-value">{certificate.certificateNumber}</span>
                  </div>
                </div>
              </div>

              <div className="certificate-actions">
                <button
                  onClick={() => handleViewCertificate(certificate)}
                  className="btn btn-primary btn-sm"
                >
                  View Certificate
                </button>
                <button
                  onClick={() => handleVerify(certificate)}
                  className="btn btn-secondary btn-sm"
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
