import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../utils/motion';

/**
 * Animates a number from 0 to `target` once `start` becomes true.
 * `decimals` keeps fractional values like 8.63 instead of rounding them.
 */
export function useCountUp(target, start, duration = 1600, decimals = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (prefersReducedMotion()) {
      setValue(target);
      return;
    }
    let frame;
    const startTime = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart: fast start, soft landing
      setValue(Number((eased * target).toFixed(decimals)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, start, duration, decimals]);

  return value;
}
