export function dist(a, b, c, d) { return Math.hypot(a - c, b - d); }
export function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
export const rand = (() => { let s = 91427; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; } })();
