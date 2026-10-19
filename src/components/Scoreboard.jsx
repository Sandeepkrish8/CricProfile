import { useEffect, useState } from 'react';
import { useInView } from '../hooks/useInView';
import { prefersReducedMotion } from '../utils/motion';

/** One number plate. A new `key` remounts the digit, which replays the flip animation. */
function Plate({ value, tone = '' }) {
  return (
    <span className={`plate ${tone}`}>
      <span className="plate__digit" key={value}>
        {value}
      </span>
    </span>
  );
}

/**
 * Plates roll from 0 up to each target digit, one after another,
 * like a scorer hanging new numbers.
 */
function useRollingDigits(target, start) {
  const [digits, setDigits] = useState(() => target.map(() => 0));

  useEffect(() => {
    if (!start) return;
    if (prefersReducedMotion()) {
      setDigits(target);
      return;
    }
    const timer = setInterval(() => {
      setDigits((current) => {
        const index = current.findIndex((d, i) => d !== target[i]);
        if (index === -1) {
          clearInterval(timer);
          return current;
        }
        const next = [...current];
        next[index] += 1;
        return next;
      });
    }, 70);
    return () => clearInterval(timer);
  }, [start, target]);

  return digits;
}

/** Painted board text that flips in letter by letter once visible. */
function Painted({ text, delay = 0 }) {
  return (
    <span className="painted" aria-label={text}>
      {[...text].map((char, i) => (
        <span key={i} aria-hidden="true" style={{ '--d': `${delay + i * 0.035}s` }}>
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </span>
  );
}

const YEAR = [2, 0, 2, 6];

export default function Scoreboard({ profile }) {
  const [ref, inView] = useInView({ threshold: 0.2 });
  const year = useRollingDigits(YEAR, inView);

  return (
    <div ref={ref} className={`board-wrap ${inView ? 'is-visible' : ''}`}>
      <span className="board-wrap__hook" aria-hidden="true" />
      <span className="board-wrap__hook board-wrap__hook--r" aria-hidden="true" />
      <div className="board" role="img" aria-label={`Scoreboard: ${profile.firstName} ${profile.lastName}, ${profile.role}, total 2026 for 0, not out.`}>
        <p className="board__title">Scoreboard · Portfolio XI</p>
        <div className="board__row">
          <span className="board__key">Batter</span>
          <Painted text={profile.shortName.toUpperCase()} delay={0.1} />
          <span className="board__plates">
            <Plate value={0} />
            <Plate value={1} />
          </span>
        </div>
        <div className="board__row">
          <span className="board__key">Role</span>
          <Painted text="FRONTEND DEV" delay={0.4} />
          <span className="board__star">★</span>
        </div>
        <div className="board__row">
          <span className="board__key">Partners</span>
          <Painted text="REACT · TYPESCRIPT" delay={0.7} />
        </div>
        <div className="board__row">
          <span className="board__key">Ground</span>
          <Painted text="CHENNAI" delay={1} />
        </div>
        <div className="board__total">
          <span className="board__key">Total</span>
          <span className="board__plates">
            {year.map((d, i) => (
              <Plate key={i} value={d} />
            ))}
            <Plate value="/" tone="plate--red" />
            <Plate value={0} />
          </span>
        </div>
      </div>
      <p className="board-wrap__stamp">Not out · Available</p>
    </div>
  );
}
