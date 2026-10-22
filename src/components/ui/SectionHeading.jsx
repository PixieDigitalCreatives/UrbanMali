import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import styles from './SectionHeading.module.scss';

export const SectionHeading = ({
  title,
  subtitle,
  linkText,
  linkHref,
  className = '',
}) => {
  return (
    <div className={`${styles.header} ${className}`}>
      <div>
        <h2 className={styles.title}>
          {title}
        </h2>
        {subtitle && (
          <p className={styles.subtitle}>
            {subtitle}
          </p>
        )}
      </div>
      {linkText && linkHref && (
        <Link
          to={linkHref}
          className={styles.link}
        >
          <span>{linkText}</span>
          <ChevronRight className={styles.chevron} />
        </Link>
      )}
    </div>
  );
};
