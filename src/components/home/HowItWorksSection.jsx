import React, { useLayoutEffect, useRef, useState } from 'react';
import { Calendar, Check, CheckCircle2, MapPin, Sparkles, UserCheck } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { gsap } from '../../lib/scrollFx';
import styles from './HowItWorksSection.module.scss';

const steps = [
  {
    number: 1,
    title: 'Choose a service',
    subtitle: 'Pick what you need',
    icon: <Sparkles strokeWidth={1.5} />,
  },
  {
    number: 2,
    title: 'Share location',
    subtitle: 'and property details',
    icon: <MapPin strokeWidth={1.5} />,
  },
  {
    number: 3,
    title: 'Pick date and time',
    subtitle: 'Choose a convenient slot',
    icon: <Calendar strokeWidth={1.5} />,
  },
  {
    number: 4,
    title: 'We confirm coverage and price',
    subtitle: 'on WhatsApp or call',
    icon: <CheckCircle2 strokeWidth={1.5} />,
  },
  {
    number: 5,
    title: 'Your maali visits and takes care',
    subtitle: 'of your plants',
    icon: <UserCheck strokeWidth={1.5} />,
  },
];

// Leaves along the stem: base point, angle and side (1 = right, -1 = left)
const LEAVES = [
  { x: 161, y: 262, a: -28, side: 1, s: 0.75 },
  { x: 159, y: 240, a: -152, side: -1, s: 0.8 },
  { x: 166, y: 208, a: -22, side: 1, s: 1 },
  { x: 160, y: 182, a: -158, side: -1, s: 1 },
  { x: 151, y: 150, a: -30, side: 1, s: 0.95 },
  { x: 152, y: 126, a: -150, side: -1, s: 0.9 },
  { x: 159, y: 98, a: -35, side: 1, s: 0.7 },
];

