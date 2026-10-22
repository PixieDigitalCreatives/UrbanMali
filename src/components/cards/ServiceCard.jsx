import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import { ArrowUpRight } from 'lucide-react';
import styles from './ServiceCard.module.scss';

export const ServiceCard = ({ service }) => {
  return (
    <Link to={`/services/${service.slug}`} className={styles.card} data-cursor="View">
      <div className={styles.imageContainer}>
        <img src={service.image} alt={service.title} className={styles.image} loading="lazy" />
        <div className={styles.badgePosition}>
          <Badge variant="illustrative">Illustrative image</Badge>
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{service.title}</h3>
        <p className={styles.subtitle}>{service.subtitle}</p>

        <div className={styles.footerRow}>
          <span className={styles.price}>{service.priceDisplay}</span>
          <span className={styles.arrowButton} aria-hidden="true">
            <ArrowUpRight className={styles.arrowIcon} strokeWidth={1.6} />
          </span>
        </div>
      </div>
    </Link>
  );
};
