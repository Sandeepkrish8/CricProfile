import Icon from './Icon';
import Reveal from './Reveal';
import Scoreboard from './Scoreboard';
import SectionHead from './SectionHead';

export default function About({ profile, section }) {
  return (
    <section id="about" className="section about">
      <div className="about__copy">
        <SectionHead session={section.session} position={section.position} title={`${profile.firstName} ${profile.lastName},`} accent="not out." />
        <div className="about__player">
          <Reveal className="photo-card">
            <img src={profile.image} alt={`${profile.firstName} ${profile.lastName}`} width="160" height="200" />
            <span className="photo-card__tape" aria-hidden="true" />
            <span className="photo-card__caption">#01 · Opening batter</span>
          </Reveal>
          <div>
            <Reveal as="p" className="lead" delay={0.1}>
              {profile.bio}
            </Reveal>
            <Reveal as="p" className="muted" delay={0.2}>
              {profile.bioExtra}
            </Reveal>
          </div>
        </div>
        <Reveal as="dl" className="facts" delay={0.25}>
          {profile.facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </Reveal>
        <Reveal className="links" delay={0.3}>
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub <Icon name="arrowUpRight" size={14} />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <Icon name="arrowUpRight" size={14} />
          </a>
          <a href={profile.leetcode} target="_blank" rel="noreferrer">
            LeetCode <Icon name="arrowUpRight" size={14} />
          </a>
        </Reveal>
      </div>
      <Scoreboard profile={profile} />
    </section>
  );
}
