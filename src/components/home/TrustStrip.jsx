import React from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, CalendarSync, Building2, ShoppingBag, ArrowUpRight } from 'lucide-react';
import styles from './TrustStrip.module.scss';

const trustItems = [
  {
    id: 'local-maalis',
    line1: 'Local maalis',
    line2: 'from your area',
    detail: 'Trained gardeners stationed near your sector, matched to you by pincode.',
    icon: <UserCheck strokeWidth={1.5} />,
    variant: 'photo',
    image: '/images/service-plant-maintenance.jpg',
  },
  {
    id: 'recurring-care',
    line1: 'Recurring',
    line2: 'visits and care',
    detail: 'Weekly, fortnightly or monthly visits, so no plant misses a season.',
    icon: <CalendarSync strokeWidth={1.5} />,
    variant: 'sage',
  },
  {
    id: 'versatile',
    line1: 'Homes to corporates',
    line2: 'and malls',
    detail: 'Balconies, society parks, office lobbies and retail spaces.',
    icon: <Building2 strokeWidth={1.5} />,
    variant: 'gold',
  },
  {
    id: 'transparent-booking',
    line1: 'Simple',
    line2: 'and transparent booking',
    detail: 'Book online or on WhatsApp. We confirm coverage and price before the visit.',
    icon: <ShoppingBag strokeWidth={1.5} />,
    variant: 'emerald',
    cta: { label: 'Book a Service', href: '/book' },
  },
];

// Bento of reasons to choose UrbanMaali.
export const TrustStrip = () => {
  return (
    <ul className={styles.grid} data-reveal-group data-reveal-stagger="0.12">
      {trustItems.map((item, i) => (
        <li key={item.id} className={`${styles.card} ${styles[item.variant]}`} data-reveal-item>
          {item.image && (
            <div className={styles.photoBg} aria-hidden="true">
              <img src={item.image} alt="" loading="lazy" />
            </div>
          )}

          <div className={styles.top}>
            <span className={styles.iconWrapper}>{item.icon}</span>
            <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
          </div>

          <div className={styles.body}>
            <h3 className={styles.title}>
              {item.line1} <em>{item.line2}</em>
            </h3>
            <p className={styles.detail}>{item.detail}</p>
            {item.cta && (
              <Link to={item.cta.href} className={styles.cta}>
                {item.cta.label}
                <span className={styles.ctaIcon} aria-hidden="true">
                  <ArrowUpRight strokeWidth={2} />
                </span>
              </Link>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TrustStrip;
