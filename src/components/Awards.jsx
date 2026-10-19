import { useCountUp } from '../hooks/useCountUp';
import { useInView } from '../hooks/useInView';
import Icon from './Icon';
import SectionHead from './SectionHead';

function Stat({ item, index, start }) {
  const decimals = item.decimals || 0;
  const value = useCountUp(item.value, start, 1300 + index * 200, decimals);
  return (
    <div className="stat" style={{ '--i': index }}>
      <p className="stat__value">
        {item.prefix}
        {value.toFixed(decimals)}
        {item.suffix}
      </p>
      <p className="stat__label">{item.label}</p>
      <p className="stat__caption">{item.caption}</p>
    </div>
  );
}

/** The floodlights come on (one bank at a time) as this section scrolls in. */
function Floodlight({ side }) {
  return (
    <div className={`flood flood--${side}`} aria-hidden="true">
      <div className="flood__bank">
        {Array.from({ length: 12 }, (_, i) => (
          <i key={i} style={{ '--i': i }} />
        ))}
      </div>
      <span className="flood__pole" />
      <span className="flood__beam" />
    </div>
  );
}

export default function Awards({ award, stats, section }) {
  const [ref, inView] = useInView({ threshold: 0.25 });
  return (
    <section id="awards" ref={ref} className={`section awards ${inView ? 'lights-on' : ''}`}>
      <Floodlight side="left" />
      <Floodlight side="right" />
      <SectionHead session={section.session} position={section.position} title="Lights on," accent="honours board." />

      <div className="potm">
        <div className="potm__shine" aria-hidden="true" />
        <span className="potm__icon">
          <Icon name="trophy" size={34} />
        </span>
        <div>
          <p className="potm__kicker">{award.caption}</p>
          <p className="potm__title">{award.title}</p>
        </div>
        <p className="potm__result">
          {award.result}
          <span>prize</span>
        </p>
      </div>

      <div className="stats">
        {stats.map((item, i) => (
          <Stat key={item.label} item={item} index={i} start={inView} />
        ))}
      </div>
    </section>
  );
}
