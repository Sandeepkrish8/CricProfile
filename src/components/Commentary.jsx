import { useEffect, useRef, useState } from 'react';
import { EVENTS, on } from '../lib/events';
import { prefersReducedMotion } from '../utils/motion';

/** Types `text` out one letter at a time. */
function Typed({ text }) {
  const [shown, setShown] = useState(() => (prefersReducedMotion() ? text.length : 0));
  useEffect(() => {
    if (shown >= text.length) return;
    const timer = setTimeout(() => setShown((n) => n + 1), 18);
    return () => clearTimeout(timer);
  }, [shown, text]);
  return (
    <span className={shown < text.length ? 'is-typing' : ''}>
      {text.slice(0, shown)}
    </span>
  );
}

const overLabel = (n) => `${Math.floor(n / 6)}.${(n % 6) + 1}`;

/**
 * Live ball-by-ball commentary. A line is added the first time each section
 * comes into view, and whenever another component emits a commentary event
 * (a shot in the hero, a ball in the nets). Collapsed it's a small pill
 * showing the latest ball; tap it to open the full feed.
 */
export default function Commentary({ lines }) {
  const [feed, setFeed] = useState([]);
  const [open, setOpen] = useState(false);
  const count = useRef(0);
  const seen = useRef(new Set());

  const add = (line) => {
    const ball = overLabel(count.current);
    count.current += 1;
    setFeed((items) => [{ ...line, ball, id: count.current }, ...items].slice(0, 30));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting && lines[id] && !seen.current.has(id)) {
            seen.current.add(id);
            add({ ...lines[id], href: `#${id}` });
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );
    Object.keys(lines).forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    const off = on(EVENTS.commentary, add);
    return () => {
      observer.disconnect();
      off();
    };
    // `lines` comes from a static data file, so this runs once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!feed.length) return null;
  const latest = feed[0];

  return (
    <aside className={`live ${open ? 'is-open' : ''}`} aria-label="Live commentary">
      {open && (
        <div className="live__panel" id="live-feed">
          <p className="live__head">
            <span>● Live commentary</span>
            <span>Over {latest.ball}</span>
          </p>
          <ol>
            {feed.map((item) => (
              <li key={item.id} className="live__ball">
                <span className="live__over">{item.ball}</span>
                <span className={`live__res live__res--${item.result === '•' ? 'dot' : item.result}`}>{item.result}</span>
                <span className="live__text">
                  {item.href ? <a href={item.href}>{item.title}</a> : <b>{item.title}</b>}
                  <span>{item.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
      <button
        type="button"
        className="live__pill"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="live-feed"
      >
        <span className="live__dot" aria-hidden="true" />
        <span className="live__tag">Live</span>
        <span className={`live__res live__res--${latest.result === '•' ? 'dot' : latest.result}`} aria-hidden="true">
          {latest.result}
        </span>
        <span className="live__latest" key={latest.id} aria-live="polite">
          <Typed text={`${latest.ball} · ${latest.title}`} />
        </span>
      </button>
    </aside>
  );
}
