import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { RevealText } from './RevealText';
import styles from './SectionHeading.module.scss';

// Editorial section header: index + eyebrow, display title, optional link.
// Titles accept *asterisks* for the italic accent word.
export const SectionHeading = ({
  title,
  subtitle,
  linkText,
  linkHref,
  index,
  eyebrow,
  tone = 'light',
  className = '',
}) => {
  return (
    <div className={`${styles.header} ${tone === 'dark' ? styles.dark : ''} ${className}`}>
      <div className={styles.main}>
        {(index || eyebrow) && (
          <span className={styles.eyebrow} data-reveal="up">
            {index && <span className={styles.index}>({index})</span>}
            {eyebrow}
          </span>
        )}
        <RevealText as="h2" className={styles.title} text={title} />
      </div>
      {(subtitle || (linkText && linkHref)) && (
        <div className={styles.aside} data-reveal="up" data-reveal-delay="0.15">
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          {linkText && linkHref && (
            <Link to={linkHref} className={styles.link}>
              <span>{linkText.replace(/\s*>\s*$/, '')}</span>
              <span className={styles.linkIcon}>
                <ArrowUpRight />
              </span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};
