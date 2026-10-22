import React from 'react';
import { RevealText } from './RevealText';
import { HeroCarousel } from './HeroCarousel';
import styles from './PageHero.module.scss';

// Page header shared by inner pages, matching the home hero: copy on the
// left over a light background with a drifting photo carousel behind it.
// Titles accept *italic* accents.
export const PageHero = ({ index, eyebrow, title, subtitle, slides = [], children }) => {
  return (
    <header className={styles.hero}>
      {slides.length > 0 && <HeroCarousel slides={slides} />}

      <div className={styles.inner}>
        <div className={styles.copy}>
          {(index || eyebrow) && (
            <span className={styles.eyebrow} data-reveal="up">
              {index && <span className={styles.index}>({index})</span>}
              {eyebrow}
            </span>
          )}
          <RevealText as="h1" className={styles.title} text={title} />
          {subtitle && (
            <p className={styles.subtitle} data-reveal="up" data-reveal-delay="0.25">
              {subtitle}
            </p>
          )}
          {children && (
            <div className={styles.extra} data-reveal="up" data-reveal-delay="0.35">
              {children}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default PageHero;
