import Reveal from './Reveal';

/** "Morning session · Cover" eyebrow + heading with an italic accent. */
export default function SectionHead({ session, position, title, accent, note }) {
  return (
    <header className="head">
      <Reveal as="p" className="eyebrow">
        <span>{session}</span>
        <span className="eyebrow__dot" aria-hidden="true" />
        <span>{position}</span>
      </Reveal>
      <Reveal as="h2" className="head__title" delay={0.08}>
        {title} <em>{accent}</em>
      </Reveal>
      {note && (
        <Reveal as="p" className="head__note" delay={0.16}>
          {note}
        </Reveal>
      )}
    </header>
  );
}
