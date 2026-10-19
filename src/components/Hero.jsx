import Ground from './Ground';
import Icon from './Icon';

export default function Hero({ profile, sections }) {
  return (
    <section id="home" className="hero">
      <div className="hero__copy">
        <p className="eyebrow">
          <span>{profile.role}</span>
          <span className="eyebrow__dot" aria-hidden="true" />
          <span>{profile.stack}</span>
        </p>
        <h1 className="hero__title">
          <span className="hero__line">Pick a gap,</span>
          <em className="hero__line">play your shot.</em>
        </h1>
        <p className="hero__lede">
          I’m <strong>{profile.firstName} {profile.lastName}</strong>, a frontend developer in {profile.location}. This ground is the
          menu: every fielder opens part of my work. Pick one and the ball races there.
        </p>
        <div className="hero__actions">
          <a href="#projects" className="btn btn--dark">
            See the fixtures <Icon name="arrowRight" size={16} />
          </a>
          <a href={profile.resume} className="btn btn--line" download>
            Résumé <Icon name="arrowDown" size={16} />
          </a>
        </div>
      </div>
      <Ground sections={sections} />
    </section>
  );
}
