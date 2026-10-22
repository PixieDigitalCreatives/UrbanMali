import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { CreeperEngine } from './creeper/engine';
import styles from './CreeperCanvas.module.scss';

// Site-wide creeper layer. Vines frame every page and attach to any
// element marked with data-creeper="seam|garland|arch|climb|hang".
export const CreeperCanvas = () => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const engine = new CreeperEngine(canvasRef.current);
    engineRef.current = engine;
    engine.start();
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    // wait a beat for the new route to lay out before reading anchors
    engineRef.current?.scheduleRebuild({ reset: true, key: pathname, delay: 80 });
  }, [pathname]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
};

export default CreeperCanvas;
