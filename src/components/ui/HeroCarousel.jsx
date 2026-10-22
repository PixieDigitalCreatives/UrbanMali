import React from 'react';
import styles from './HeroCarousel.module.scss';

// Endless strip of photos drifting right-to-left behind hero copy.
// On large screens it fills the hero and fades out under the text column;
// on phones it sits below the copy as its own band.
export const HeroCarousel = ({ slides, duration = 70 }) => {
  // repeat short lists so each half of the loop is wider than the screen
  const half = slides.length < 6 ? [...slides, ...slides] : slides;
  const track = [...half, ...half];

  return (
    <div className={styles.carousel} aria-hidden="true">
      <div className={styles.track} style={{ '--duration': `${duration}s` }}>
        {track.map((src, i) => (
          <div key={i} className={styles.slide}>
            <img src={src} alt="" loading={i < 4 ? 'eager' : 'lazy'} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
