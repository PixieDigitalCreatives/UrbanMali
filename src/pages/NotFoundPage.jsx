import React from 'react';
import { Link } from 'react-router-dom';
import { RevealText } from '../components/ui/RevealText';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import styles from './NotFoundPage.module.scss';

export const NotFoundPage = () => {
  return (
    <div className={styles.page} data-creeper="hang" data-creeper-count="9">
      <span className={styles.code} aria-hidden="true" data-parallax="-8">
        4<em>0</em>4
      </span>

      <div className={styles.content}>
        <RevealText as="h1" className={styles.title} text="Page *not found*" />
        <p className={styles.desc} data-reveal="up" data-reveal-delay="0.3">
          The plant path you took doesn't exist or may have been relocated.
        </p>
        <div className={styles.actions} data-reveal="up" data-reveal-delay="0.4">
          <Link to="/" className={styles.primary} data-magnetic="0.25">
            <ArrowLeft strokeWidth={1.8} />
            Return to Garden Home
          </Link>
          <Link to="/services" className={styles.secondary}>
            Browse services <ArrowUpRight strokeWidth={1.6} />
          </Link>
        </div>
      </div>
    </div>
  );
};
