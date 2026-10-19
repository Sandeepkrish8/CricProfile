import Icon from './Icon';
import Reveal from './Reveal';
import SectionHead from './SectionHead';

/** Barcode bars generated from the project name, so every ticket is different. */
function Barcode({ seed }) {
  let x = 0;
  const bars = [...seed.toUpperCase()].flatMap((char) => {
    const code = char.charCodeAt(0);
    return [1 + (code % 3), 1 + ((code >> 2) % 2)].map((w, i) => {
      const bar = { x, w, on: i === 0 };
      x += w + 1;
      return bar;
    });
  });
  return (
    <svg className="ticket__barcode" viewBox={`0 0 ${x} 20`} preserveAspectRatio="none" aria-hidden="true">
      {bars.filter((b) => b.on).map((b) => (
        <rect key={b.x} x={b.x} width={b.w} height="20" />
      ))}
    </svg>
  );
}

const SEAT_LABELS = ['Gate', 'Stand', 'Seat'];

/** Projects as match tickets. Hover a ticket and its stub starts to tear off. */
export default function Projects({ projects, section }) {
  return (
    <section id="projects" className="section projects">
      <SectionHead
        session={section.session}
        position={section.position}
        title={`${projects.length} fixtures,`}
        accent="all sold out."
        note="Every project is a match ticket. Tear off the stub to open the live app, code or paper."
      />
      <div className="tickets">
        {projects.map((p, i) => (
          <Reveal as="article" key={p.title} className={`ticket ticket--${p.color} ${i === 0 ? 'ticket--wide' : ''}`} delay={i * 0.08}>
            <div className="ticket__main">
              <p className="ticket__band">
                <span>
                  Fixture {String(i + 1).padStart(2, '0')} · {p.year}
                </span>
                <span>{p.kind}</span>
              </p>
              <h3 className="ticket__title">{p.title}</h3>
              <p className="ticket__desc">{p.description}</p>
              <dl className="ticket__seats">
                {p.seats.map((seat, s) => (
                  <div key={seat}>
                    <dt>{SEAT_LABELS[s]}</dt>
                    <dd>{seat}</dd>
                  </div>
                ))}
              </dl>
              {p.code && (
                <a className="ticket__code" href={p.code} target="_blank" rel="noreferrer">
                  Source code <Icon name="arrowUpRight" size={14} />
                </a>
              )}
            </div>
            <a className="ticket__stub" href={p.link} target="_blank" rel="noreferrer" aria-label={`${p.stub}: ${p.title}`} data-cursor="hit">
              <span className="ticket__admit">Admit one</span>
              <span className="ticket__stub-label">{p.stub}</span>
              <Barcode seed={p.title} />
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
