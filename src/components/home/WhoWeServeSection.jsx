import React from 'react';
import { Home, Users, Briefcase, Building2, ShoppingBag } from 'lucide-react';
import styles from './WhoWeServeSection.module.scss';

const audiences = [
  {
    id: 'homes',
    title: 'Homes',
    subtitle: 'Apartments and independent houses',
    icon: <Home />,
  },
  {
    id: 'societies',
    title: 'Societies',
    subtitle: 'Residential communities',
    icon: <Users />,
  },
  {
    id: 'offices',
    title: 'Offices',
    subtitle: 'Workspaces and co-working spaces',
    icon: <Briefcase />,
  },
  {
    id: 'corporates',
    title: 'Corporates',
    subtitle: 'Business premises',
    icon: <Building2 />,
  },
  {
    id: 'malls',
    title: 'Malls',
    subtitle: 'Retail and commercial spaces',
    icon: <ShoppingBag />,
  },
];

export const WhoWeServeSection = () => {
  return (
    <div className={styles.grid}>
      {audiences.map((item) => (
        <div key={item.id} className={styles.card}>
          <div className={styles.iconWrapper}>
            {item.icon}
          </div>
          <div className={styles.content}>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.subtitle}>{item.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WhoWeServeSection;
