import React, { useState } from 'react';
import { checkArea } from '../../lib/api';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import styles from './PincodeField.module.scss';

export const PincodeField = ({
  buttonText = 'Check Availability',
  placeholder = 'Enter your pincode',
  className = '',
  onResult,
  compact = false,
  tone = 'light',
}) => {
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!pincode.trim() || pincode.trim().length < 6) return;

    setLoading(true);
    try {
      const res = await checkArea(pincode);
      setResult(res);
      onResult?.(res);
    } finally {
      setLoading(false);
    }
  };

  const getFeedbackClass = () => {
    if (!result) return '';
    if (result.status === 'available') return styles.feedbackAvailable;
    if (result.status === 'coming_soon') return styles.feedbackComingSoon;
    return styles.feedbackUnavailable;
  };

  return (
    <div className={`${styles.wrapper} ${tone === 'dark' ? styles.dark : ''} ${className}`}>
      <form onSubmit={handleCheck} className={styles.form}>
        <input
          type="text"
          maxLength={6}
          inputMode="numeric"
          pattern="[0-9]*"
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value.replace(/\D/g, ''));
            setResult(null);
          }}
          placeholder={placeholder}
          className={styles.input}
          aria-label="Pincode check"
        />
        <button
          type="submit"
          disabled={loading || pincode.length !== 6}
          className={`${styles.button} ${compact ? styles.compactButton : ''}`}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <svg className={styles.spinner} fill="none" viewBox="0 0 24 24">
                <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Checking</span>
            </span>
          ) : (
            buttonText
          )}
        </button>
      </form>

      {result && (
        <div className={`${styles.feedback} ${getFeedbackClass()}`}>
          {result.status === 'available' ? (
            <CheckCircle2 className={styles.feedbackIcon} />
          ) : result.status === 'coming_soon' ? (
            <Clock className={styles.feedbackIcon} />
          ) : (
            <AlertCircle className={styles.feedbackIcon} />
          )}
          <div className={styles.feedbackText}>
            <span className={styles.feedbackTitle}>{result.message}</span>
            {result.locality && (
              <span className={styles.feedbackLocality}>Locality: {result.locality}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
