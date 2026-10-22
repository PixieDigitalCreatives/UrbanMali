import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LogoMark.module.scss';

export const LogoMark = ({ variant = 'dark', className = '' }) => {
  const isLight = variant === 'light';
  const primaryColor = isLight ? '#F4ECDD' : '#3F5B34';
  const secondaryColor = isLight ? '#E6D8BD' : '#2B2118';
  const leafAccent = isLight ? '#A9BE8F' : '#3F5B34';
  const ruleColor = isLight ? '#8B6B4A' : '#C9A87C';

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
              stroke={isLight ? '#F4ECDD' : '#5E7F4A'}
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
          style={{ color: isLight ? '#DDE7CF' : '#8B6B4A' }}
        >
          BRING NATURE HOME
        </span>
        <div className={styles.rule} style={{ backgroundColor: ruleColor }} />
      </div>
    </Link>
  );
};
