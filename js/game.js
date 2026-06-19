import { loadlevel } from './levels/loader.js';
import { player, enemies, shards, trees, stones, flowers, fireflies, pulses, floaters, bursts, world, camp, shrine, needed } from './state.js';
import { init as initinput } from './input.js';
import { init as inithud, updatehud } from './hud.js';
import { init as initdialogue, showdialogue } from './dialogue.js';
import { drawframe } from './render.js';
import { update } from './update.js';
import { audio, initaudio } from './audio.js';

let canvas, ctx, w, h, dpr = 1;
let last = 0, mode = 'start';
let camera = { x: 0, y: 0 };

function resize() {
  dpr = Math.min(devicePixelRatio || 1, 2);
  w = innerWidth; h = innerHeight;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function startgame() {
  initaudio();
  if (audio.state === 'suspended') audio.resume();
  loadlevel(1);
  document.getElementById('startscreen').classList.add('hidden');
  document.getElementById('endscreen').classList.add('hidden');
  document.getElementById('hud').style.display = 'block';
  showdialogue([
    ['Mira', 'Lio, the shadows have crossed the old bridge. Your lantern is the last living flame in Vale.'],
    ['Lio', 'Five star shards will wake the shrine. I can feel them calling through the trees.'],
    ['Mira', 'If the dark closes in, cast your lantern light. It will push the shadows back, but guard your glow.']
  ], () => { mode = 'play'; });
}

function endgame(win) {
  mode = win ? 'victory' : 'gameover';
  document.getElementById('endscreen').classList.remove('hidden');
  document.getElementById('hud').style.display = 'none';
  if (win) {
    const bonus = Math.max(0, Math.floor(1200 - player.time * 4));
    player.score += bonus;
    document.getElementById('endtitle').textContent = 'Vale Wakes';
    document.getElementById('endtext').textContent = 'The shrine drinks your lantern light and dawn spills through the Blackwood. Final score: ' + player.score + '  Time bonus: ' + bonus + '.';
  } else {
    document.getElementById('endtitle').textContent = 'The Lantern Fades';
    document.getElementById('endtext').textContent = 'The shadows carried the last flame into the trees. You gathered ' + player.shards + ' of ' + needed + ' star shards. Try the story again.';
  }
}

function loop(t) {
  const dt = Math.min(0.033, (t - last) / 1000 || 0);
  last = t;
  if (mode === 'play') {
    update(dt, endgame);
    updatehud();
  }
  drawframe(canvas, ctx, w, h, camera, mode);
  requestAnimationFrame(loop);
}

export function init() {
  canvas = document.getElementById('gamecanvas');
  ctx = canvas.getContext('2d');
  window.addEventListener('resize', resize);
  resize();
  initinput();
  inithud();
  initdialogue();
  document.getElementById('startbtn').addEventListener('click', startgame);
  document.getElementById('restartbtn').addEventListener('click', startgame);
  loop(0);
}
