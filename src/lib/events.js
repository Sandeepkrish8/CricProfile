/**
 * A tiny event bus on top of window CustomEvents, so far-apart components
 * can talk without prop drilling: the hero shot can tell the commentary
 * panel what happened, and anything can ask for fireworks.
 */
export const emit = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }));

export const on = (name, handler) => {
  const listener = (event) => handler(event.detail);
  window.addEventListener(name, listener);
  return () => window.removeEventListener(name, listener);
};

export const EVENTS = {
  commentary: 'cric:commentary', // { result, title, text, href }
  fireworks: 'cric:fireworks', // { x, y } in viewport pixels
};
