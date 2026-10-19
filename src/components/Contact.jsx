import { useEffect, useRef, useState } from 'react';
import DrsReview from './DrsReview';
import Icon from './Icon';
import Reveal from './Reveal';
import SectionHead from './SectionHead';

/** The broadcast ticker along the bottom of the screen. */
function Ticker({ items, total }) {
  const loop = [...items, ...items];
  return (
    <div className="ticker" aria-hidden="true">
      <span className="ticker__team">● SKR</span>
      <span className="ticker__score">{total}</span>
      <div className="ticker__track">
        <div className="ticker__run">
          {loop.map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Contact({ profile, ticker, section }) {
  const [copied, setCopied] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const reviewButton = useRef(null);

  const closeReview = () => {
    setReviewing(false);
    reviewButton.current?.focus(); // give focus back to the button that opened it
  };

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" className="section contact">
      <SectionHead session={section.session} position={section.position} title="Next match:" accent="your team." />
      <Reveal as="p" className="contact__lede" delay={0.1}>
        Looking for a frontend developer to open the innings? I’m available now — send a message and I’ll take guard.
      </Reveal>
      <Reveal className="contact__email" delay={0.15}>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <button type="button" onClick={copy} aria-label="Copy email address">
          <Icon name={copied ? 'check' : 'copy'} />
        </button>
        <span className={`toast ${copied ? 'is-visible' : ''}`} role="status">
          {copied ? 'Copied ✓' : ''}
        </span>
      </Reveal>
      <Reveal className="contact__links" delay={0.2}>
        <a className="btn btn--gold" href={`mailto:${profile.email}`}>
          Send a review request <Icon name="arrowRight" size={16} />
        </a>
        <button ref={reviewButton} type="button" className="btn btn--line-light" onClick={() => setReviewing(true)}>
          Review the decision · DRS
        </button>
        <a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
        <a href={profile.leetcode} target="_blank" rel="noreferrer">LeetCode ↗</a>
        <a href={profile.resume} download>Résumé ↓</a>
      </Reveal>
      <footer className="footer">
        <span>© {profile.year} {profile.firstName} {profile.lastName}</span>
        <span>Stumps. Built with React &amp; Vite.</span>
      </footer>
      <Ticker items={ticker} total={`${profile.year}/0`} />
      {reviewing && <DrsReview email={profile.email} onClose={closeReview} />}
    </section>
  );
}
