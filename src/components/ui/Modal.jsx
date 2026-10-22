import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './Modal.module.scss';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div
        className={styles.backdrop}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`${styles.dialog} ${maxWidth}`}
      >
        <div className={styles.header}>
          {title ? (
            <h3 className={styles.title}>{title}</h3>
          ) : <div />}
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close dialog"
          >
            <X className={styles.closeIcon} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
