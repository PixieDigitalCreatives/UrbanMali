import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import { ArrowRight, Sparkles } from 'lucide-react';
import styles from './ServiceCard.module.scss';

export const ServiceCard = ({ service }) => {
  return (
    <Link
      to={`/services/${service.slug}`}
      className={styles.card}
    >
      <div className={styles.imageContainer}>
        <img
          src={service.image}
          alt={service.title}
          className={styles.image}
        />
        <div className={styles.badgePosition}>
          <Badge variant="illustrative">Illustrative image</Badge>
        </div>

        <div className={styles.mobileSparkle}>
          <Sparkles className={styles.sparkleIcon} />
        </div>
      </div>

      <div className={styles.content}>
        <div>
          <h3 className={styles.title}>
            {service.title}
          </h3>
          <p className={styles.subtitle}>
            {service.subtitle}
          </p>
        </div>

        <div className={styles.footerRow}>
          <div className={styles.priceCol}>
            <span className={styles.price}>
              {service.priceDisplay}
            </span>
          </div>

          <div className={styles.arrowButton}>
            <ArrowRight className={styles.arrowIcon} />
          </div>
        </div>
      </div>
    </Link>
  );
};
