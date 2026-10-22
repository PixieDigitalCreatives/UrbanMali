import React from 'react';
import styles from './Button.module.scss';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClass = styles[size] || styles.md;
  const variantClass = styles[variant] || styles.primary;
  const widthClass = fullWidth ? styles.fullWidth : '';

  return (
    <button
      className={`${styles.button} ${sizeClass} ${variantClass} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg className={styles.loadingSpinner} fill="none" viewBox="0 0 24 24">
            <circle className={styles.spinnerTrack} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className={styles.spinnerHead} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        <>
          {icon && <span className={styles.iconWrapper}>{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};
