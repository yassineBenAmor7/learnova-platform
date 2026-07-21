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
          setError('Ce numéro de certificat est invalide ou inexistant dans le registre officiel Learnova.');
        }
      } catch (err) {
        setError(err.message || 'Impossible de vérifier le certificat. Identifiant introuvable.');
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
            <p>Vérification de l'authenticité du certificat en cours...</p>
          </div>
        ) : error ? (
          <div className="verify-error">
            <AlertCircle className="icon-error" size={64} />
            <h2>Certificat Invalide</h2>
            <p className="error-text">{error}</p>
            <p className="cert-code">Code recherché : <span>{certificateNumber}</span></p>
            <Link to="/" className="btn-home">Retour à l'accueil</Link>
          </div>
        ) : (
          <div className="verify-success">
            <div className="verify-badge">
              <ShieldCheck className="shield-icon" size={48} />
              <span>DOCUMENT OFFICIELLEMENT VÉRIFIÉ & AUTHENTIQUE</span>
            </div>

            <div className="cert-header">
              <h1>Certificat de Réussite Learnova</h1>
              <p className="subtitle">Institut Supérieur des Sciences Appliquées et de Technologies de Sousse & Vaerdia</p>
            </div>

            <div className="cert-details-grid">
              <div className="detail-item">
                <User className="item-icon" size={24} />
                <div>
                  <span className="label">Titulaire du certificat</span>
                  <strong className="value">{data?.user?.firstName} {data?.user?.lastName}</strong>
                </div>
              </div>

              <div className="detail-item">
                <BookOpen className="item-icon" size={24} />
                <div>
                  <span className="label">Formation suivie</span>
                  <strong className="value">{data?.course?.title || 'Formation Professionnelle'}</strong>
                </div>
              </div>

              <div className="detail-item">
                <Award className="item-icon" size={24} />
                <div>
                  <span className="label">Identifiant unique (Code QR)</span>
                  <strong className="value code">{data?.certificateNumber}</strong>
                </div>
              </div>

              <div className="detail-item">
                <Calendar className="item-icon" size={24} />
                <div>
                  <span className="label">Date de délivrance</span>
                  <strong className="value">
                    {data?.issuedAt ? new Date(data.issuedAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Date officielle'}
                  </strong>
                </div>
              </div>
            </div>

            <div className="verify-footer-status">
              <CheckCircle className="check-icon" size={20} />
              <span>Ce certificat a été délivré conformément aux exigences d'évaluation de la plateforme Learnova (Score &ge; 70%).</span>
            </div>

            <div className="action-row">
              <Link to="/login" className="btn-secondary">Accéder à Learnova</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyCertificate;
