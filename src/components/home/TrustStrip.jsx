import React from 'react';
import { UserCheck, CalendarSync, Building2, ShoppingBag } from 'lucide-react';
import styles from './TrustStrip.module.scss';

const trustItems = [
  {
    id: 'local-maalis',
    line1: 'Local maalis',
    line2: 'from your area',
    icon: <UserCheck />,
  },
  {
    id: 'recurring-care',
    line1: 'Recurring',
    line2: 'visits and care',
    icon: <CalendarSync />,
  },
  {
    id: 'versatile',
    line1: 'Homes to corporates',
    line2: 'and malls',
    icon: <Building2 />,
  },
  {
    id: 'transparent-booking',
    line1: 'Simple',
    line2: 'and transparent booking',
    icon: <ShoppingBag />,
  },
];

export const TrustStrip = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {trustItems.map((item) => (
            <div key={item.id} className={styles.item}>
              <div className={styles.iconWrapper}>
                {item.icon}
              </div>
              <div className={styles.textGroup}>
                <span className={styles.line1}>{item.line1}</span>
                <span className={styles.line2}>{item.line2}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustStrip;
