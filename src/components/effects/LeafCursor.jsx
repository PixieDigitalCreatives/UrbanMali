import React, { useEffect, useRef } from 'react';
import styles from './LeafCursor.module.scss';

const INTERACTIVE = 'a, button, [role="button"], label, select, summary, [data-cursor]';
const TEXT_FIELD =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]):not([type="range"]), textarea, [contenteditable="true"]';

// Rest direction of the leaf body (tip at the hotspot, body trailing down-right)
const REST = Math.atan2(1, 1);

// A leaf that hangs from the pointer like a pendulum: the tip is the
// hotspot, the body swings behind fast movement and springs back.
export const LeafCursor = () => {
  const rootRef = useRef(null);
  const leafRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!fine.matches) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const root = rootRef.current;
    const leaf = leafRef.current;
    const label = labelRef.current;
    document.documentElement.classList.add('has-leaf-cursor');

    const s = { x: -100, y: -100, px: -100, py: -100, vx: 0, vy: 0, ang: 0, av: 0, scale: 1, targetScale: 1, press: 1 };
    let raf = 0;
    let shown = false;

    const setMode = (target) => {
      const el = target instanceof Element ? target : null;
      const textField = el?.closest(TEXT_FIELD);
      const interactive = !textField && el?.closest(INTERACTIVE);
      const text = interactive?.closest('[data-cursor]')?.getAttribute('data-cursor') || '';
      root.classList.toggle(styles.isHidden, !!textField);
      root.classList.toggle(styles.isHover, !!interactive);
      root.classList.toggle(styles.hasLabel, !!text);
      if (text && label.textContent !== text) label.textContent = text;
      s.targetScale = interactive ? (text ? 1.25 : 1.55) : 1;
    };

    const onMove = (e) => {
      s.x = e.clientX;
      s.y = e.clientY;
      if (!shown) {
        shown = true;
        s.px = s.x;
        s.py = s.y;
        root.classList.add(styles.isVisible);
      }
    };
    const onOver = (e) => setMode(e.target);
    const onDown = (e) => {
      root.classList.add(styles.isPressed);
      s.press = 0.78;
      if (!reduced) {
        window.dispatchEvent(new CustomEvent('creeper:burst', { detail: { x: e.clientX, y: e.clientY } }));
      }
    };
    const onUp = () => {
      root.classList.remove(styles.isPressed);
      s.press = 1;
    };
    const onLeave = () => {
      shown = false;
      root.classList.remove(styles.isVisible);
    };

    const loop = (t) => {
      raf = requestAnimationFrame(loop);
      s.vx += (s.x - s.px - s.vx) * 0.35;
      s.vy += (s.y - s.py - s.vy) * 0.35;
      s.px = s.x;
      s.py = s.y;

      let target = 0;
      if (!reduced) {
        // body trails opposite to motion, blended with its resting lean
        const bx = Math.cos(REST) - s.vx * 0.075;
        const by = Math.sin(REST) - s.vy * 0.075;
        target = Math.atan2(by, bx) - REST;
        target = Math.max(-1.3, Math.min(1.3, target)) + Math.sin(t * 0.0021) * 0.06;
      }
      s.av = (s.av + (target - s.ang) * 0.12) * 0.8;
      s.ang += s.av;
      s.scale += (s.targetScale * s.press - s.scale) * 0.2;

      root.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
      leaf.style.transform = `rotate(${s.ang}rad) scale(${s.scale})`;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('has-leaf-cursor');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.root} aria-hidden="true">
      <svg ref={leafRef} className={styles.leaf} width="44" height="44" viewBox="0 0 44 44">
        <path className={styles.stem} d="M22 22 C 25 25, 26.5 30.5, 33 32.5" />
        <g transform="translate(22 22) rotate(-135) scale(26)">
          <path
            className={styles.body}
            vectorEffect="non-scaling-stroke"
            d="M0,0 C-0.13,-0.3 0.3,-0.52 0.6,-0.32 C0.82,-0.17 0.95,-0.06 1,0 C0.95,0.06 0.82,0.17 0.6,0.32 C0.3,0.52 -0.13,0.3 0,0 Z"
          />
          <path className={styles.half} d="M0,0 C-0.13,-0.3 0.3,-0.52 0.6,-0.32 C0.82,-0.17 0.95,-0.06 1,0 Z" />
          <path className={styles.rib} vectorEffect="non-scaling-stroke" d="M0.04,0 Q0.5,0.025 0.94,0" />
        </g>
      </svg>
      <span ref={labelRef} className={styles.label} />
    </div>
  );
};

export default LeafCursor;
