import React from 'react';
import styles from './Badge.module.scss';

export const Badge = ({
  variant = 'stock',
  children,
  className = '',
}) => {
  const variantClass = styles[variant] || styles.stock;

  return (
    <span className={`${styles.badge} ${variantClass} ${className}`}>
      {children}
    </span>
  );
};
