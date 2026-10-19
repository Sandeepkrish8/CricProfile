import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../utils/motion';

/**
 * The coin toss. The coin spins up and lands on heads, the result is
 * announced, then the two halves of the curtain slide apart.
 */
export default function Preloader({ initials, onDone }) {
  const [stage, setStage] = useState('toss'); // toss → result → leaving → gone
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    if (prefersReducedMotion()) {
      onDoneRef.current();
      setStage('gone');
      return;
    }
    document.documentElement.classList.add('is-locked');
    const timers = [
      setTimeout(() => setStage('result'), 1500),
      setTimeout(() => {
        setStage('leaving');
        document.documentElement.classList.remove('is-locked');
        onDoneRef.current();
      }, 2500),
      setTimeout(() => setStage('gone'), 3600),
    ];
    return () => {
      timers.forEach(clearTimeout);
      document.documentElement.classList.remove('is-locked');
    };
  }, []);

  if (stage === 'gone') return null;

  return (
    <div className={`toss toss--${stage}`} aria-hidden="true">
      <div className="toss__half toss__half--left" />
      <div className="toss__half toss__half--right" />
      <div className="toss__content">
        <div className="coin">
          <span className="coin__face coin__face--heads">{initials}</span>
          <span className="coin__face coin__face--tails">★</span>
        </div>
        <p className="toss__call">Heads it is.</p>
        <p className="toss__result">
          Sandeep won the toss and elected to <em>build.</em>
        </p>
      </div>
    </div>
  );
}
