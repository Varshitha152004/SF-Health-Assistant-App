import React, { useEffect } from 'react';
import { CriticalTriangleIcon, RiskTriangleIcon } from './CriticalTriangleIcon';

export default function ToastNotification({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      onClose();
    }, 4500);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isCritical = toast.type === 'critical' || toast.type === 'error';

  return (
    <div className="toast-portal-container" role="alert" aria-live="assertive">
      <div className={`app-toast toast-${toast.type || 'warning'}`}>
        <div className="toast-icon-wrap">
          {isCritical ? (
            <CriticalTriangleIcon size={20} />
          ) : (
            <RiskTriangleIcon size={20} />
          )}
        </div>

        <div className="toast-body">
          <div className="toast-title-row">
            <span className="toast-badge-warning">WARNING</span>
          </div>
          <p className="toast-message">{toast.message}</p>
        </div>

        <button 
          type="button"
          className="toast-close-btn"
          onClick={onClose}
          aria-label="Close notification"
          title="Dismiss"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}