// A seed in a pot that sprouts, leafs out and blooms across the five steps
const GrowingPlant = () => (
  <svg viewBox="0 0 320 420" className={styles.plant} aria-hidden="true">
    <defs>
      <linearGradient id="hiw-leaf" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#4A8B6E" />
        <stop offset="100%" stopColor="#8DB8A2" />
      </linearGradient>
      <linearGradient id="hiw-pot" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#C9AE66" />
        <stop offset="100%" stopColor="#9C8240" />
      </linearGradient>
    </defs>

    <path
      data-plant="stem"
      className={styles.stem}
      d="M160 296 C 156 262, 170 236, 164 206 S 146 160, 152 130 S 166 96, 162 62"
    />
    {LEAVES.map((leaf, i) => (
      <g key={i} transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.a}) scale(${leaf.s})`}>
        <g data-plant="leaf">
          <path className={styles.leaf} d="M0 0 C 12 -16, 40 -20, 62 -4 C 42 10, 16 10, 0 0 Z" />
          <path className={styles.leafVein} d="M2 0 C 20 -4, 38 -6, 58 -4" />
        </g>
      </g>
    ))}

    <g data-plant="bloom" transform="translate(162 58)">
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <g key={deg} transform={`rotate(${deg})`}>
          <ellipse className={styles.petal} cx="0" cy="-15" rx="9" ry="16" />
        </g>
      ))}
      <circle className={styles.bloomCore} r="8" />
    </g>

    <ellipse data-plant="seed" className={styles.seed} cx="160" cy="292" rx="8" ry="5.5" />

    <ellipse className={styles.soil} cx="160" cy="300" rx="74" ry="9" />
    <path className={styles.pot} d="M86 304 L234 304 L218 404 Q160 416 102 404 Z" />
    <rect className={styles.potRim} x="76" y="288" width="168" height="24" rx="10" />
  </svg>
);

export const HowItWorksSection = () => {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const ringRef = useRef(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const q = (sel) => section.querySelectorAll(sel);
    const stem = section.querySelector('[data-plant="stem"]');
    const seed = section.querySelector('[data-plant="seed"]');
    const leaves = q('[data-plant="leaf"]');
    const petals = q('[data-plant="bloom"] ellipse');
    const core = section.querySelector('[data-plant="bloom"] circle');
    const ring = ringRef.current;
    const stemLen = stem.getTotalLength();
    const ringLen = ring.getTotalLength();
    const mm = gsap.matchMedia();

    mm.add(
      { reduce: '(prefers-reduced-motion: reduce)', motion: '(prefers-reduced-motion: no-preference)' },
      (ctx) => {
        if (ctx.conditions.reduce) {
          setActive(steps.length - 1);
          return undefined;
        }

        gsap.set(stem, { strokeDasharray: stemLen, strokeDashoffset: stemLen });
        gsap.set(ring, { strokeDasharray: ringLen, strokeDashoffset: ringLen });
        gsap.set(leaves, { scale: 0, transformOrigin: '0% 50%' });
        gsap.set([...petals, core], { scale: 0, transformOrigin: '50% 100%' });
        gsap.set(core, { transformOrigin: '50% 50%' });

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section,
            pin: pinRef.current,
            start: 'top top',
            end: () => `+=${window.innerHeight * 3.2}`,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setActive(Math.min(steps.length - 1, Math.floor(self.progress * steps.length * 0.999))),
          },
        });

        tl.to(ring, { strokeDashoffset: 0, duration: 1 }, 0)
          // step 1: the seed stirs
          .to(seed, { scale: 1.35, transformOrigin: '50% 50%', duration: 0.08, yoyo: true, repeat: 1 }, 0)
          // steps 2-4: the stem climbs and leaves unfurl in pairs
          .to(stem, { strokeDashoffset: 0, duration: 0.72 }, 0.12)
          .to(seed, { opacity: 0, duration: 0.1 }, 0.2);
        leaves.forEach((leaf, i) => {
          tl.to(leaf, { scale: 1, duration: 0.12, ease: 'back.out(2.2)' }, 0.18 + i * 0.095);
        });
        // step 5: the bloom opens
        tl.to(petals, { scale: 1, duration: 0.1, stagger: 0.02, ease: 'back.out(2)' }, 0.86).to(
          core,
          { scale: 1, duration: 0.06, ease: 'back.out(3)' },
          0.94
        );
        return undefined;
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div ref={pinRef} className={styles.pin}>
        <div className={styles.container}>
          <div className={styles.stage}>
            <svg viewBox="0 0 400 400" className={styles.ring} aria-hidden="true">
              <circle className={styles.ringTrack} cx="200" cy="200" r="190" />
              <circle ref={ringRef} className={styles.ringFill} cx="200" cy="200" r="190" />
            </svg>
            <div className={styles.halo} aria-hidden="true" />
            <GrowingPlant />
            <div className={styles.counter} aria-hidden="true">
              <span className={styles.counterNow}>{String(active + 1).padStart(2, '0')}</span>
              <span className={styles.counterTotal}>/ {String(steps.length).padStart(2, '0')}</span>
            </div>
          </div>

          <div className={styles.content}>
            <SectionHeading
              index="03"
              eyebrow="How it works"
              tone="dark"
              title="From first message to *first bloom*"
              subtitle="Get expert plant care in a few simple steps."
              className={styles.heading}
            />

            <ol className={styles.steps}>
              {steps.map((step, i) => (
                <li
                  key={step.number}
                  className={`${styles.step} ${i === active ? styles.isActive : ''} ${i < active ? styles.isDone : ''}`}
                >
                  <span className={styles.stepIcon}>{i < active ? <Check strokeWidth={2.2} /> : step.icon}</span>
                  <div className={styles.stepText}>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepSubtitle}>{step.subtitle}</p>
                  </div>
                  <span className={styles.stepNumber}>{String(step.number).padStart(2, '0')}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
