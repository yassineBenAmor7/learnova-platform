import React from 'react';
import { Award, Sparkles, X, CheckCircle, ArrowRight } from 'lucide-react';
import './BadgeUnlockModal.css';

const BadgeUnlockModal = ({ badge, xpGained, newLevel, onClose, onContinue }) => {
  if (!badge && !xpGained) return null;

  return (
    <div className="badge-modal-overlay">
      <div className="badge-modal-container">
        <button className="badge-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="badge-modal-header">
          <div className="badge-sparkles-icon">
            <Sparkles size={32} />
          </div>
          <h2>{badge ? 'New Badge Unlocked!' : 'XP & Level Progress!'}</h2>
          <p>Congratulations on completing your evaluation!</p>
        </div>

        <div className="badge-modal-body">
          {badge && (
            <div className="badge-card-display">
              <div className="badge-icon-circle">
                <img 
                  src={badge.iconUrl || '/badges/gold_master.svg'} 
                  alt={badge.name || 'Unlocked Badge'} 
                  className="badge-modal-artwork" 
                />
              </div>
              <h3 className="badge-name">{badge.name || 'Course Graduate'}</h3>
              <p className="badge-description">{badge.description || 'Mastered course topics and earned certification'}</p>
            </div>
          )}

          <div className="xp-gained-box">
            {xpGained > 0 && (
              <div className="xp-pill">
                <Award size={20} />
                <span>+{xpGained} XP Earned</span>
              </div>
            )}
            {newLevel && (
              <div className="level-up-pill">
                <CheckCircle size={20} />
                <span>Level {newLevel} Reached!</span>
              </div>
            )}
          </div>
        </div>

        <div className="badge-modal-footer">
          <button 
            onClick={onContinue || onClose} 
            className="btn btn-primary btn-full badge-continue-btn"
          >
            Continue Learning <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BadgeUnlockModal;
