import React from 'react';
import { Badge } from '../ui/Badge';
import { ChevronRight } from 'lucide-react';
import styles from './PlanCard.module.scss';

export const PlanCard = ({ plan, onRequestQuote }) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={plan.image}
          alt={plan.title}
          className={styles.image}
        />
        <div className={styles.badgePosition}>
          <Badge variant="illustrative">Illustrative image</Badge>
        </div>
      </div>

      <div className={styles.content}>
        <div>
          <span className={styles.audience}>
            {plan.audience}
          </span>
          <h3 className={styles.title}>
            {plan.title}
          </h3>
          <p className={styles.description}>
            {plan.description}
          </p>

          <div className={styles.statusWrapper}>
            <span className={styles.statusPill}>
              {plan.statusText}
            </span>
          </div>
        </div>

        <div className={styles.footerRow}>
          <button
            onClick={() => onRequestQuote(plan.title)}
            className={styles.quoteButton}
          >
            <span>Request a quote</span>
            <ChevronRight className={styles.chevron} />
          </button>
        </div>
      </div>
    </div>
  );
};
