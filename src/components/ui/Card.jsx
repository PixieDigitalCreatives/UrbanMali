import React from 'react';
import styles from './Card.module.scss';

export const Card = ({
  children,
  hoverable = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`${styles.card} ${hoverable ? styles.hoverable : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
