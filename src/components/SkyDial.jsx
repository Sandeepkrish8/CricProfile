import { useEffect, useRef } from 'react';

// Sky colour at points through the page: morning → evening → night.
const SKY = [
  [0, [255, 241, 201]],
  [0.45, [255, 224, 163]],
  [0.58, [240, 178, 122]],
  [0.68, [90, 59, 94]],
  [0.78, [10, 19, 48]],
  [1, [10, 19, 48]],
];
const SUNSET = 0.74; // after this point the moon takes over
const ARC = { x0: 12, x1: 108, y: 54, h: 40 };

const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

const skyAt = (p) => {
  const i = SKY.findIndex(([stop]) => stop >= p);
  if (i <= 0) return SKY[0][1];
  const [p0, c0] = SKY[i - 1];
  const [p1, c1] = SKY[i];
  return mix(c0, c1, (p - p0) / (p1 - p0));
};

/** Position on the arc for t in 0 → 1 (a simple parabola). */
const arcPoint = (t) => ({
  x: ARC.x0 + (ARC.x1 - ARC.x0) * t,
  y: ARC.y - ARC.h * 4 * t * (1 - t),
});

/**
 * A little sky in the corner: the sun climbs and sets as you scroll the page,
 * then the moon rises, stars come out and the floodlights switch on.
 * Everything is updated by writing SVG attributes directly — no re-renders.
 */
export default function SkyDial() {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    const sky = root.querySelector('.sky__bg');
    const sun = root.querySelector('.sky__sun');
    const moon = root.querySelector('.sky__moon');
    const moonCut = root.querySelector('.sky__moon-cut');
    let frame;

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      const [r, g, b] = skyAt(p);
      sky.setAttribute('fill', `rgb(${r} ${g} ${b})`);
      moonCut.setAttribute('fill', `rgb(${r} ${g} ${b})`); // the crescent is cut out of the sky colour

      const sunPos = arcPoint(Math.min(p / SUNSET, 1));
      sun.setAttribute('transform', `translate(${sunPos.x} ${sunPos.y})`);
      sun.style.opacity = p < SUNSET ? 1 : 0;

      const moonT = Math.max(0, (p - SUNSET) / (1 - SUNSET));
      const moonPos = arcPoint(moonT * 0.5); // the moon only reaches the top
      moon.setAttribute('transform', `translate(${moonPos.x} ${moonPos.y})`);
      moon.style.opacity = p >= SUNSET ? 1 : 0;

      root.classList.toggle('is-night', p >= SUNSET);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div ref={ref} className="sky" aria-hidden="true">
      <svg viewBox="0 0 120 64">
        <defs>
          <clipPath id="sky-clip">
            <rect width="120" height="64" rx="12" />
          </clipPath>
        </defs>
        <g clipPath="url(#sky-clip)">
          <rect className="sky__bg" width="120" height="64" />
          <g className="sky__stars">
            <circle cx="22" cy="14" r="0.9" />
            <circle cx="48" cy="9" r="0.7" />
            <circle cx="80" cy="16" r="0.9" />
            <circle cx="100" cy="8" r="0.7" />
            <circle cx="66" cy="26" r="0.6" />
          </g>
          <g className="sky__lights">
            <circle cx="10" cy="20" r="2" />
            <circle cx="15" cy="20" r="2" />
            <circle cx="105" cy="20" r="2" />
            <circle cx="110" cy="20" r="2" />
          </g>
          <path d={`M${ARC.x0} ${ARC.y} Q60 ${ARC.y - ARC.h * 2} ${ARC.x1} ${ARC.y}`} className="sky__arc" />
          <g className="sky__sun">
            <circle r="9" className="sky__halo" />
            <circle r="5.5" className="sky__disc" />
          </g>
          <g className="sky__moon">
            <circle r="5.5" className="sky__moon-disc" />
            <circle r="5" cx="2.4" cy="-1.6" className="sky__moon-cut" />
          </g>
          <rect y="54" width="120" height="10" className="sky__grass" />
        </g>
      </svg>
    </div>
  );
}
