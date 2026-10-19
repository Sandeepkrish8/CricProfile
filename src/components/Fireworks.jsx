import { useEffect, useRef } from 'react';
import { EVENTS, on } from '../lib/events';
import { prefersReducedMotion } from '../utils/motion';

const COLORS = ['#ffc23d', '#2ad1ae', '#ff8a7a', '#8fa8ff', '#f7f4ea'];
const GRAVITY = 0.06;

/**
 * One full-screen canvas that draws fireworks wherever someone asks for them
 * (emit(EVENTS.fireworks, { x, y })). The animation loop only runs while
 * sparks are alive, so it costs nothing when idle.
 */
export default function Fireworks() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let sparks = [];
    let frame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      sparks = sparks.filter((s) => s.life > 0);
      for (const s of sparks) {
        s.vx *= 0.985;
        s.vy = s.vy * 0.985 + GRAVITY;
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 1;
        ctx.globalAlpha = Math.min(1, s.life / 40);
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      frame = sparks.length ? requestAnimationFrame(draw) : 0;
    };

    const burst = ({ x, y }) => {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const count = 70;
      for (let i = 0; i < count; i += 1) {
        const angle = (i / count) * Math.PI * 2;
        const speed = 2.2 + Math.random() * 2.6;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 60 + Math.random() * 30,
          size: 1.5 + Math.random() * 1.6,
          color: Math.random() > 0.8 ? '#fff' : color,
        });
      }
      if (!frame) frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    const off = on(EVENTS.fireworks, burst);
    return () => {
      off();
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fireworks" aria-hidden="true" />;
}
