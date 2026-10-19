import { useEffect, useRef, useState } from 'react';

/**
 * A cricket ball that follows the pointer and spins with how fast you move.
 * Grows over links. Mouse / trackpad only — never on touch screens.
 */
export default function BallCursor() {
  const [enabled, setEnabled] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(fine && !reduce);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    document.documentElement.classList.add('has-ball-cursor');
    let x = -100;
    let y = -100;
    let bx = x;
    let by = y;
    let spin = 0;
    let frame;

    const move = (event) => {
      x = event.clientX;
      y = event.clientY;
    };
    const over = (event) => {
      el.classList.toggle('is-hover', Boolean(event.target.closest('a, button, [data-cursor]')));
    };
    const loop = () => {
      const dx = x - bx;
      bx += dx * 0.25;
      by += (y - by) * 0.25;
      spin += dx * 0.9; // horizontal speed turns into spin
      el.style.transform = `translate3d(${bx}px, ${by}px, 0) rotate(${spin}deg)`;
      frame = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', move);
    document.addEventListener('pointerover', over);
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.classList.remove('has-ball-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={ref} className="ball-cursor" aria-hidden="true">
      <span className="ball-cursor__ball" />
    </div>
  );
}
