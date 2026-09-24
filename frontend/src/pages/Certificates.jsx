import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { certificateService } from '../services/certificate.service';
import Certificate from '../components/Certificate/Certificate';
import { Award, ShieldCheck, ExternalLink, CheckCircle2, LayoutGrid, List } from 'lucide-react';
import './Certificates.css';

function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showCertificateView, setShowCertificateView] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

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
      <div className="certificates-header-row">
        <div className="certificates-title-group">
          <div className="certificates-kicker">
            <Award size={18} className="kicker-icon" />
            <span>OFFICIAL CREDENTIALS</span>
          </div>
          <h1 className="certificates-title">My Certificates</h1>
          <p className="certificates-subtitle">
            View, share, and verify your earned certificates and academic credentials
          </p>
        </div>

        {certificates.length > 0 && (
          <div className="certificates-controls">
            <span className="certificates-count">
              <strong>{certificates.length}</strong> Certificate{certificates.length > 1 ? 's' : ''} earned
            </span>
            <div className="view-mode-toggle">
              <button
                type="button"
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid view (side-by-side)"
              >
                <LayoutGrid size={17} />
                <span>Grid</span>
              </button>
              <button
                type="button"
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="Horizontal row view"
              >
                <List size={17} />
                <span>Rows</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={`certificates-list-wrapper ${viewMode === 'list' ? 'mode-list' : 'mode-grid'}`}>
        {certificates.length === 0 ? (
          <div className="no-certificates">
            <div className="no-certificates-icon">
              <Award size={64} />
            </div>
            <h3>No Certificates Yet</h3>
            <p>Complete courses and pass the final certification exams to earn your credentials.</p>
            <Link to="/courses" className="btn btn-primary">
              Browse Courses
            </Link>
          </div>
        ) : (
          certificates.map((certificate) => (
            <div
              key={certificate.id}
              className={`certificate-item-card ${viewMode === 'list' ? 'card-horizontal' : 'card-grid'}`}
            >
              {/* Card visual badge / crest */}
              <div className="cert-badge-wrapper">
                <div className="cert-crest">
                  <Award size={28} className="cert-crest-icon" />
                </div>
                <div className="cert-verified-pill">
                  <ShieldCheck size={14} />
                  <span>Verified</span>
                </div>
              </div>

              {/* Card main content */}
              <div className="cert-content-wrapper">
                <h3 className="cert-course-title" title={certificate.course?.title || 'Course Certificate'}>
                  {certificate.course?.title || 'Course Certificate'}
                </h3>
                <p className="cert-recipient-name">
                  Awarded to <strong>{certificate.user?.firstName} {certificate.user?.lastName}</strong>
                </p>

                <div className="cert-meta-row">
                  <div className="cert-meta-item">
                    <span className="cert-meta-label">Issued:</span>
                    <span className="cert-meta-value">
                      {new Date(certificate.issuedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="cert-meta-divider">•</div>
                  <div className="cert-meta-item">
                    <span className="cert-meta-label">Credential ID:</span>
                    <span className="cert-meta-code">{certificate.certificateNumber}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="cert-actions-wrapper">
                <button
                  type="button"
                  onClick={() => handleViewCertificate(certificate)}
                  className="btn btn-primary btn-sm cert-btn-primary"
                >
                  <ExternalLink size={15} />
                  <span>View Certificate</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleVerify(certificate)}
                  className="btn btn-secondary btn-sm cert-btn-secondary"
                >
                  <CheckCircle2 size={15} />
                  <span>Verify</span>
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
