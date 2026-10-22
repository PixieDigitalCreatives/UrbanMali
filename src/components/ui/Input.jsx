import React from 'react';
import { AlertCircle } from 'lucide-react';
import styles from './Input.module.scss';

export const Input = React.forwardRef(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={styles.wrapper}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {props.required && <span className={styles.requiredStar}>*</span>}
          </label>
        )}
        <div className={styles.inputContainer}>
          <input
            id={inputId}
            ref={ref}
            className={`${styles.input} ${error ? styles.inputError : ''} ${className}`}
            {...props}
          />
        </div>
        {error && (
          <div className={styles.errorRow}>
            <AlertCircle className={styles.errorIcon} />
            <span>{error}</span>
          </div>
        )}
        {helperText && !error && (
          <span className={styles.helperText}>{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
