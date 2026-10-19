import { useEffect, useRef, useState } from 'react';
import { emit, EVENTS } from '../lib/events';
import { prefersReducedMotion } from '../utils/motion';

// Ball-tracking points on the perspective pitch (viewBox 400 × 480):
// release → pitching → impact → stumps.
const TRACK = [
  { x: 203, y: 64, r: 4 },
  { x: 202, y: 112, r: 5 },
  { x: 200, y: 168, r: 6 },
  { x: 199, y: 228, r: 7 },
  { x: 198, y: 292, r: 8 },
];
const PITCHING = TRACK[TRACK.length - 1];
const IMPACT = { x: 200, y: 352 };
const STUMPS = { x: 202, y: 408 };

const HUD = [
  ['Pitching', 'In line'],
  ['Impact', 'In line'],
  ['Wickets', 'Hitting'],
];

// tracking → projection → verdict
const TIMELINE = [
  ['projection', 1700],
  ['verdict', 3600],
];

/**
 * "Should you hire Sandeep?" — a DRS ball-tracking replay that ends with the
 * third umpire's verdict. Opens as a modal dialog from the Contact section.
 */
export default function DrsReview({ email, onClose }) {
  const [stage, setStage] = useState(() => (prefersReducedMotion() ? 'verdict' : 'tracking'));
  const closeRef = useRef(null);
  const verdictRef = useRef(null);
  const timers = useRef([]);
  // Keep the latest onClose without restarting the replay when the parent re-renders.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const play = () => {
    timers.current.forEach(clearTimeout);
    timers.current = TIMELINE.map(([next, ms]) => setTimeout(() => setStage(next), ms));
  };

  useEffect(() => {
    closeRef.current?.focus();
    if (!prefersReducedMotion()) play();
    const onKey = (event) => event.key === 'Escape' && onCloseRef.current();
    window.addEventListener('keydown', onKey);
    document.documentElement.classList.add('is-locked');
    return () => {
      timers.current.forEach(clearTimeout);
      window.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('is-locked');
    };
  }, []);

  // Celebrate the decision.
  useEffect(() => {
    if (stage !== 'verdict' || !verdictRef.current) return;
    const rect = verdictRef.current.getBoundingClientRect();
    const timers = [0, 250, 500].map((ms, i) =>
      setTimeout(() => emit(EVENTS.fireworks, { x: rect.left + rect.width * (0.2 + i * 0.3), y: rect.top - 20 }), ms)
    );
    emit(EVENTS.commentary, {
      result: 'W',
      title: 'OUT! Decision: hire Sandeep',
      text: 'Ball tracking shows it hitting middle stump. The third umpire has seen enough.',
    });
    return () => timers.forEach(clearTimeout);
  }, [stage]);

  const replay = () => {
    setStage('tracking');
    play();
  };

  const shown = stage === 'tracking' ? 1 : HUD.length;

  return (
    <div className="drs" role="dialog" aria-modal="true" aria-labelledby="drs-title" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`drs__screen drs--${stage}`}>
        <p className="drs__top">
          <span>● Third umpire review</span>
          <button ref={closeRef} type="button" className="drs__close" onClick={onClose} aria-label="Close review">
            ✕
          </button>
        </p>
        <h2 id="drs-title" className="drs__question">
          Should you hire <em>Sandeep?</em>
        </h2>

        <div className="drs__stage">
          <svg viewBox="0 0 400 480" className="drs__pitch" aria-hidden="true">
            <defs>
              <linearGradient id="drs-pitch" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#b9965d" />
                <stop offset="1" stopColor="#d6b57c" />
              </linearGradient>
            </defs>
            <path d="M160 40 L240 40 L360 480 L40 480Z" fill="url(#drs-pitch)" />
            <line x1="150" y1="84" x2="250" y2="84" className="drs__crease" />
            <line x1="80" y1="400" x2="320" y2="400" className="drs__crease" />
            <rect x="150" y="300" width="100" height="120" className="drs__zone" />

            {/* 1 · tracking dots appear one by one */}
            {TRACK.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={p.r} className="drs__dot" style={{ '--i': i }} />
            ))}
            <circle cx={PITCHING.x} cy={PITCHING.y} r="16" className="drs__ring" />

            {/* 2 · the path so far (red) and the projection (blue) */}
            <path d={`M${TRACK[0].x} ${TRACK[0].y} L${PITCHING.x} ${PITCHING.y} L${IMPACT.x} ${IMPACT.y}`} className="drs__path" />
            <path d={`M${IMPACT.x} ${IMPACT.y} L${STUMPS.x} ${STUMPS.y}`} className="drs__projection" />

            <g className="drs__stumps">
              <rect x="186" y="380" width="8" height="70" />
              <rect x="198" y="380" width="8" height="70" />
              <rect x="210" y="380" width="8" height="70" />
              <rect x="182" y="374" width="40" height="8" className="drs__bails" />
            </g>
          </svg>

          <ul className="drs__hud" aria-live="polite">
            {HUD.slice(0, shown).map(([label, value], i) => (
              <li key={label} style={{ '--i': i }} className={label === 'Wickets' ? 'is-red' : ''}>
                <span>{label}</span>
                <b>{value}</b>
              </li>
            ))}
          </ul>

          {stage === 'verdict' && (
            <div className="drs__verdict" ref={verdictRef}>
              <p className="drs__out">Out!</p>
              <p className="drs__decision">Decision: hire Sandeep</p>
            </div>
          )}
        </div>

        <div className="drs__actions">
          {stage === 'verdict' ? (
            <>
              <a className="btn btn--gold" href={`mailto:${email}`}>
                Send the offer ✉
              </a>
              <button type="button" className="drs__replay" onClick={replay}>
                Watch the replay again
              </button>
            </>
          ) : (
            <p className="drs__status">{stage === 'tracking' ? 'Checking where it pitched…' : 'Projecting the path to the stumps…'}</p>
          )}
        </div>
      </div>
    </div>
  );
}
