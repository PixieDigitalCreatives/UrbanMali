import React from 'react';
import { Home, Users, Briefcase, Building2, ShoppingBag } from 'lucide-react';
import styles from './WhoWeServeSection.module.scss';

const audiences = [
  {
    id: 'homes',
    title: 'Homes',
    subtitle: 'Apartments and independent houses',
    icon: <Home strokeWidth={1.4} />,
  },
  {
    id: 'societies',
    title: 'Societies',
    subtitle: 'Residential communities',
    icon: <Users strokeWidth={1.4} />,
  },
  {
    id: 'offices',
    title: 'Offices',
    subtitle: 'Workspaces and co-working spaces',
    icon: <Briefcase strokeWidth={1.4} />,
  },
  {
    id: 'corporates',
    title: 'Corporates',
    subtitle: 'Business premises',
    icon: <Building2 strokeWidth={1.4} />,
  },
  {
    id: 'malls',
    title: 'Malls',
    subtitle: 'Retail and commercial spaces',
    icon: <ShoppingBag strokeWidth={1.4} />,
  },
];

export const WhoWeServeSection = () => {
  return (
    <ul className={styles.list} data-reveal-group data-reveal-stagger="0.08">
      {audiences.map((item, i) => (
        <li key={item.id} className={styles.row} data-reveal-item>
          <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
          <h3 className={styles.title}>{item.title}</h3>
          <p className={styles.subtitle}>{item.subtitle}</p>
          <span className={styles.iconWrapper}>{item.icon}</span>
        </li>
      ))}
    </ul>
  );
};

export default WhoWeServeSection;
