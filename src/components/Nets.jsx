import { useCallback, useEffect, useRef, useState } from 'react';
import { emit, EVENTS } from '../lib/events';
import { useInView } from '../hooks/useInView';
import SectionHead from './SectionHead';

/*
 * How the game works
 * ------------------
 * A ball takes `duration` ms to travel from the bowler (t = 0) to the batter
 * (t = 1). The timing meter's needle shows t. When you swing, the value of t
 * decides the shot — the gold window is a SIX.
 */
const PITCH_AT = 0.62; // where the ball bounces
const OUTCOMES = [
  // [from t, to t, outcome]
  [0, 0.7, 'miss'],
  [0.7, 0.8, 'edge'],
  [0.8, 0.86, 'four'],
  [0.86, 0.94, 'six'],
  [0.94, 0.98, 'four'],
  [0.98, Infinity, 'bowled'],
];
const RESULTS = {
  miss: { runs: 0, mark: '•', call: 'Played and missed!', line: 'Too early — beaten outside off.' },
  edge: { runs: 1, mark: '1', call: 'Edged… one run', line: 'Thick edge, runs down to third man.' },
  four: { runs: 4, mark: '4', call: 'FOUR!', line: 'Timed along the ground to the rope.' },
  six: { runs: 6, mark: '6', call: 'SIX!', line: 'Right off the middle and out of the ground!' },
  bowled: { runs: 0, mark: 'W', call: 'BOWLED!', line: 'Too late — the stumps are rattled.' },
};
// Where the ball ends up after each shot (SVG 400 × 420).
const EXITS = {
  miss: { x: 300, y: 470 },
  edge: { x: 360, y: 460 },
  four: { x: -60, y: 330 },
  six: { x: 470, y: -60 },
};
const BALLS_PER_OVER = 6;
const STORAGE_KEY = 'cricprofile-best';

const classify = (t) => OUTCOMES.find(([from, to]) => t >= from && t < to)[2];

/** Ball position at time t: travels down the pitch, bouncing at PITCH_AT. */
const ballAt = (t) => {
  const y = 60 + 310 * t;
  const x = 200 + 12 * t;
  const height = t < PITCH_AT ? 34 * (1 - t / PITCH_AT) : Math.sin((Math.PI * (t - PITCH_AT)) / (1 - PITCH_AT)) * 22;
  return { x, y, height, r: 4 + 9 * t };
};

const readBest = () => {
  try {
    return Number(localStorage.getItem(STORAGE_KEY)) || 0;
  } catch {
    return 0;
  }
};

