import { seeded } from '../utils/motion';

const COLS = 48;
const ROWS = 4;
const SHIRTS = ['#ffc23d', '#2ad1ae', '#ff8a7a', '#8fa8ff', '#f7f4ea', '#e8c7ff'];

/**
 * The stands. When the floodlights come on, a Mexican wave rolls through the
 * crowd: each fan stands and raises their arms a moment after the one to
 * their left (an animation-delay per column, pure CSS).
 */
export default function Crowd() {
  const random = seeded(7);
  const fans = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      fans.push({
        key: `${row}-${col}`,
        x: 12 + col * 25 + (row % 2) * 12,
        y: 40 + row * 22,
        col,
        shirt: SHIRTS[Math.floor(random() * SHIRTS.length)],
      });
    }
  }
  return (
    <svg className="crowd" viewBox="0 0 1220 130" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      {fans.map((f) => (
        <g key={f.key} className="crowd__fan" style={{ '--col': f.col, '--shirt': f.shirt }} transform={`translate(${f.x} ${f.y})`}>
          <g className="crowd__body">
            <line x1="-5" y1="2" x2="-9" y2="-14" className="crowd__arm" />
            <line x1="5" y1="2" x2="9" y2="-14" className="crowd__arm" />
            <rect x="-6" y="0" width="12" height="16" rx="4" className="crowd__shirt" />
            <circle cy="-5" r="5" className="crowd__head" />
          </g>
        </g>
      ))}
    </svg>
  );
}
