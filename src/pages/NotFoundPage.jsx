import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Sprout, ArrowLeft } from 'lucide-react';
import styles from './NotFoundPage.module.scss';

export const NotFoundPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.iconWrap}>
        <Sprout style={{ width: '40px', height: '40px' }} />
      </div>

      <span className={styles.code}>
        404
      </span>
      <h1 className={styles.title}>
        Page Not Found
      </h1>
      <p className={styles.desc}>
        The plant path you took doesn't exist or may have been relocated.
      </p>

      <Link to="/">
        <Button variant="primary" size="md" icon={<ArrowLeft style={{ width: '16px', height: '16px' }} />}>
          Return to Garden Home
        </Button>
      </Link>
    </div>
  );
};
