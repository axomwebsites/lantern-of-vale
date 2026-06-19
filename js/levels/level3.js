import { world, camp, shrine } from '../state.js';

export default function load() {
  const rand = (() => { let s = 91427; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; } })();
  const enemies = [];
  const shards = [
    { x: 200, y: 1400, c: false }, { x: 1100, y: 200, c: false },
    { x: 600, y: 700, c: false }, { x: 1600, y: 1300, c: false },
    { x: 1900, y: 300, c: false }
  ];
  const homes = [[500, 1100], [1200, 800], [1400, 200], [1700, 600], [400, 900], [2000, 700], [1500, 1400]];
  for (let i = 0; i < homes.length; i++) {
    enemies.push({
      x: homes[i][0], y: homes[i][1], homex: homes[i][0], homey: homes[i][1],
      r: 22, speed: 85 + i * 5, ang: rand() * 6.28, stun: 0, hit: 0
    });
  }
  const trees = [], stones = [], flowers = [], fireflies = [];
  for (let i = 0; i < 120; i++) {
    let x = 60 + rand() * (world.w - 120), y = 60 + rand() * (world.h - 120);
    if (Math.hypot(x - camp.x, y - camp.y) < 180 || Math.hypot(x - shrine.x, y - shrine.y) < 160) { i--; continue; }
    trees.push({ x, y, r: 30 + rand() * 28, h: 65 + rand() * 40, t: rand() });
  }
  for (let i = 0; i < 30; i++) stones.push({ x: 80 + rand() * (world.w - 160), y: 90 + rand() * (world.h - 180), r: 10 + rand() * 18, t: rand() });
  for (let i = 0; i < 200; i++) flowers.push({ x: rand() * world.w, y: rand() * world.h, c: rand() });
  for (let i = 0; i < 50; i++) fireflies.push({ x: rand() * world.w, y: rand() * world.h, a: rand() * 6.28, s: rand() * 22 + 8 });

  import('../state.js').then(module => {
    const pstate = module.player;
    Object.assign(pstate, { x: camp.x, y: camp.y, r: 18, hp: 5, maxhp: 5, glow: 100, score: 0, shards: 0, inv: 0, vx: 0, vy: 0, pulsecd: 0, face: 0, time: 0 });
    const estate = module.enemies;
    estate.length = 0;
    enemies.forEach(e => estate.push(e));
    const sstate = module.shards;
    sstate.length = 0;
    shards.forEach(s => sstate.push(s));
    const tstate = module.trees;
    tstate.length = 0;
    trees.forEach(t => tstate.push(t));
    const ststate = module.stones;
    ststate.length = 0;
    stones.forEach(s => ststate.push(s));
    const fstate = module.flowers;
    fstate.length = 0;
    flowers.forEach(f => fstate.push(f));
    const ffstate = module.fireflies;
    ffstate.length = 0;
    fireflies.forEach(f => ffstate.push(f));
  });
}
