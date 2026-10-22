import React, { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../../lib/scrollFx';
import styles from './Marquee.module.scss';

const Leaf = () => (
  <svg className={styles.leaf} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 21C3 12 9 5 21 3C20 14 13 20 3 21Z" />
    <path className={styles.leafRib} d="M4 20C9 15 13 11 18 6" />
  </svg>
);

// Endless ribbon of services; scrolling speeds it up and flips its direction.
export const Marquee = ({ items }) => {
  const rootRef = useRef(null);
  const trackRef = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const track = trackRef.current;
    const setX = gsap.quickSetter(track, 'xPercent');
    let x = 0;
    let dir = -1;
    let boost = 0;

    const st = ScrollTrigger.create({
      trigger: rootRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        dir = self.direction === 1 ? -1 : 1;
        boost = Math.min(Math.abs(self.getVelocity()) / 260, 7);
      },
    });

    const tick = (time, dt) => {
      boost *= 0.95;
      x += dir * (0.018 + boost * 0.03) * (dt / 16.67);
      if (x <= -50) x += 50;
      if (x > 0) x -= 50;
      setX(x);
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      st.kill();
    };
  }, []);

  const group = (hidden) => (
    <div className={styles.group} aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <span key={item} className={styles.item}>
          <span>{item}</span>
          <Leaf />
        </span>
      ))}
    </div>
  );

  return (
    <div ref={rootRef} className={styles.root}>
      <div ref={trackRef} className={styles.track}>
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
};

export default Marquee;
