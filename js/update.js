import { player, enemies, shards, pulses, floaters, bursts, world, camp, shrine, needed } from './state.js';
import { getinput, setaction } from './input.js';
import { tone, noise } from './audio.js';
import { dist, clamp } from './utils.js';
import { showdialogue } from './dialogue.js';
import { playername } from './config.js';

let stepclock = 0;
let alltalk = false;

function soundstep() { tone(105, 0.055, 'sine', 0.025, -20); }
function soundcollect() { tone(660, 0.12, 'sine', 0.12, 220); setTimeout(() => tone(990, 0.18, 'triangle', 0.09, 330), 70); }
function soundhit() { noise(0.18, 0.16, 520); tone(92, 0.18, 'sawtooth', 0.11, -45); }
function soundpulse() { tone(220, 0.18, 'triangle', 0.18, 260); tone(440, 0.32, 'sine', 0.11, 180); noise(0.16, 0.05, 1600); }

function circlehit(x, y, r) {
  if (x - r < 0 || y - r < 0 || x + r > world.w || y + r > world.h) return true;
  for (const t of trees) {
    const rr = t.r * 0.56 + r;
    if (dist(x, y, t.x, t.y) > rr) continue;
    if (y < t.y + t.r * 0.25 && y > t.y - t.r * 0.5) return true;
  }
  for (const s of stones) if (dist(x, y, s.x, s.y) < s.r + r) return true;
  return false;
}

export function update(dt, endgame) {
  player.time += dt;
  player.inv = Math.max(0, player.inv - dt);
  player.pulsecd = Math.max(0, player.pulsecd - dt);
  player.glow = clamp(player.glow + dt * 2.7, 0, 100);

  const inp = getinput();
  const speed = 170;
  player.vx = inp.x * speed;
  player.vy = inp.y * speed;
  if (inp.l > 0.08) {
    player.face = Math.atan2(inp.y, inp.x);
    stepclock -= dt;
    if (stepclock <= 0) { soundstep(); stepclock = 0.32; }
  }
  let nx = player.x + player.vx * dt;
  if (!circlehit(nx, player.y, player.r)) player.x = nx;
  let ny = player.y + player.vy * dt;
  if (!circlehit(player.x, ny, player.r)) player.y = ny;

  for (const e of enemies) {
    e.hit = Math.max(0, e.hit - dt);
    if (e.stun > 0) { e.stun -= dt; continue; }
    e.ang += dt * (0.7 + e.speed / 180);
    let tx = e.homex + Math.cos(e.ang) * 95, ty = e.homey + Math.sin(e.ang * 0.8) * 65;
    const d = dist(e.x, e.y, player.x, player.y);
    if (d < 345) { tx = player.x; ty = player.y; }
    const a = Math.atan2(ty - e.y, tx - e.x);
    const sp = d < 345 ? e.speed * 1.35 : e.speed * 0.55;
    e.x += Math.cos(a) * sp * dt;
    e.y += Math.sin(a) * sp * dt;
    e.x = clamp(e.x, e.r, world.w - e.r);
    e.y = clamp(e.y, e.r, world.h - e.r);
    if (d < e.r + player.r && player.inv <= 0) {
      player.hp--;
      player.inv = 1.15;
      player.glow = Math.max(0, player.glow - 16);
      soundhit();
      const nx = (player.x - e.x) / (d || 1), ny = (player.y - e.y) / (d || 1);
      player.x = clamp(player.x + nx * 70, player.r, world.w - player.r);
      player.y = clamp(player.y + ny * 70, player.r, world.h - player.r);
      if (player.hp <= 0) endgame(false);
    }
  }

  for (const s of shards) {
    if (!s.c && dist(player.x, player.y, s.x, s.y) < 42) {
      s.c = true;
      player.shards++;
      player.score += 125;
      player.glow = clamp(player.glow + 32, 0, 100);
      soundcollect();
      bursts.push({ x: s.x, y: s.y, age: 0, color: '#8ff4ff', n: 26 });
      floaters.push({ x: s.x, y: s.y - 20, text: '+125', age: 0, color: '#9ef3ff' });
      if (player.shards === needed && !alltalk) {
        alltalk = true;
        showdialogue([
          ['Lantern', 'The five stars are whole again. I remember the way to the shrine.'],
          [playername, 'Hold on, little flame. One last path through the dark.']
        ], () => {});
      }
    }
  }

  if (player.shards >= needed && dist(player.x, player.y, shrine.x, shrine.y) < 82) endgame(true);

  for (const p of pulses) p.age += dt;
  pulses = pulses.filter(p => p.age < p.dur);
  for (const f of floaters) f.age += dt;
  floaters = floaters.filter(f => f.age < 1.1);
  for (const b of bursts) b.age += dt;
  bursts = bursts.filter(b => b.age < 0.7);
  for (const f of fireflies) f.a += dt * (0.7 + f.s * 0.015);

  setaction(() => {
    if (player.pulsecd > 0 || player.glow < 22) return;
    player.pulsecd = 1.65;
    player.glow -= 22;
    pulses.push({ x: player.x, y: player.y, age: 0, dur: 0.42, max: 178 });
    bursts.push({ x: player.x, y: player.y, age: 0, color: '#ffe98c', n: 18 });
    soundpulse();
    for (const e of enemies) {
      const d = dist(player.x, player.y, e.x, e.y);
      if (d < 190) {
        e.stun = 1.5; e.hit = 0.35;
        const nx = (e.x - player.x) / (d || 1), ny = (e.y - player.y) / (d || 1);
        e.x += nx * 52; e.y += ny * 52;
        player.score += 8;
        floaters.push({ x: e.x, y: e.y - 30, text: '+8', age: 0, color: '#ffe98c' });
      }
    }
  });
}
