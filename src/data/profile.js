/**
 * ✏️  ALL CONTENT LIVES HERE.
 * Every section reads from this file — edit text, links, skills and
 * projects without touching the components.
 */

export const profile = {
  firstName: 'Sandeep',
  lastName: 'Krishnan',
  shortName: 'S. Krishnan',
  initials: 'SK',
  role: 'Frontend Developer',
  stack: 'React · TypeScript',
  location: 'Chennai, India',
  bio: 'I build high-performance, strictly-typed interfaces and accessible web apps with React and TypeScript — from NexusHR, a full Employee Management System, to a full-stack movie discovery app and a 3D astronomy dashboard.',
  bioExtra: 'MCA 2025 graduate, trained as a frontend developer at Acciojob, 1st-prize winner at the Acciojob hackathon and published researcher (IRJMETS). Looking for a frontend or product engineering team to open the innings with.',
  image: './profile.jpg',
  resume: './resume.pdf',
  email: 'sandeepskr008@gmail.com',
  github: 'https://github.com/Sandeepkrish8',
  linkedin: 'https://linkedin.com/in/sandeep-krishnan-p',
  leetcode: 'https://leetcode.com/u/Sandeepkr0108/',
  year: '2026',
  facts: [
    { label: 'Based in', value: 'Chennai, India' },
    { label: 'Plays for', value: 'Frontend · React' },
    { label: 'Education', value: 'MCA · CGPA 8.63' },
    { label: 'Status', value: 'Available' },
  ],
};

/**
 * Sections double as fielding positions on the hero ground.
 * x / y are positions in the ground's 800 × 760 SVG (bowler at the top,
 * a right-handed batter at the bottom end, so the off side is on the right).
 */
export const sections = [
  { id: 'about', label: 'About', position: 'Cover', session: 'Morning session', x: 600, y: 330 },
  { id: 'skills', label: 'Skills', position: 'Mid-wicket', session: 'Lunch', x: 175, y: 330 },
  { id: 'projects', label: 'Projects', position: 'Long-off', session: 'Afternoon session', x: 560, y: 95 },
  { id: 'career', label: 'Career', position: 'Point', session: 'Evening session', x: 660, y: 470 },
  { id: 'awards', label: 'Awards', position: 'Long-on', session: 'Under lights', x: 240, y: 95 },
  { id: 'contact', label: 'Contact', position: 'Fine leg', session: 'Under lights', x: 215, y: 630 },
];

