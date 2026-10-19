import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../utils/motion';

// Geometry of the 800 × 760 SVG ground.
const W = 800;
const H = 760;
const STRIKER = { x: 400, y: 448 }; // where the bat meets the ball
const SHOT_MS = 750;

/**
 * Point on a quadratic Bézier curve at t (0 → 1).
 * B(t) = (1-t)²·P0 + 2(1-t)t·P1 + t²·P2
 */
const bezier = (p0, p1, p2, t) => ({
  x: (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t ** 2 * p2.x,
  y: (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t ** 2 * p2.y,
});

/** Bend the shot sideways so it curves like a real drive instead of a ruler line. */
const controlPoint = (target) => {
  const mx = (STRIKER.x + target.x) / 2;
  const my = (STRIKER.y + target.y) / 2;
  const dx = target.x - STRIKER.x;
  const dy = target.y - STRIKER.y;
  const len = Math.hypot(dx, dy) || 1;
  const bend = 0.18 * len * (dx >= 0 ? 1 : -1);
  return { x: mx - (dy / len) * bend, y: my + (dx / len) * bend };
};

const pathFor = (target) => {
  const c = controlPoint(target);
  return `M${STRIKER.x} ${STRIKER.y} Q${c.x} ${c.y} ${target.x} ${target.y}`;
};

/**
 * The hero ground. Every fielding position is a link to a section:
 * hover to preview the shot, click to hit the ball there.
 */
export default function Ground({ sections }) {
  const [preview, setPreview] = useState(null);
  const [shot, setShot] = useState(null); // { id, x, y, call }
  const ballRef = useRef(null);
  const shadowRef = useRef(null);
  const frame = useRef(0);
  const timers = useRef([]);

  useEffect(
    () => () => {
      cancelAnimationFrame(frame.current);
      timers.current.forEach(clearTimeout);
    },
    []
  );

  const goTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const playShot = (event, section) => {
    event.preventDefault();
    if (shot) return;
    if (prefersReducedMotion()) {
      goTo(section.id);
      return;
    }

    const target = { x: section.x, y: section.y };
    const control = controlPoint(target);
    const distance = Math.hypot(target.x - STRIKER.x, target.y - STRIKER.y);
    const call = distance > 330 ? 'SIX!' : 'FOUR!';
    setShot({ ...section, call, landed: false });

    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / SHOT_MS, 1);
      const eased = 1 - (1 - t) ** 3;
      const p = bezier(STRIKER, control, target, eased);
      // Lofted shots look bigger mid-flight; the shadow stays on the grass.
      const lift = Math.sin(Math.PI * eased) * (call === 'SIX!' ? 14 : 6);
      ballRef.current.setAttribute('cx', p.x);
      ballRef.current.setAttribute('cy', p.y - lift * 2);
      ballRef.current.setAttribute('r', 8 + lift * 0.45);
      shadowRef.current.setAttribute('cx', p.x + lift);
      shadowRef.current.setAttribute('cy', p.y + 4);
      if (t < 1) {
        frame.current = requestAnimationFrame(tick);
        return;
      }
      setShot((s) => s && { ...s, landed: true });
      timers.current.push(
        setTimeout(() => goTo(section.id), 650),
        setTimeout(() => setShot(null), 1500)
      );
    };
    frame.current = requestAnimationFrame(tick);
  };

  const active = shot || preview;
  const swing = active
    ? (Math.atan2(active.y - STRIKER.y, active.x - STRIKER.x) * 180) / Math.PI + 90
    : -25;

  return (
    <div className="ground">
      <svg className="ground__svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <defs>
          <clipPath id="ground-oval">
            <ellipse cx="400" cy="380" rx="388" ry="368" />
          </clipPath>
          <radialGradient id="ground-sheen" cx="50%" cy="45%" r="60%">
            <stop offset="0" stopColor="#fff" stopOpacity=".12" />
            <stop offset="1" stopColor="#000" stopOpacity=".18" />
          </radialGradient>
        </defs>

        <g clipPath="url(#ground-oval)">
          <rect width={W} height={H} className="ground__grass" />
          {/* Mowing stripes */}
          {Array.from({ length: 7 }, (_, i) => (
            <rect key={i} y={i * 110} width={W} height="55" className="ground__stripe" />
          ))}
          <rect width={W} height={H} fill="url(#ground-sheen)" />
        </g>
        <ellipse cx="400" cy="380" rx="388" ry="368" className="ground__rope" />
        <ellipse cx="400" cy="380" rx="225" ry="210" className="ground__circle" />

        {/* Pitch, creases and stumps */}
        <rect x="383" y="292" width="34" height="176" rx="2" className="ground__pitch" />
        <line x1="374" y1="312" x2="426" y2="312" className="ground__crease" />
        <line x1="374" y1="448" x2="426" y2="448" className="ground__crease" />
        <g className="ground__stumps">
          <rect x="394" y="298" width="12" height="4" />
          <rect x="394" y="458" width="12" height="4" />
        </g>

        {/* Idle delivery: a ball bowled down the pitch on a loop */}
        {!shot && <circle className="ground__delivery" cx="400" cy="312" r="5" />}

        {/* Shot preview */}
        {preview && !shot && <path className="ground__preview" d={pathFor(preview)} />}
        {shot && <path className="ground__trail" d={pathFor(shot)} />}

        {/* Batter: a bat that turns to face the chosen gap */}
        <g transform={`translate(${STRIKER.x} ${STRIKER.y + 6})`}>
          <circle r="11" className="ground__batter" />
          <g className="ground__bat" style={{ transform: `rotate(${swing}deg)` }}>
            <rect x="-4" y="-46" width="8" height="34" rx="3" />
            <rect x="-2" y="-12" width="4" height="10" className="ground__handle" />
          </g>
        </g>

        {/* The ball in flight */}
        <circle ref={shadowRef} className={`ground__shadow ${shot ? 'is-on' : ''}`} cx={STRIKER.x} cy={STRIKER.y} r="7" />
        <circle ref={ballRef} className={`ground__ball ${shot ? 'is-on' : ''}`} cx={STRIKER.x} cy={STRIKER.y} r="8" />
      </svg>

      <nav className="ground__fielders" aria-label="Sections — pick a fielding position">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={`fielder ${shot?.id === section.id ? 'is-target' : ''}`}
            style={{ left: `${(section.x / W) * 100}%`, top: `${(section.y / H) * 100}%` }}
            onMouseEnter={() => setPreview(section)}
            onMouseLeave={() => setPreview(null)}
            onFocus={() => setPreview(section)}
            onBlur={() => setPreview(null)}
            onClick={(event) => playShot(event, section)}
            data-cursor="hit"
          >
            <span className="fielder__label">
              <span className="fielder__position">{section.position}</span>
              <span className="fielder__section">{section.label}</span>
            </span>
            <span className="fielder__dot" aria-hidden="true" />
          </a>
        ))}
      </nav>

      {shot?.landed && (
        <span
          className="ground__call"
          style={{ left: `${(shot.x / W) * 100}%`, top: `${(shot.y / H) * 100}%` }}
          aria-hidden="true"
        >
          {shot.call}
        </span>
      )}
    </div>
  );
}
