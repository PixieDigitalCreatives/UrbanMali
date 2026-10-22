import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LogoMark.module.scss';

export const LogoMark = ({ variant = 'dark', className = '' }) => {
  const isLight = variant === 'light';
  const primaryColor = isLight ? '#F5F0E4' : '#1F5E46';
  const secondaryColor = isLight ? '#E7DEC6' : '#0E3529';
  const leafAccent = isLight ? '#8DB8A2' : '#1F5E46';
  const ruleColor = isLight ? '#5F7268' : '#CDB77E';

  return (
    <Link to="/" className={`${styles.link} ${className}`}>
      <div className={styles.topRow}>
        <span
          className={styles.theWord}
          style={{ color: secondaryColor }}
        >
          THE
        </span>
        <div className={styles.brandGroup}>
          <span
            className={styles.urbanWord}
            style={{ color: primaryColor }}
          >
            URBAN
          </span>
          <svg
            className={styles.sprigSvg}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M3 21C3 13 8 8 16 6C16 14 11 19 3 21Z"
              fill={leafAccent}
            />
            <path
              d="M7 15C13 11 17 6 21 3C21 8 18 13 14 16"
              stroke={isLight ? '#F5F0E4' : '#4A8B6E'}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span
            className={styles.devanagariWord}
            style={{ color: primaryColor }}
          >
            माली
          </span>
        </div>
      </div>
      <div className={styles.subline}>
        <div className={styles.rule} style={{ backgroundColor: ruleColor }} />
        <span
          className={styles.tagline}
          style={{ color: isLight ? '#DCE8DF' : '#5F7268' }}
        >
          BRING NATURE HOME
        </span>
        <div className={styles.rule} style={{ backgroundColor: ruleColor }} />
      </div>
    </Link>
  );
};
