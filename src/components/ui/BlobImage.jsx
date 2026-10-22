import React from 'react';
import { Badge } from './Badge';
import styles from './BlobImage.module.scss';

export const BlobImage = ({
  src = '/images/hero-art-complete.png',
  alt,
  className = '',
  showSprig = false,
  showBadge = false,
}) => {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.inner}>
        <img
          src={src}
          alt={alt}
          className={styles.image}
        />
        {showBadge && (
          <div className={styles.badgeContainer}>
            <Badge variant="illustrative">Illustrative image</Badge>
          </div>
        )}
      </div>
    </div>
  );
};
