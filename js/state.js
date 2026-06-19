export const world = { w: 2200, h: 1600 };
export const camp = { x: 255, y: 1325 };
export const shrine = { x: 1880, y: 235, r: 62 };
export const needed = 5;

export let player = {};
export let enemies = [];
export let shards = [];
export let trees = [];
export let stones = [];
export let flowers = [];
export let fireflies = [];
export let pulses = [];
export let floaters = [];
export let bursts = [];

export function resetstate() {
  player = {
    x: camp.x, y: camp.y, r: 18, hp: 5, maxhp: 5,
    glow: 100, score: 0, shards: 0, inv: 0,
    vx: 0, vy: 0, pulsecd: 0, face: 0, time: 0
  };
  enemies = [];
  shards = [];
  trees = [];
  stones = [];
  flowers = [];
  fireflies = [];
  pulses = [];
  floaters = [];
  bursts = [];
}
