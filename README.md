# CricProfile

🏏 A cricket-themed developer portfolio for **Sandeep Krishnan**, Frontend Developer (React · TypeScript).
Navigate a live cricket ground to explore my projects, skills and career — built with React and Vite.

The page plays out like a day of Test cricket: a sunny morning on the ground, lunch on the grass,
an evening sunset, and a floodlit night session.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the build
```

All content (bio, links, skills, projects, milestones, stats) lives in **`src/data/profile.js`**.
Photo: `public/profile.jpg` · Résumé: `public/resume.pdf`.

## The innings

| Session | Section | What happens |
| --- | --- | --- |
| Toss | Preloader | A coin spins up and lands heads; the curtain splits open |
| Morning | Hero — the ground | Every fielder is a link. Hover to preview the shot, click to hit the ball there (Bézier flight path, bat swing, "FOUR!"/"SIX!" call), then scroll to that section |
| Morning | About — scoreboard | A wooden board swings in, letters flip on one by one, number plates roll to 2026/0 |
| Lunch | Skills — wagon wheel | 32 shots drawn from the batter to the rope; family chips light up a family and its batting card |
| Afternoon | Projects — match tickets | Tickets slide in and the stubs snap on; hover to start tearing the stub off |
| Evening | Career — Manhattan | One block per milestone, dropping into place year by year, plus the "fall of years" |
| Under lights | Awards | Floodlights flicker on lamp by lamp; Player of the Match card with a sheen; count-up stats |
| Under lights | Contact | Copy-email button and a scrolling broadcast ticker |

Also: a cricket-ball cursor that spins with your speed, scroll progress shown as **overs** (0.0 → 6.0),
and stumps dividers that get bowled as you scroll past.

No animation libraries — just React hooks, SVG and CSS.

## Accessibility & performance

- Every fielder is a real link with a keyboard focus state; the mobile menu lists them too.
- `prefers-reduced-motion` turns off every animation (shots jump straight to their section).
- Scroll and pointer work runs in `requestAnimationFrame`; the custom cursor is mouse-only.
- Responsive from 320px phones to wide desktops.

## Deploy

Import the repo into **Vercel** or **Netlify** — build command `npm run build`, output `dist`.
