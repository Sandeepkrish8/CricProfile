import { useState } from 'react';
import About from './components/About';
import Awards from './components/Awards';
import BallCursor from './components/BallCursor';
import Career from './components/Career';
import Contact from './components/Contact';
import Hero from './components/Hero';
import Nav from './components/Nav';
import Preloader from './components/Preloader';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Stumps from './components/Stumps';
import { useActiveSection } from './hooks/useActiveSection';
import { award, experience, milestones, profile, projects, sections, skillFamilies, skills, stats, ticker } from './data/profile';

// Stable array so the observer in useActiveSection isn't recreated every render.
const SECTION_IDS = ['home', ...sections.map((s) => s.id)];
const byId = Object.fromEntries(sections.map((s) => [s.id, s]));

export default function App() {
  const [started, setStarted] = useState(false);
  const active = useActiveSection(SECTION_IDS);

  return (
    <div className={`app ${started ? 'is-started' : ''}`}>
      <a href="#about" className="skip-link">
        Skip to content
      </a>
      <Preloader initials={profile.initials} onDone={() => setStarted(true)} />
      <BallCursor />
      <Nav profile={profile} sections={sections} active={active} />
      <main>
        <Hero profile={profile} sections={sections} />
        <Stumps label="Play · Morning session" tone="day" />
        <About profile={profile} section={byId.about} />
        <Skills skills={skills} families={skillFamilies} section={byId.skills} />
        <Projects projects={projects} section={byId.projects} />
        <Career milestones={milestones} experience={experience} section={byId.career} />
        <Stumps label="Bad light · Floodlights on" tone="dusk" />
        <Awards award={award} stats={stats} section={byId.awards} />
        <Contact profile={profile} ticker={ticker} section={byId.contact} />
      </main>
    </div>
  );
}
