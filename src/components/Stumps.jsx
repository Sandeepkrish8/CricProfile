import { useInView } from '../hooks/useInView';

/**
 * A divider between sessions: when it scrolls into view a ball rolls in,
 * knocks the middle stump and the bails fly.
 */
export default function Stumps({ label, tone = 'day' }) {
  const [ref, inView] = useInView({ threshold: 0.6 });
  return (
    <div ref={ref} className={`stumps stumps--${tone} ${inView ? 'is-bowled' : ''}`}>
      <div className="stumps__set" aria-hidden="true">
        <span className="stumps__ball" />
        <span className="stumps__stump" />
        <span className="stumps__stump stumps__stump--mid" />
        <span className="stumps__stump" />
        <span className="stumps__bail stumps__bail--l" />
        <span className="stumps__bail stumps__bail--r" />
      </div>
      <p className="stumps__label">{label}</p>
    </div>
  );
}
