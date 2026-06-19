import { loadlevel } from './levels/loader.js';
import { player, enemies, shards, trees, stones, flowers, fireflies, pulses, floaters, bursts, world, camp, shrine, needed } from './state.js';
import { init as initinput } from './input.js';
import { init as inithud, updatehud } from './hud.js';
import { init as initdialogue, showdialogue } from './dialogue.js';
import { drawframe } from './render.js';
import { update } from './update.js';
import { audio, initaudio } from './audio.js';
import { totallevels, playername } from './config.js';

let canvas, ctx, w, h, dpr = 1;
let last = 0, mode = 'menu';
let camera = { x: 0, y: 0 };
let currentlevel = 1;
let paused = false;

const levels = totallevels || 2;

function resize() {
  dpr = Math.min(devicePixelRatio || 1, 2);
  w = innerWidth; h = innerHeight;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function getprogress() {
  let p = localStorage.getItem('lantern_progress');
  if (!p) return { unlocked: 1 };
  try { return JSON.parse(p); } catch(e) { return { unlocked: 1 }; }
}

function saveprogress(progress) {
  localStorage.setItem('lantern_progress', JSON.stringify(progress));
}

function renderlevellist() {
  const container = document.getElementById('levellist');
  container.innerHTML = '';
  const prog = getprogress();
  for (let i = 1; i <= levels; i++) {
    const btn = document.createElement('button');
    btn.textContent = 'Level ' + i;
    btn.className = 'levelbtn';
    if (i <= prog.unlocked) {
      btn.classList.add('unlocked');
      btn.addEventListener('click', () => { startgame(i); });
    } else {
      btn.classList.add('locked');
      btn.textContent += ' 🔒';
    }
    container.appendChild(btn);
  }
}

function startgame(levelnum) {
  currentlevel = levelnum;
  initaudio();
  if (audio.state === 'suspended') audio.resume();
  loadlevel(levelnum);
  document.getElementById('mainmenu').classList.add('hidden');
  document.getElementById('pausemenu').classList.add('hidden');
  document.getElementById('settingsmenu').classList.add('hidden');
  document.getElementById('endscreen').classList.add('hidden');
  document.getElementById('hud').style.display = 'block';
  paused = false;
  mode = 'play';
  showdialogue([
    ['Mira', 'Axom, the shadows have crossed the old bridge. Your lantern is the last living flame in Vale.'],
    ['Axom', 'Five star shards will wake the shrine. I can feel them calling through the trees.'],
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
    const prog = getprogress();
    if (currentlevel >= prog.unlocked && currentlevel < levels) {
      prog.unlocked = currentlevel + 1;
      saveprogress(prog);
    }
  } else {
    document.getElementById('endtitle').textContent = 'The Lantern Fades';
    document.getElementById('endtext').textContent = 'The shadows carried the last flame into the trees. You gathered ' + player.shards + ' of ' + needed + ' star shards. Try the story again.';
  }
}

function gotomainmenu() {
  mode = 'menu';
  document.getElementById('hud').style.display = 'none';
  document.getElementById('endscreen').classList.add('hidden');
  document.getElementById('pausemenu').classList.add('hidden');
  document.getElementById('settingsmenu').classList.add('hidden');
  document.getElementById('mainmenu').classList.remove('hidden');
  renderlevellist();
}

function togglepause() {
  if (mode !== 'play') return;
  paused = !paused;
  document.getElementById('pausemenu').classList.toggle('hidden', !paused);
}

function loop(t) {
  const dt = Math.min(0.033, (t - last) / 1000 || 0);
  last = t;
  if (mode === 'play' && !paused) {
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
  document.getElementById('pausebtn').addEventListener('click', togglepause);
  document.getElementById('resumebtn').addEventListener('click', togglepause);
  document.getElementById('mainmenufrompause').addEventListener('click', gotomainmenu);
  document.getElementById('settingsfrompause').addEventListener('click', () => {
    document.getElementById('pausemenu').classList.add('hidden');
    document.getElementById('settingsmenu').classList.remove('hidden');
  });
  document.getElementById('closesettings').addEventListener('click', () => {
    document.getElementById('settingsmenu').classList.add('hidden');
    if (mode === 'play') document.getElementById('pausemenu').classList.remove('hidden');
    else document.getElementById('mainmenu').classList.remove('hidden');
  });
  document.getElementById('mainmenufromend').addEventListener('click', gotomainmenu);
  document.getElementById('restartbtn').addEventListener('click', () => {
    if (currentlevel) startgame(currentlevel);
  });
  document.getElementById('resetprogressbtn').addEventListener('click', () => {
    if (confirm('Reset all progress?')) {
      saveprogress({ unlocked: 1 });
      if (mode === 'menu') renderlevellist();
    }
  });
  const volslider = document.getElementById('volslider');
  volslider.addEventListener('input', () => {
    if (audio && audio.master) audio.master.gain.value = volslider.value / 100 * 0.42;
  });
  document.getElementById('mainmenu').classList.remove('hidden');
  renderlevellist();
  loop(0);
}
