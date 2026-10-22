import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../../lib/scrollFx';

// Inertia scrolling (Lenis) driven by the GSAP ticker so ScrollTrigger,
// the creeper canvas and native scroll stay in lockstep.
export const SmoothScroll = () => {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      allowNestedScroll: true,
    });
    window.__lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Menus and modals lock the body; pause inertia while they are open
    const syncLock = () => {
      if (document.body.style.overflow === 'hidden') lenis.stop();
      else lenis.start();
    };
    const lockObserver = new MutationObserver(syncLock);
    lockObserver.observe(document.body, { attributes: true, attributeFilter: ['style'] });

    // Re-measure when the document grows (images, pinned sections)
    let refreshTimer = 0;
    const sizeObserver = new ResizeObserver(() => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        lenis.resize();
        ScrollTrigger.refresh();
      }, 200);
    });
    sizeObserver.observe(document.body);

    return () => {
      clearTimeout(refreshTimer);
      lockObserver.disconnect();
      sizeObserver.disconnect();
      gsap.ticker.remove(raf);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return null;
};

export default SmoothScroll;
