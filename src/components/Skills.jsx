import { useState } from 'react';
import { useInView } from '../hooks/useInView';
import Reveal from './Reveal';
import SectionHead from './SectionHead';

const SIZE = 600;
const C = SIZE / 2; // centre: the batter
const RADIUS = 236; // every shot reaches the rope

/**
 * Wagon wheel: each skill is a shot from the batter to the boundary,
 * grouped by family around the ground. Pick a family to light its shots up.
 */
export default function Skills({ skills, families, section }) {
  const [family, setFamily] = useState('frontend');
  const [hovered, setHovered] = useState(null);
  const [ref, inView] = useInView({ threshold: 0.3 });

  const step = 360 / skills.length;
  const shots = skills.map((skill, i) => {
    // Start straight down the ground (towards the bowler) and go clockwise.
    const angle = ((i * step - 90 + step / 2) * Math.PI) / 180;
    return {
      ...skill,
      i,
      x: C + Math.cos(angle) * RADIUS,
      y: C + Math.sin(angle) * RADIUS,
      lx: C + Math.cos(angle) * (RADIUS + 16),
      ly: C + Math.sin(angle) * (RADIUS + 16),
      anchor: Math.cos(angle) > 0.2 ? 'start' : Math.cos(angle) < -0.2 ? 'end' : 'middle',
    };
  });

  const inFamily = shots.filter((s) => s.family === family);
  const label = families.find((f) => f.id === family)?.label;
  const focus = hovered !== null ? shots[hovered] : null;

  return (
    <section id="skills" className="section skills">
      <SectionHead
        session={section.session}
        position={section.position}
        title="The wagon wheel,"
        accent="every shot to the rope."
        note={`${skills.length} skills in six families. Pick a family to light up its shots; hover a line to see where it was played.`}
      />

      <div className="skills__layout">
        <div ref={ref} className={`wheel ${inView ? 'is-visible' : ''}`}>
          <svg viewBox={`-40 -10 ${SIZE + 80} ${SIZE + 20}`} role="img" aria-label={`Wagon wheel of ${skills.length} skills. ${label}: ${inFamily.map((s) => s.name).join(', ')}.`}>
            <circle cx={C} cy={C} r={RADIUS + 4} className="wheel__field" />
            <circle cx={C} cy={C} r={RADIUS + 4} className="wheel__rope" />
            <circle cx={C} cy={C} r={RADIUS * 0.55} className="wheel__ring" />
            <rect x={C - 9} y={C - 46} width="18" height="92" rx="2" className="wheel__pitch" />
            {shots.map((s) => {
              const isOn = s.family === family;
              return (
                <g
                  key={s.name}
                  className={`wheel__shot wheel__shot--${s.family} ${isOn ? 'is-on' : ''} ${hovered === s.i ? 'is-hover' : ''}`}
                  style={{ '--i': s.i }}
                  onMouseEnter={() => setHovered(s.i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <line x1={C} y1={C} x2={s.x} y2={s.y} />
                  <line x1={C} y1={C} x2={s.x} y2={s.y} className="wheel__hit" />
                  <circle cx={s.x} cy={s.y} r="4.5" />
                  {(isOn || hovered === s.i) && (
                    <text x={s.lx} y={s.ly} textAnchor={s.anchor} dominantBaseline="middle">
                      {s.name}
                    </text>
                  )}
                </g>
              );
            })}
            <circle cx={C} cy={C} r="8" className="wheel__batter" />
          </svg>
        </div>

        <div className="skills__side">
          <div className="chips" role="group" aria-label="Skill families">
            {families.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`chip chip--${f.id} ${family === f.id ? 'is-active' : ''}`}
                aria-pressed={family === f.id}
                onClick={() => setFamily(f.id)}
              >
                <span className="chip__swatch" aria-hidden="true" />
                {f.label}
              </button>
            ))}
          </div>

          <Reveal className="batting-card">
            <p className="batting-card__title">
              <span>Batting card · {label}</span>
              <span>{inFamily.length} not out</span>
            </p>
            <ul key={family}>
              {inFamily.map((s, i) => (
                <li
                  key={s.name}
                  style={{ '--i': i }}
                  className={hovered === s.i ? 'is-hover' : ''}
                  onMouseEnter={() => setHovered(s.i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <span className="batting-card__name">{s.name}</span>
                  <span className="batting-card__status">not out</span>
                  <span className="batting-card__note">{s.note}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <p className="skills__focus" aria-live="polite">
            {focus ? (
              <>
                <strong>{focus.name}</strong> — {focus.note}
              </>
            ) : (
              'Hover a shot or a row to see the detail.'
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
