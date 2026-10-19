import { useEffect, useState } from 'react';
import Icon from './Icon';

const TOTAL_BALLS = 36; // the whole page is a 6-over innings

/** Turns page scroll into cricket overs: 0.0 → 6.0. */
function useOvers() {
  const [balls, setBalls] = useState(0);
  useEffect(() => {
    let frame;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      setBalls(Math.min(TOTAL_BALLS, Math.round(progress * TOTAL_BALLS)));
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
  return balls;
}

export default function Nav({ profile, sections, active }) {
  const balls = useOvers();
  const over = Math.floor(balls / 6);
  const ball = balls % 6;
  const [open, setOpen] = useState(false);
  const current = sections.find((s) => s.id === active);

  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', open);
    const onKey = (event) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <header className={`nav ${current ? `nav--${current.id}` : ''}`}>
        <a href="#home" className="nav__brand">
          <span className="nav__ball" aria-hidden="true" />
          {profile.shortName}
        </a>

        <nav className="nav__links" aria-label="Primary">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'is-active' : ''} aria-current={active === s.id ? 'true' : undefined}>
              {s.label}
            </a>
          ))}
        </nav>

        <div className="nav__overs" aria-label={`Scroll progress: ${over}.${ball} overs`}>
          <span className="nav__session">{current ? current.session : 'Toss'}</span>
          <span className="nav__count">
            {over}.{ball}
          </span>
          <span className="nav__balls" aria-hidden="true">
            {Array.from({ length: 6 }, (_, i) => (
              <i key={i} className={i < ball || balls === TOTAL_BALLS ? 'is-bowled' : ''} />
            ))}
          </span>
        </div>

        <button
          type="button"
          className="nav__menu-btn"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="field-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <Icon name={open ? 'close' : 'menu'} />
        </button>
      </header>
      <div id="field-menu" className="menu" hidden={!open}>
        <ol>
          {sections.map((s, i) => (
            <li key={s.id} style={{ '--i': i }}>
              <a href={`#${s.id}`} onClick={() => setOpen(false)}>
                <span>{s.position}</span>
                {s.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
