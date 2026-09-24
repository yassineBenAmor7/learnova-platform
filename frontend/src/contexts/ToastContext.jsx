import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const lastToastRef = useRef({ message: '', type: '', time: 0 });

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const now = Date.now();
    // Prevent duplicate toast with identical message and type within 2000ms
    if (
      lastToastRef.current.message === message &&
      lastToastRef.current.type === type &&
      now - lastToastRef.current.time < 2000
    ) {
      return null;
    }
    lastToastRef.current = { message, type, time: now };

    const id = `${now}-${Math.random().toString(36).substring(2, 9)}`;
    const toast = { id, message, type, duration };
    setToasts((prev) => [...prev, toast]);
    return id;
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (message, duration) => addToast(message, 'success', duration);
  const error = (message, duration) => addToast(message, 'error', duration);
  const warning = (message, duration) => addToast(message, 'warning', duration);
  const info = (message, duration) => addToast(message, 'info', duration);

  const value = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
