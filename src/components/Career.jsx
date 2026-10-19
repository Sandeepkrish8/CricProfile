import { useState } from 'react';
import { useInView } from '../hooks/useInView';
import Reveal from './Reveal';
import SectionHead from './SectionHead';

const TYPE_LABELS = { education: 'Education', work: 'Work', project: 'Project', award: 'Award' };

/**
 * A Manhattan chart (the bar chart of runs per over on TV), but per year:
 * each block is one milestone, so taller bars mean busier years.
 */
export default function Career({ milestones, experience, section }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const [focus, setFocus] = useState(null);
  const first = Math.min(...milestones.map((m) => m.year));
  const last = Math.max(...milestones.map((m) => m.year));
  const years = Array.from({ length: last - first + 1 }, (_, i) => first + i);
  const byYear = years.map((year) => ({ year, items: milestones.filter((m) => m.year === year) }));
  const max = Math.max(...byYear.map((y) => y.items.length));
  const shown = focus ?? milestones[milestones.length - 1];

  return (
    <section id="career" className="section career">
      <SectionHead
        session={section.session}
        position={section.position}
        title="The Manhattan,"
        accent="year by year."
        note="Each block is one milestone. Hover or tap a block for the detail."
      />

      <div ref={ref} className={`manhattan ${inView ? 'is-visible' : ''}`} style={{ '--tallest': max }}>
        <div className="manhattan__chart">
          {byYear.map(({ year, items }, col) => (
            <div key={year} className="manhattan__col">
              <div className="manhattan__bar">
                {items.length === 0 && <span className="manhattan__dot" title="No milestone — a dot ball" />}
                {items.map((m, i) => (
                  <button
                    type="button"
                    key={m.title}
                    className={`block block--${m.type} ${shown === m ? 'is-focus' : ''}`}
                    style={{ '--d': `${col * 0.12 + i * 0.1}s` }}
                    onMouseEnter={() => setFocus(m)}
                    onFocus={() => setFocus(m)}
                    onClick={() => setFocus(m)}
                    aria-label={`${year}: ${m.title}, ${m.detail}`}
                  >
                    {m.type === 'award' && <span aria-hidden="true">★</span>}
                  </button>
                ))}
              </div>
              <span className="manhattan__year">{year}</span>
            </div>
          ))}
        </div>

        <aside className="manhattan__detail" aria-live="polite">
          <p className={`badge badge--${shown.type}`}>
            {TYPE_LABELS[shown.type]} · {shown.year}
          </p>
          <p className="manhattan__title">{shown.title}</p>
          <p className="manhattan__sub">{shown.detail}</p>
          <ul className="legend">
            {Object.entries(TYPE_LABELS).map(([type, text]) => (
              <li key={type}>
                <span className={`legend__swatch block--${type}`} />
                {text}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <h3 className="fall__title">Fall of years</h3>
      <ol className="fall">
        {experience.map((e, i) => (
          <Reveal as="li" key={e.title} className="fall__item" delay={i * 0.08}>
            <span className="fall__year">{e.year}</span>
            <p className="fall__type">{e.type}</p>
            <h4>{e.title}</h4>
            <p className="fall__org">{e.org}</p>
            <ul>
              {e.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