export const skillFamilies = [
  { id: 'languages', label: 'Languages' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend & IoT' },
  { id: 'data', label: 'Databases' },
  { id: 'tools', label: 'Tools' },
  { id: 'core', label: 'Core' },
];

export const skills = [
  { name: 'TypeScript', family: 'languages', note: 'Strict mode, typed API layers and props.' },
  { name: 'JavaScript', family: 'languages', note: 'ES6+, async/await, closures, the event loop.' },
  { name: 'HTML5', family: 'languages', note: 'Semantic, accessible markup.' },
  { name: 'CSS3', family: 'languages', note: 'Flexbox, Grid, animations, custom properties.' },
  { name: 'Python', family: 'languages', note: 'The ML side of my sign language research.' },
  { name: 'React', family: 'frontend', note: 'Hooks, custom hooks, component architecture.' },
  { name: 'Redux Toolkit', family: 'frontend', note: 'Slices and global state — used in HabitFlow.' },
  { name: 'Context API', family: 'frontend', note: 'Shared state without prop drilling.' },
  { name: 'React Router', family: 'frontend', note: 'Client-side routing and protected routes.' },
  { name: 'TanStack Query', family: 'frontend', note: 'Caching, cancellation and infinite scroll.' },
  { name: 'Tailwind CSS', family: 'frontend', note: 'Utility-first, token-driven UIs.' },
  { name: 'Vite', family: 'frontend', note: 'Fast dev server and production builds.' },
  { name: 'Three.js', family: 'frontend', note: 'React Three Fiber — the 3D telescope in SkyTonight.' },
  { name: 'GSAP', family: 'frontend', note: 'Timelines and scroll-triggered animation.' },
  { name: 'Node.js', family: 'backend', note: 'TypeScript APIs — the Movie Discovery server.' },
  { name: 'Express', family: 'backend', note: 'Routes, middleware and one error handler.' },
  { name: 'REST APIs', family: 'backend', note: 'Typed clients with loading and error states.' },
  { name: 'Serverless', family: 'backend', note: 'Vercel Functions that keep API keys secret.' },
  { name: 'TensorFlow Lite', family: 'backend', note: 'On-device gesture recognition (TinyML).' },
  { name: 'OpenCV', family: 'backend', note: 'Image processing for the ESP32-CAM pipeline.' },
  { name: 'MongoDB', family: 'data', note: 'Mongoose schemas — the Movie Discovery wishlist.' },
  { name: 'SQL', family: 'data', note: 'Joins and normalisation — NPTEL DBMS.' },
  { name: 'Git', family: 'tools', note: 'Branching, pull requests and reviews.' },
  { name: 'GitHub', family: 'tools', note: 'Repos, PRs and collaboration.' },
  { name: 'Vercel', family: 'tools', note: 'Deploying and hosting every project.' },
  { name: 'Postman', family: 'tools', note: 'Testing and debugging APIs.' },
  { name: 'VS Code', family: 'tools', note: 'Debugging, snippets and extensions.' },
  { name: 'RBAC', family: 'core', note: 'Role-based access for 5 roles in NexusHR.' },
  { name: 'Data Structures', family: 'core', note: 'Arrays, maps, trees, graphs.' },
  { name: 'Algorithms', family: 'core', note: 'Regular LeetCode practice.' },
  { name: 'Responsive Design', family: 'core', note: 'Mobile-first layouts and fluid type.' },
  { name: 'Accessibility', family: 'core', note: 'Semantic HTML, focus states, reduced motion.' },
];

// stub: the label on the ticket's tear-off stub (what the main link opens).
export const projects = [
  {
    title: 'NexusHR',
    kind: 'HR SaaS',
    year: '2026',
    description: 'Employee management with role-based access for 5 corporate roles and an Indian payroll engine (PF, ESI, Professional Tax, TDS), plus a recruitment Kanban and shift scheduling.',
    seats: ['React', 'TypeScript', 'Recharts'],
    link: 'https://github.com/Sandeepkrish8/EMPLOYEE_Sys',
    stub: 'Code',
    color: 'grass',
  },
  {
    title: 'Movie Discovery',
    kind: 'Full stack',
    year: '2026',
    description: 'Search, filters kept in the URL, infinite scroll and a wishlist — on an Express API that caches TMDB, retries with backoff and serves stale data when the upstream is down.',
    seats: ['React', 'Node · Express', 'MongoDB'],
    link: 'https://movie-discovery-tau.vercel.app/',
    code: 'https://github.com/Sandeepkrish8/movie-discovery',
    stub: 'Live',
    color: 'red',
  },
  {
    title: 'SkyTonight',
    kind: '3D · Night game',
    year: '2026',
    description: 'Real-time astronomy dashboard with a 3D telescope view of live planet positions, NASA and ISS data via serverless functions, and an AR mode on mobile.',
    seats: ['React', 'Three.js', 'Vercel'],
    link: 'https://sky-tonight-ten.vercel.app/',
    code: 'https://github.com/Sandeepkrish8/SkyTonight',
    stub: 'Live',
    color: 'ink',
  },
  {
    title: 'HabitFlow',
    kind: 'Productivity',
    year: '2026',
    description: 'A gamified habit tracker with streaks, an SVG Pomodoro timer and progress charts, with state managed in Redux Toolkit.',
    seats: ['React', 'Redux Toolkit', 'Recharts'],
    link: 'https://to-habit-trackerr-git-main-sandeep-krishs-projects.vercel.app/',
    code: 'https://github.com/Sandeepkrish8/To-Habit-Tracker',
    stub: 'Live',
    color: 'gold',
  },
  {
    title: 'SignX',
    kind: 'IoT + ML',
    year: '2025',
    description: 'Real-time sign language recognition on ESP32-CAM: ~85% on-device and ~95% with edge inference. Published in IRJMETS (Vol. 07, Issue 06, June 2025).',
    seats: ['TF Lite', 'OpenCV', 'CNN'],
    link: 'https://www.irjmets.com/upload_newfiles/irjmets70600077672/paper_file/irjmets70600077672.pdf',
    code: 'https://github.com/Sandeepkrish8/SignX-Language-',
    stub: 'Paper',
    color: 'grass',
  },
];

/**
 * Career milestones. The Manhattan chart stacks one block per milestone,
 * so each bar's height is simply how many things happened that year.
 * type: 'education' | 'work' | 'project' | 'award'
 */
export const milestones = [
  { year: 2020, type: 'education', title: 'BCA begins', detail: 'Vel Tech Ranga Sanku Arts and Sciences College' },
  { year: 2023, type: 'education', title: 'BCA completed', detail: 'CGPA 8.0' },
  { year: 2023, type: 'education', title: 'MCA begins', detail: 'Dr. M.G.R. Educational and Research Institute, Chennai' },
  { year: 2024, type: 'work', title: 'Web Development Intern', detail: 'Unified Mentor · May — Jun 2024' },
  { year: 2025, type: 'education', title: 'MCA completed', detail: 'CGPA 8.63' },
  { year: 2025, type: 'award', title: 'SignX research published', detail: 'IRJMETS · Impact Factor 8.187' },
  { year: 2025, type: 'work', title: 'Frontend Developer Course', detail: 'Acciojob' },
  { year: 2025, type: 'award', title: '1st prize · Acciojob Hackathon', detail: 'Player of the match' },
  { year: 2026, type: 'project', title: 'NexusHR', detail: 'HR SaaS · React + TypeScript' },
  { year: 2026, type: 'project', title: 'Movie Discovery', detail: 'Full stack · React + Express' },
  { year: 2026, type: 'project', title: 'SkyTonight', detail: '3D astronomy dashboard' },
  { year: 2026, type: 'project', title: 'HabitFlow', detail: 'Habit tracker · Redux' },
];

// The "fall of years" list under the chart.
export const experience = [
  {
    year: '2025',
    type: 'Training',
    title: 'Frontend Developer Course',
    org: 'Acciojob',
    points: [
      'Hands-on training in semantic HTML, CSS, Bootstrap and modern JavaScript.',
      'Built React apps and graded assignments, reviewed through GitHub.',
      'Won 1st prize at the Acciojob hackathon.',
    ],
  },
  {
    year: '2024',
    type: 'Internship',
    title: 'Web Development Intern',
    org: 'Unified Mentor · May — Jun 2024',
    points: [
      'Built reusable JavaScript components, reducing code duplication by ~30%.',
      'Improved UI responsiveness through CSS and DOM optimisations.',
      'Worked in Git workflows: branches, pull requests and code reviews.',
    ],
  },
  {
    year: '2023',
    type: 'Education',
    title: 'Master of Computer Applications (MCA)',
    org: 'Dr. M.G.R. Educational and Research Institute · 2023 — 2025 · CGPA 8.63',
    points: ['Published research on sign language recognition with ESP32-CAM (IRJMETS).'],
  },
  {
    year: '2020',
    type: 'Education',
    title: 'Bachelor of Computer Applications (BCA)',
    org: 'Vel Tech Ranga Sanku Arts and Sciences College · 2020 — 2023 · CGPA 8.0',
    points: ['Foundations in programming, data structures, databases and the web.'],
  },
];

export const stats = [
  { value: 8.187, decimals: 3, label: 'Impact factor', caption: 'IRJMETS journal' },
  { value: 8.63, decimals: 2, label: 'MCA CGPA', caption: 'Out of 10' },
  { value: 95, prefix: '~', suffix: '%', label: 'SignX accuracy', caption: 'Edge inference' },
  { value: 5, label: 'Projects', caption: 'Built & shipped' },
];

export const award = {
  title: 'Acciojob Hackathon',
  result: '1st',
  caption: 'Player of the match',
};

export const ticker = [
  'Sandeep Krishnan · 2026/0 · not out',
  'Open to frontend roles',
  'React · TypeScript · Node',
  '1st prize · Acciojob hackathon',
  'Published · IRJMETS 2025',
  'Next match: your team',
];
