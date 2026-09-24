import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import './ConfirmModal.css';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger' // danger, warning, info
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="modal-overlay professional-overlay confirm-modal-overlay" onClick={onClose}>
      <div className="modal-content professional-content confirm-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header professional-header confirm-modal-header">
          <div className={`confirm-icon confirm-icon-${variant}`}>
            <AlertTriangle size={28} />
          </div>
          <h3 className="confirm-modal-title">{title}</h3>
          <button className="btn-close-modal" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        
        <div className="modal-body professional-body confirm-modal-body">
          <p className="confirm-modal-message">{message}</p>
        </div>
        
        <div className="modal-footer professional-footer confirm-modal-footer">
          <button 
            className="btn btn-secondary" 
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className={`btn btn-${variant === 'danger' ? 'danger' : 'primary'}`} 
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
