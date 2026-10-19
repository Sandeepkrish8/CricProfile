// Users can ask their OS to reduce motion. We respect that everywhere.
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Tiny deterministic pseudo-random generator, so generated visuals look
// "random" but render the same on every load.
export const seeded = (seed) => {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
};
