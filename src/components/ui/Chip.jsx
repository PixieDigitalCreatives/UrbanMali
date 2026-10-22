import React from 'react';
import styles from './Chip.module.scss';

export const Chip = ({
  children,
  selected = false,
  variant = 'solid',
  className = '',
  ...props
}) => {
  let stateClass = '';
  if (selected) {
    stateClass = variant === 'soft' ? styles.isSelectedSoft : styles.isSelectedSolid;
  }

  return (
    <button
      type="button"
      className={`${styles.chip} ${stateClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
