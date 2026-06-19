import { world, camp, shrine } from '../state.js';

export default function load() {
  const rand = (() => { let s = 91427; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; } })();
  const enemies = [];
  const shards = [
    { x: 320, y: 1200, c: false }, { x: 1020, y: 1400, c: false },
    { x: 750, y: 600, c: false }, { x: 1500, y: 900, c: false },
    { x: 1800, y: 480, c: false }
  ];
  const homes = [[600, 400], [1150, 950], [1350, 280], [1720, 780], [480, 950], [1900, 520], [1450, 1300]];
  for (let i = 0; i < homes.length; i++) {
    enemies.push({
      x: homes[i][0], y: homes[i][1], homex: homes[i][0], homey: homes[i][1],
      r: 22, speed: 80 + i * 6, ang: rand() * 6.28, stun: 0, hit: 0
    });
  }
  const trees = [], stones = [], flowers = [], fireflies = [];
  for (let i = 0; i < 110; i++) {
    let x = 60 + rand() * (world.w - 120), y = 60 + rand() * (world.h - 120);
    if (Math.hypot(x - camp.x, y - camp.y) < 200 || Math.hypot(x - shrine.x, y - shrine.y) < 170) { i--; continue; }
    trees.push({ x, y, r: 25 + rand() * 32, h: 55 + rand() * 45, t: rand() });
  }
  for (let i = 0; i < 25; i++) stones.push({ x: 80 + rand() * (world.w - 160), y: 90 + rand() * (world.h - 180), r: 12 + rand() * 14, t: rand() });
  for (let i = 0; i < 170; i++) flowers.push({ x: rand() * world.w, y: rand() * world.h, c: rand() });
  for (let i = 0; i < 40; i++) fireflies.push({ x: rand() * world.w, y: rand() * world.h, a: rand() * 6.28, s: rand() * 18 + 10 });

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
