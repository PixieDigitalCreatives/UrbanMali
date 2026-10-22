import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import styles from './ToastContext.module.scss';

const ToastContext = createContext(undefined);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(
    (message, type = 'success', actionLabel, onAction) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, message, type, actionLabel, onAction }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className={styles.toastContainer}
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={styles.toastItem}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              {toast.type === 'error' ? (
                <AlertCircle style={{ width: '20px', height: '20px', color: '#C25E3E', flexShrink: 0 }} />
              ) : toast.type === 'info' ? (
                <Info style={{ width: '20px', height: '20px', color: '#5F7268', flexShrink: 0 }} />
              ) : (
                <CheckCircle style={{ width: '20px', height: '20px', color: '#1F5E46', flexShrink: 0 }} />
              )}
              <span style={{ fontWeight: 500 }}>{toast.message}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {toast.actionLabel && toast.onAction && (
                <button
                  onClick={() => {
                    toast.onAction?.();
                    removeToast(toast.id);
                  }}
                  style={{ fontSize: '12px', fontWeight: 600, color: '#1F5E46', textDecoration: 'underline', background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  {toast.actionLabel}
                </button>
              )}
              <button
                onClick={() => removeToast(toast.id)}
                style={{ color: '#5F7268', padding: '0.25rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
                aria-label="Close notification"
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
