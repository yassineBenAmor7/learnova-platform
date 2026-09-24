import React, { useRef } from 'react';
import { ShieldCheck, Award, Printer, Download, CheckCircle2, Award as Trophy } from 'lucide-react';
import './Certificate.css';

const Certificate = ({ certificate, user, course }) => {
  const certificateRef = useRef(null);

  const formatDate = (date) => {
    if (!date) return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const certNumber = certificate?.certificateNumber || `CERT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="certificate-wrapper">
      <div className="certificate-toolbar no-print">
        <button onClick={handleDownloadPDF} className="btn btn-primary btn-print-cert">
          <Download size={18} /> Download as PDF
        </button>
        <button onClick={handlePrint} className="btn btn-secondary btn-print-cert">
          <Printer size={18} /> Print Certificate
        </button>
      </div>

      <div ref={certificateRef} className="certificate-frame">
        <div className="certificate-outer-border">
          <div className="certificate-inner-border">
            {/* Watermark Crest Background */}
            <div className="certificate-watermark">LEARNOVA</div>

            {/* Top Header */}
            <div className="certificate-header">
              <div className="certificate-brand">
                <div className="brand-logo-circle">L</div>
                <div className="brand-info">
                  <span className="brand-name">LEARNOVA ACADEMY</span>
                  <span className="brand-tagline">Professional Education & Certification</span>
                </div>
              </div>
              <div className="certificate-badge-seal">
                <div className="seal-outer">
                  <div className="seal-inner">
                    <Award size={32} className="seal-icon" />
                    <span className="seal-text">VERIFIED</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Title Section */}
            <div className="certificate-title-section">
              <span className="certificate-kicker">CERTIFICATE OF COMPLETION</span>
              <h1 className="certificate-main-title">This is to certify that</h1>
            </div>

            {/* Learner Name */}
            <div className="certificate-recipient">
              <h2 className="recipient-name">
                {user?.firstName || 'Learner'} {user?.lastName || 'User'}
              </h2>
              <div className="recipient-underline"></div>
            </div>

            {/* Course Accomplishment Description */}
            <div className="certificate-accomplishment">
              <p className="accomplishment-text">
                has successfully completed the professional course
              </p>
              <h3 className="course-name-title">{course?.title || 'Professional Masterclass Course'}</h3>
              <div className="course-details">
                <div className="course-detail-item">
                  <span className="detail-label">Duration:</span>
                  <span className="detail-value">{course?.duration || 'Self-paced'}</span>
                </div>
                <div className="course-detail-item">
                  <span className="detail-label">Level:</span>
                  <span className="detail-value">{course?.level || 'Intermediate'}</span>
                </div>
                <div className="course-detail-item">
                  <span className="detail-label">Category:</span>
                  <span className="detail-value">{course?.domain || 'Professional Development'}</span>
                </div>
              </div>
            </div>

            {/* Achievement Badge */}
            <div className="certificate-achievement">
              <div className="achievement-badge">
                <Trophy size={24} className="achievement-icon" />
                <span className="achievement-text">Successfully Completed All Requirements</span>
              </div>
            </div>

            {/* Footer Signatures & Verification */}
            <div className="certificate-footer">
              <div className="footer-column signature-column">
                <div className="signature-line">
                  <span className="signature-font">Yassine Ben Amor</span>
                </div>
                <span className="signature-title">Lead Instructor & Course Director</span>
                <span className="signature-org">LearnOVA Academy</span>
              </div>

              <div className="footer-column verification-column">
                <div className="verification-box">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&margin=4&data=${encodeURIComponent(
                      typeof window !== 'undefined'
                        ? `${window.location.origin}/certificates/verify/${certNumber}`
                        : `https://learnova.com/certificates/verify/${certNumber}`
                    )}`}
                    alt="Official Verification QR Code"
                    className="verification-qr"
                    loading="lazy"
                  />
                  <div className="verification-info">
                    <div className="verification-status-tag">
                      <ShieldCheck size={14} className="verification-icon" />
                      <span>OFFICIAL & VERIFIABLE</span>
                    </div>
                    <span className="verification-label">Certificate ID:</span>
                    <strong className="verification-code">{certNumber}</strong>
                    <span className="verification-url">verify.learnova.com/{certNumber}</span>
                  </div>
                </div>
              </div>

              <div className="footer-column signature-column">
                <div className="signature-line">
                  <span className="signature-font director-font">Dr. Sarah Jenkins</span>
                </div>
                <span className="signature-title">Academic Director</span>
                <span className="signature-date">Issued {formatDate(certificate?.issuedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
