import { player } from './state.js';

let hearts, shards, score, glowfill, objective;

export function init() {
  hearts = document.getElementById('hearts');
  shards = document.getElementById('shards');
  score = document.getElementById('score');
  glowfill = document.getElementById('glowfill');
  objective = document.getElementById('objective');
}

export function updatehud() {
  hearts.textContent = '❤'.repeat(Math.max(0, player.hp)) + '♡'.repeat(Math.max(0, player.maxhp - player.hp));
  shards.textContent = '✦ ' + player.shards + '/5';
  score.textContent = 'Score ' + player.score;
  glowfill.style.width = Math.max(0, Math.min(100, player.glow)) + '%';
  objective.textContent = player.shards < 5 ? 'Find the five glowing star shards hidden in Blackwood.' : 'Reach the moon shrine in the northeast and awaken Vale.';
  document.getElementById('action').classList.toggle('cool', player.pulsecd > 0 || player.glow < 22);
}
