// ==========================================
// SCROLL FX
// Attribute-driven GSAP ScrollTrigger reveals, applied per route.
//   data-reveal="words"   word-by-word rise (markup from <RevealText>)
//   data-reveal="fill"    words brighten as you scroll (scrubbed)
//   data-reveal="up"      fade + rise
//   data-reveal="image"   clip wipe + image settle
//   data-reveal="line"    hairline draws left -> right
//   data-reveal="scale"   soft scale-in
//   data-reveal-group     children with data-reveal-item stagger in
//   data-parallax="12"    scrubbed vertical drift (yPercent range)
//   data-magnetic         element leans toward the pointer
// ==========================================
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initScrollFx(root = document) {
  if (prefersReduced()) return () => {};
  const cleanups = [];

  const ctx = gsap.context(() => {
    const q = (sel) => Array.from(root.querySelectorAll(sel));
    const delayOf = (el) => parseFloat(el.dataset.revealDelay || '0');
    // Anything already on screen when the route mounts plays straight away
    // (hero copy near the fold shouldn't wait for a scroll to appear).
    const vh = window.innerHeight;
    const onEnter = (el, start = 'top 90%') =>
      el.getBoundingClientRect().top < vh ? undefined : { trigger: el, start, once: true };

    q('[data-reveal="words"]').forEach((el) => {
      const words = el.querySelectorAll('.rt-inner');
      if (!words.length) return;
      gsap.from(words, {
        yPercent: 115,
        rotate: 3,
        duration: 1.25,
        ease: 'expo.out',
        stagger: 0.055,
        delay: delayOf(el),
        scrollTrigger: onEnter(el),
      });
    });

    q('[data-reveal="fill"]').forEach((el) => {
      const words = el.querySelectorAll('.rt-inner');
      gsap.fromTo(
        words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 48%', scrub: 0.6 },
        }
      );
    });

    q('[data-reveal="up"]').forEach((el) => {
      gsap.from(el, {
        y: 46,
        opacity: 0,
        duration: 1.15,
        ease: 'power3.out',
        clearProps: 'transform',
        delay: delayOf(el),
        scrollTrigger: onEnter(el),
      });
    });

    q('[data-reveal="scale"]').forEach((el) => {
      gsap.from(el, {
        scale: 0.92,
        opacity: 0,
        duration: 1.3,
        ease: 'expo.out',
        clearProps: 'transform',
        delay: delayOf(el),
        scrollTrigger: onEnter(el, 'top 88%'),
      });
    });

    q('[data-reveal="line"]').forEach((el) => {
      gsap.from(el, {
        scaleX: 0,
        transformOrigin: '0% 50%',
        duration: 1.6,
        ease: 'expo.inOut',
        delay: delayOf(el),
        scrollTrigger: onEnter(el, 'top 94%'),
      });
    });

    q('[data-reveal="image"]').forEach((el) => {
      const img = el.querySelector('img');
      const tl = gsap.timeline({
        delay: delayOf(el),
        scrollTrigger: onEnter(el, 'top 88%'),
      });
      tl.fromTo(
        el,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' }
      );
      if (img) tl.from(img, { scale: 1.35, duration: 1.9, ease: 'expo.out' }, 0.1);
    });

    q('[data-reveal-group]').forEach((group) => {
      const items = group.querySelectorAll('[data-reveal-item]');
      if (!items.length) return;
      gsap.from(items, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        clearProps: 'transform',
        stagger: parseFloat(group.dataset.revealStagger || '0.09'),
        scrollTrigger: onEnter(group, 'top 86%'),
      });
    });

    q('[data-parallax]').forEach((el) => {
      const amount = parseFloat(el.dataset.parallax || '10');
      gsap.fromTo(
        el,
        { yPercent: -amount },
        {
          yPercent: amount,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement || el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      q('[data-magnetic]').forEach((el) => {
        const strength = parseFloat(el.dataset.magnetic || '0.35');
        const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
        const move = (e) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * strength);
          yTo((e.clientY - (r.top + r.height / 2)) * strength);
        };
        const leave = () => {
          gsap.to(el, { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, 0.4)' });
        };
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        cleanups.push(() => {
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerleave', leave);
        });
      });
    }
  }, root);

  ScrollTrigger.sort();
  ScrollTrigger.refresh();

  return () => {
    cleanups.forEach((fn) => fn());
    ctx.revert();
  };
}

export { gsap, ScrollTrigger };
