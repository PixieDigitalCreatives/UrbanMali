import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, Clock } from 'lucide-react';
import { gsap } from '../../lib/scrollFx';
import styles from './ServiceStack.module.scss';

const VARIANTS = ['forest', 'sand', 'emerald', 'sage', 'gold', 'forest'];

// Services as large cards that stick and pile up while scrolling: each new
// card rises over the last one, which settles back into the stack.
export const ServiceStack = ({ services }) => {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const items = Array.from(rootRef.current.querySelectorAll('[data-stack-item]'));
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      items.forEach((item, i) => {
        const card = item.querySelector('[data-stack-card]');
        const shade = item.querySelector('[data-stack-shade]');

        // arrive with a slight tilt that straightens as it lands
        gsap.fromTo(
          card,
          { y: 110, rotate: i % 2 === 0 ? -3 : 3 },
          {
            y: 0,
            rotate: 0,
            ease: 'none',
            scrollTrigger: { trigger: item, start: 'top bottom', end: 'top 45%', scrub: 0.6 },
          }
        );

        const next = items[i + 1];
        if (!next) return;
        const settle = {
          trigger: next,
          start: 'top 80%',
          end: () => `top ${parseFloat(getComputedStyle(next).top) || 96}px`,
          scrub: 0.6,
          invalidateOnRefresh: true,
        };
        gsap.to(card, { scale: 0.9 + i * 0.012, ease: 'none', scrollTrigger: settle });
        gsap.to(shade, { opacity: 0.32, ease: 'none', scrollTrigger: { ...settle } });
      });
    });

    return () => mm.revert();
  }, [services]);

  return (
    <div ref={rootRef} className={styles.stack}>
      {services.map((service, i) => (
        <div key={service.id} className={styles.item} style={{ '--i': i }} data-stack-item>
          <Link
            to={`/services/${service.slug}`}
            className={`${styles.card} ${styles[VARIANTS[i % VARIANTS.length]]}`}
            data-stack-card
            data-cursor="View"
          >
            <div className={styles.media}>
              <img src={service.image} alt={service.title} loading="lazy" />
            </div>

            <div className={styles.body}>
              <div className={styles.meta}>
                <span className={styles.count}>
                  {String(i + 1).padStart(2, '0')} <span>/ {String(services.length).padStart(2, '0')}</span>
                </span>
                <span className={styles.duration}>
                  <Clock strokeWidth={1.6} /> {service.duration}
                </span>
              </div>

              <h3 className={styles.title}>{service.title}</h3>
              <p className={styles.subtitle}>{service.subtitle}</p>

              <ul className={styles.included}>
                {service.included.slice(0, 3).map((item) => (
                  <li key={item}>
                    <Check strokeWidth={2.2} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className={styles.footer}>
                <div className={styles.priceBlock}>
                  <span className={styles.price}>{service.priceDisplay}</span>
                  {service.priceNote && <span className={styles.priceNote}>{service.priceNote}</span>}
                </div>
                <span className={styles.arrow} aria-hidden="true">
                  <ArrowUpRight strokeWidth={1.8} />
                </span>
              </div>
            </div>

            <span className={styles.shade} data-stack-shade aria-hidden="true" />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ServiceStack;
