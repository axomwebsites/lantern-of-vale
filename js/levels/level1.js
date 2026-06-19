import { world, camp, shrine } from '../state.js';

export default function load() {
  const rand = (() => { let s = 91427; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; } })();
  const enemies = [];
  const shards = [
    { x: 540, y: 1110, c: false }, { x: 880, y: 1330, c: false },
    { x: 980, y: 760, c: false }, { x: 1390, y: 1010, c: false },
    { x: 1650, y: 560, c: false }
  ];
  const homes = [[735, 520], [1110, 985], [1300, 360], [1670, 850], [510, 870], [1820, 480], [1510, 1260]];
  for (let i = 0; i < homes.length; i++) {
    enemies.push({
      x: homes[i][0], y: homes[i][1], homex: homes[i][0], homey: homes[i][1],
      r: 22, speed: 78 + i * 7, ang: rand() * 6.28, stun: 0, hit: 0
    });
  }
  const trees = [], stones = [], flowers = [], fireflies = [];
  for (let i = 0; i < 115; i++) {
    let x = 60 + rand() * (world.w - 120), y = 60 + rand() * (world.h - 120);
    if (Math.hypot(x - camp.x, y - camp.y) < 210 || Math.hypot(x - shrine.x, y - shrine.y) < 180) { i--; continue; }
    trees.push({ x, y, r: 28 + rand() * 30, h: 60 + rand() * 42, t: rand() });
  }
  for (let i = 0; i < 28; i++) stones.push({ x: 80 + rand() * (world.w - 160), y: 90 + rand() * (world.h - 180), r: 10 + rand() * 16, t: rand() });
  for (let i = 0; i < 180; i++) flowers.push({ x: rand() * world.w, y: rand() * world.h, c: rand() });
  for (let i = 0; i < 45; i++) fireflies.push({ x: rand() * world.w, y: rand() * world.h, a: rand() * 6.28, s: rand() * 20 + 12 });

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
