import React from 'react';
import { Badge } from '../ui/Badge';
import { ArrowUpRight, Check } from 'lucide-react';
import styles from './PlanCard.module.scss';

export const PlanCard = ({ plan, onRequestQuote }) => {
  return (
    <article className={styles.card} data-reveal-item>
      <div className={styles.imageContainer}>
        <img src={plan.image} alt={plan.title} className={styles.image} data-parallax="6" loading="lazy" />
        <div className={styles.badgePosition}>
          <Badge variant="illustrative">Illustrative image</Badge>
        </div>
        <span className={styles.statusPill}>{plan.statusText}</span>
      </div>

      <div className={styles.content}>
        <span className={styles.audience}>{plan.audience}</span>
        <h3 className={styles.title}>{plan.title}</h3>
        <p className={styles.description}>{plan.description}</p>

        {plan.features?.length > 0 && (
          <ul className={styles.features}>
            {plan.features.map((feature) => (
              <li key={feature}>
                <Check className={styles.check} strokeWidth={2} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}

        <div className={styles.footerRow}>
          <button onClick={() => onRequestQuote(plan.title)} className={styles.quoteButton}>
            <span>Request a quote</span>
            <span className={styles.quoteIcon} aria-hidden="true">
              <ArrowUpRight className={styles.chevron} />
            </span>
          </button>
        </div>
      </div>
    </article>
  );
};