export default function Nets({ section }) {
  const [phase, setPhase] = useState('ready'); // ready → bowling → result → (over)
  const [balls, setBalls] = useState([]);
  const [last, setLast] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [best, setBest] = useState(readBest);
  const [started, setStarted] = useState(false);
  const [batSwung, setBatSwung] = useState(false);
  const [viewRef, inView] = useInView({ threshold: 0.4, once: false });

  const svgRef = useRef(null);
  const ballRef = useRef(null);
  const shadowRef = useRef(null);
  const needleRef = useRef(null);
  const frame = useRef(0);
  const run = useRef(null); // { start, duration, swung }

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const place = (p) => {
    ballRef.current.setAttribute('cx', p.x);
    ballRef.current.setAttribute('cy', p.y - p.height);
    ballRef.current.setAttribute('r', p.r);
    shadowRef.current.setAttribute('cx', p.x);
    shadowRef.current.setAttribute('cy', p.y + p.r * 0.4);
    shadowRef.current.setAttribute('rx', p.r);
    shadowRef.current.setAttribute('opacity', 0.35 - Math.min(p.height, 34) / 150);
  };

  const finish = useCallback((outcome) => {
    const result = RESULTS[outcome];
    setLast(outcome);
    setPhase('result');
    setBalls((prev) => {
      const next = [...prev, outcome];
      if (next.length === BALLS_PER_OVER) {
        const runs = next.reduce((sum, o) => sum + RESULTS[o].runs, 0);
        setBest((b) => {
          const top = Math.max(b, runs);
          try {
            localStorage.setItem(STORAGE_KEY, String(top));
          } catch {
            /* storage blocked: the best score just isn't remembered */
          }
          return top;
        });
      }
      return next;
    });
    emit(EVENTS.commentary, {
      result: result.mark,
      title: `In the nets: ${result.call}`,
      text: result.line,
      href: '#nets',
    });
  }, []);

  /** Fly the ball from where it was hit to its exit point. */
  const playOut = (outcome, from) => {
    const to = EXITS[outcome];
    const start = performance.now();
    const duration = outcome === 'six' ? 700 : 520;
    const step = (now) => {
      const k = Math.min((now - start) / duration, 1);
      const lift = outcome === 'six' ? Math.sin(Math.PI * k) * 60 : 0;
      place({
        x: from.x + (to.x - from.x) * k,
        y: from.y + (to.y - from.y) * k,
        height: lift,
        r: outcome === 'six' ? from.r * (1 - k * 0.6) : from.r,
      });
      if (k < 1) {
        frame.current = requestAnimationFrame(step);
        return;
      }
      finish(outcome);
    };
    frame.current = requestAnimationFrame(step);

    if (outcome === 'six') {
      const rect = svgRef.current.getBoundingClientRect();
      setTimeout(() => emit(EVENTS.fireworks, { x: rect.right - rect.width * 0.15, y: rect.top + rect.height * 0.15 }), 450);
    }
  };

  const bowl = () => {
    if (phase === 'bowling') return;
    setStarted(true);
    if (balls.length === BALLS_PER_OVER) setBalls([]);
    setLast(null);
    setBatSwung(false);
    const duration = 950 + Math.random() * 450;
    setSpeed(Math.round(160 - (duration - 950) / 10)); // quicker delivery → higher km/h
    run.current = { start: performance.now(), duration, swung: false };
    setPhase('bowling');

    const step = (now) => {
      const t = (now - run.current.start) / run.current.duration;
      needleRef.current.style.left = `${Math.min(t, 1) * 100}%`;
      if (run.current.swung) return;
      if (t >= 1) {
        // Never swung: the ball hits the stumps.
        place(ballAt(1));
        run.current.swung = true;
        finish('bowled');
        return;
      }
      place(ballAt(t));
      frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
  };

  const swing = () => {
    const r = run.current;
    if (phase !== 'bowling' || !r || r.swung) return;
    r.swung = true;
    cancelAnimationFrame(frame.current);
    const t = (performance.now() - r.start) / r.duration;
    const outcome = classify(t);
    if (outcome === 'bowled') {
      place(ballAt(1));
      finish('bowled');
    } else {
      playOut(outcome, ballAt(Math.min(t, 1)));
    }
    setBatSwung(true);
  };

  // Space / Enter: bowl the next ball or swing — only once the game has started
  // and the nets are on screen, so the keys never hijack normal page scrolling.
  const swingRef = useRef(swing);
  const bowlRef = useRef(bowl);
  swingRef.current = swing;
  bowlRef.current = bowl;
  useEffect(() => {
    if (!started || !inView) return;
    const onKey = (event) => {
      if (event.key !== ' ' && event.key !== 'Enter') return;
      if (event.target.closest('button, a, input, textarea')) return; // let buttons handle themselves
      event.preventDefault();
      if (phase === 'bowling') swingRef.current();
      else bowlRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [started, inView, phase]);

  const runs = balls.reduce((sum, o) => sum + RESULTS[o].runs, 0);
  const sixes = balls.filter((o) => o === 'six').length;
  const overDone = balls.length === BALLS_PER_OVER;
  const showCall = phase === 'result' && last;
  const stumpsHit = phase === 'result' && last === 'bowled';

  return (
    <section id="nets" ref={viewRef} className="section nets">
      <SectionHead
        session={section.session}
        position={section.position}
        title="Face an over,"
        accent="hit a six."
        note="A timing game. Press Bowl, then swing (Space, Enter or tap the pitch) when the needle hits the gold window. Six balls an over."
      />

      <div className="nets__layout">
        <div className={`nets__stage ${phase === 'bowling' ? 'is-live' : ''}`}>
          <svg
            ref={svgRef}
            viewBox="0 0 400 420"
            className="nets__svg"
            onPointerDown={phase === 'bowling' ? swing : undefined}
            role="img"
            aria-label="The nets: a ball is bowled towards you"
          >
            <rect width="400" height="420" className="nets__bg" />
            {/* Net mesh */}
            <g className="nets__mesh">
              {Array.from({ length: 11 }, (_, i) => (
                <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="420" />
              ))}
              {Array.from({ length: 11 }, (_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 40} x2="400" y2={i * 40} />
              ))}
            </g>
            <path d="M175 40 L225 40 L330 420 L70 420Z" className="nets__pitch" />
            <line x1="168" y1="70" x2="232" y2="70" className="nets__crease" />
            <line x1="90" y1="370" x2="310" y2="370" className="nets__crease" />
            <g className={`nets__stumps ${stumpsHit ? 'is-hit' : ''}`}>
              <rect x="196" y="320" width="7" height="62" className="nets__stump nets__stump--l" />
              <rect x="208" y="320" width="7" height="62" className="nets__stump" />
              <rect x="220" y="320" width="7" height="62" className="nets__stump nets__stump--r" />
              <rect x="195" y="315" width="16" height="5" rx="2" className="nets__bail nets__bail--l" />
              <rect x="212" y="315" width="16" height="5" rx="2" className="nets__bail nets__bail--r" />
            </g>
            <ellipse ref={shadowRef} cx="200" cy="60" rx="4" ry="2" className="nets__shadow" opacity="0" />
            <circle ref={ballRef} cx="200" cy="60" r="0" className="nets__ball" />
            <g className={`nets__bat ${batSwung ? 'is-swing' : ''}`}>
              <rect x="140" y="250" width="16" height="110" rx="6" />
              <rect x="144" y="230" width="8" height="24" rx="3" className="nets__grip" />
            </g>
          </svg>

          <div className="nets__board" aria-live="polite">
            <span>
              {runs}/{balls.filter((o) => o === 'bowled').length}
            </span>
            <span>
              Ball {Math.min(balls.length + (phase === 'bowling' ? 1 : 0), BALLS_PER_OVER)}/{BALLS_PER_OVER}
            </span>
            {speed && <span>{speed} km/h</span>}
          </div>

          {showCall && (
            <p className={`nets__call nets__call--${last}`} key={balls.length}>
              {RESULTS[last].call}
            </p>
          )}

          <div className="nets__meter" aria-hidden="true">
            <i className="nets__zone nets__zone--ok" />
            <i className="nets__zone nets__zone--six" />
            <i className="nets__needle" ref={needleRef} />
          </div>
        </div>

        <div className="nets__side">
          <ol className="nets__over" aria-label="This over">
            {Array.from({ length: BALLS_PER_OVER }, (_, i) => {
              const o = balls[i];
              return (
                <li key={i} className={o ? `is-${o}` : ''}>
                  {o ? RESULTS[o].mark : ''}
                </li>
              );
            })}
          </ol>
          <dl className="nets__stats">
            <div>
              <dt>Runs</dt>
              <dd>{runs}</dd>
            </div>
            <div>
              <dt>Sixes</dt>
              <dd>{sixes}</dd>
            </div>
            <div>
              <dt>Best over</dt>
              <dd>{best}</dd>
            </div>
          </dl>
          {overDone && (
            <p className="nets__summary">
              Over complete: <strong>{runs} runs</strong>
              {runs >= best && runs > 0 ? ' — a new best!' : '.'}
            </p>
          )}
          <div className="nets__buttons">
            <button type="button" className="btn btn--gold" onClick={bowl} disabled={phase === 'bowling'}>
              {overDone ? 'New over' : started ? 'Bowl next ball' : 'Bowl'}
            </button>
            <button type="button" className="btn btn--line-light" onClick={swing} disabled={phase !== 'bowling'}>
              Swing!
            </button>
          </div>
          <p className="nets__hint">Tip: wait for the bounce. The gold window is right before the ball reaches the bat.</p>
        </div>
      </div>
    </section>
  );
}
