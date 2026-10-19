import { useState } from 'react';
import About from './components/About';
import Awards from './components/Awards';
import BallCursor from './components/BallCursor';
import Career from './components/Career';
import Commentary from './components/Commentary';
import Contact from './components/Contact';
import Fireworks from './components/Fireworks';
import Hero from './components/Hero';
import Nav from './components/Nav';
import Nets from './components/Nets';
import Preloader from './components/Preloader';
import Projects from './components/Projects';
import SkyDial from './components/SkyDial';
import Skills from './components/Skills';
import Stumps from './components/Stumps';
import { useActiveSection } from './hooks/useActiveSection';
import { award, commentary, experience, milestones, profile, projects, sections, skillFamilies, skills, stats, ticker } from './data/profile';

// Stable array so the observer in useActiveSection isn't recreated every render.
const SECTION_IDS = ['home', ...sections.map((s) => s.id)];
const byId = Object.fromEntries(sections.map((s) => [s.id, s]));
// The nets aren't a fielding position, so they live outside the ground menu.
const NETS = { session: 'Under lights', position: 'The nets' };

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
      <Fireworks />
      <SkyDial />
      <Commentary lines={commentary} />
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
        <Nets section={NETS} />
        <Contact profile={profile} ticker={ticker} section={byId.contact} />
      </main>
    </div>
  );
}
