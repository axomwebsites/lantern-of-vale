import { player, enemies, shards, trees, stones, flowers, fireflies, pulses, floaters, bursts, world, camp, shrine } from './state.js';

export function drawframe(canvas, ctx, w, h, camera, mode) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const time = performance.now() / 1000;
  const sx = 0, sy = 0;
  ctx.save();
  ctx.translate(-camera.x + sx, -camera.y + sy);

  const g = ctx.createLinearGradient(0, 0, world.w, world.h);
  g.addColorStop(0, '#183b31');
  g.addColorStop(0.55, '#102b26');
  g.addColorStop(1, '#071a19');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, world.w, world.h);
  ctx.strokeStyle = 'rgba(179,123,70,.34)';
  ctx.lineWidth = 62;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(camp.x, camp.y);
  ctx.bezierCurveTo(520, 1230, 650, 1080, 840, 1005);
  ctx.bezierCurveTo(1080, 910, 1220, 690, 1420, 590);
  ctx.bezierCurveTo(1620, 490, 1720, 370, shrine.x, shrine.y);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,225,146,.1)';
  ctx.lineWidth = 22;
  ctx.stroke();
  ctx.strokeStyle = 'rgba(77,179,196,.38)';
  ctx.lineWidth = 44;
  ctx.beginPath();
  ctx.moveTo(0, 430);
  ctx.bezierCurveTo(330, 510, 515, 350, 780, 420);
  ctx.bezierCurveTo(1030, 490, 1260, 405, 1540, 390);
  ctx.bezierCurveTo(1830, 374, 1990, 460, 2200, 430);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(188,251,255,.16)';
  ctx.lineWidth = 8;
  ctx.stroke();

  for (const f of flowers) {
    ctx.fillStyle = f.c < 0.33 ? 'rgba(255,226,128,.42)' : f.c < 0.66 ? 'rgba(126,255,199,.36)' : 'rgba(142,210,255,.34)';
    ctx.beginPath();
    ctx.arc(f.x, f.y, 1.5 + f.c * 1.8, 0, 6.283);
    ctx.fill();
  }

  function drawlight(x, y, r, color, a) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const gr = ctx.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, color.replace('ALPHA', a));
    gr.addColorStop(0.35, color.replace('ALPHA', a * 0.35));
    gr.addColorStop(1, color.replace('ALPHA', 0));
    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 6.283);
    ctx.fill();
    ctx.restore();
  }

  function drawtree(t) {
    ctx.save();
    ctx.translate(t.x, t.y);
    ctx.fillStyle = 'rgba(0,0,0,.28)';
    ctx.beginPath();
    ctx.ellipse(0, t.r * 0.45, t.r * 0.75, t.r * 0.26, 0, 0, 6.283);
    ctx.fill();
    ctx.fillStyle = '#5b3827';
    ctx.fillRect(-t.r * 0.13, -t.r * 0.12, t.r * 0.26, t.r * 0.63);
    const gr = ctx.createRadialGradient(-t.r * 0.2, -t.r * 0.55, t.r * 0.08, 0, -t.r * 0.5, t.r * 1.06);
    gr.addColorStop(0, t.t > 0.5 ? '#438c5e' : '#3d7f58');
    gr.addColorStop(1, t.t > 0.5 ? '#123b2e' : '#0d3128');
    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.arc(0, -t.r * 0.5, t.r * 0.72, 0, 6.283);
    ctx.arc(-t.r * 0.42, -t.r * 0.25, t.r * 0.52, 0, 6.283);
    ctx.arc(t.r * 0.42, -t.r * 0.22, t.r * 0.5, 0, 6.283);
    ctx.arc(0, -t.r * 0.88, t.r * 0.48, 0, 6.283);
    ctx.fill();
    ctx.restore();
  }

  function drawstone(s) {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.fillStyle = 'rgba(0,0,0,.22)';
    ctx.beginPath();
    ctx.ellipse(2, 6, s.r * 1.1, s.r * 0.45, 0, 0, 6.283);
    ctx.fill();
    const gr = ctx.createLinearGradient(-s.r, -s.r, s.r, s.r);
    gr.addColorStop(0, '#8da09a');
    gr.addColorStop(1, '#344743');
    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.ellipse(0, 0, s.r * 1.1, s.r * 0.82, s.t, 0, 6.283);
    ctx.fill();
    ctx.restore();
  }

  function drawshard(s, time) {
    if (s.c) return;
    const bob = Math.sin(time * 3 + s.x) * 7;
    drawlight(s.x, s.y + bob, 86, 'rgba(90,238,255,ALPHA)', 0.35);
    ctx.save();
    ctx.translate(s.x, s.y + bob);
    ctx.rotate(time * 1.6 + s.x);
    const gr = ctx.createLinearGradient(0, -24, 0, 24);
    gr.addColorStop(0, '#ffffff');
    gr.addColorStop(0.45, '#7ff3ff');
    gr.addColorStop(1, '#2e8dff');
    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.moveTo(0, -28);
    ctx.lineTo(16, -5);
    ctx.lineTo(6, 26);
    ctx.lineTo(-14, 10);
    ctx.lineTo(-11, -14);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.8)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  drawlight(shrine.x, shrine.y, player.shards >= 5 ? 220 : 120, player.shards >= 5 ? 'rgba(119,255,211,ALPHA)' : 'rgba(120,160,180,ALPHA)', player.shards >= 5 ? 0.34 : 0.13);
  ctx.save();
  ctx.translate(shrine.x, shrine.y);
  ctx.fillStyle = 'rgba(0,0,0,.32)';
  ctx.beginPath();
  ctx.ellipse(0, 40, 88, 30, 0, 0, 6.283);
  ctx.fill();
  ctx.fillStyle = '#405650';
  ctx.fillRect(-74, -20, 148, 48);
  ctx.fillStyle = '#223831';
  ctx.fillRect(-54, -55, 28, 70);
  ctx.fillRect(26, -55, 28, 70);
  ctx.fillStyle = '#7c918b';
  ctx.beginPath();
  ctx.moveTo(-88, -55);
  ctx.lineTo(0, -118);
  ctx.lineTo(88, -55);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = player.shards >= 5 ? 'rgba(153,255,218,.9)' : 'rgba(190,210,205,.25)';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, -42, 24, 0, 6.283);
  ctx.stroke();
  if (player.shards >= 5) {
    ctx.rotate(Math.sin(time * 2) * 0.05);
    ctx.strokeStyle = 'rgba(255,250,177,.75)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
      const a = i * 1.256 + time * 0.8;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 34, -42 + Math.sin(a) * 34);
      ctx.lineTo(Math.cos(a) * 52, -42 + Math.sin(a) * 52);
      ctx.stroke();
    }
  }
  ctx.restore();

  ctx.save();
  ctx.translate(camp.x, camp.y);
  ctx.fillStyle = 'rgba(0,0,0,.3)';
  ctx.beginPath();
  ctx.ellipse(0, 26, 75, 25, 0, 0, 6.283);
  ctx.fill();
  ctx.fillStyle = '#714626';
  ctx.fillRect(-56, 6, 45, 12);
  ctx.fillRect(13, 7, 54, 12);
  drawlight(camp.x, camp.y, 120, 'rgba(255,168,78,ALPHA)', 0.22);
  ctx.fillStyle = '#ffdb76';
  ctx.beginPath();
  ctx.moveTo(0, -27 - Math.sin(time * 7) * 4);
  ctx.bezierCurveTo(20, -2, 10, 20, 0, 25);
  ctx.bezierCurveTo(-18, 10, -10, -10, 0, -27);
  ctx.fill();
  ctx.fillStyle = '#ff7048';
  ctx.beginPath();
  ctx.moveTo(0, -15);
  ctx.bezierCurveTo(10, 4, 6, 16, 0, 19);
  ctx.bezierCurveTo(-9, 8, -6, -4, 0, -15);
  ctx.fill();
  ctx.restore();

  for (const s of stones) drawstone(s);
  for (const s of shards) drawshard(s, time);

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const f of fireflies) {
    const x = f.x + Math.cos(f.a) * 16;
    const y = f.y + Math.sin(f.a * 0.7) * 10;
    const a = 0.25 + 0.25 * Math.sin(time * 4 + f.a);
    ctx.fillStyle = 'rgba(170,255,183,' + a + ')';
    ctx.beginPath();
    ctx.arc(x, y, 2.2, 0, 6.283);
    ctx.fill();
  }
  ctx.restore();

  function drawplayer() {
    drawlight(player.x, player.y, 145 + Math.sin(time * 4) * 8, 'rgba(255,226,130,ALPHA)', 0.23 + player.glow * 0.0015);
    ctx.save();
    ctx.translate(player.x, player.y);
    if (player.inv > 0 && Math.floor(time * 18) % 2 === 0) ctx.globalAlpha = 0.45;
    ctx.fillStyle = 'rgba(0,0,0,.34)';
    ctx.beginPath();
    ctx.ellipse(0, 17, 18, 8, 0, 0, 6.283);
    ctx.fill();
    ctx.rotate(Math.sin(time * 5) * 0.025);
    const cloak = ctx.createLinearGradient(0, -24, 0, 24);
    cloak.addColorStop(0, '#4aa2a2');
    cloak.addColorStop(1, '#123b49');
    ctx.fillStyle = cloak;
    ctx.beginPath();
    ctx.moveTo(0, -30);
    ctx.bezierCurveTo(24, -15, 22, 22, 0, 31);
    ctx.bezierCurveTo(-22, 22, -24, -15, 0, -30);
    ctx.fill();
    ctx.fillStyle = '#f2c597';
    ctx.beginPath();
    ctx.arc(0, -16, 10, 0, 6.283);
    ctx.fill();
    ctx.fillStyle = '#17363e';
    ctx.beginPath();
    ctx.arc(0, -18, 14, Math.PI, 0);
    ctx.lineTo(10, -13);
    ctx.quadraticCurveTo(0, -8, -10, -13);
    ctx.closePath();
    ctx.fill();
    const lx = Math.cos(player.face) * 18, ly = Math.sin(player.face) * 13 - 2;
    ctx.strokeStyle = '#3b2a1b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(8, -1);
    ctx.lineTo(lx, ly);
    ctx.stroke();
    ctx.fillStyle = '#fff0a4';
    ctx.beginPath();
    ctx.arc(lx, ly, 7, 0, 6.283);
    ctx.fill();
    ctx.strokeStyle = 'rgba(30,20,8,.65)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  function drawenemy(e) {
    drawlight(e.x, e.y, 70, 'rgba(120,25,255,ALPHA)', e.stun > 0 ? 0.18 : 0.1);
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.fillStyle = 'rgba(0,0,0,.35)';
    ctx.beginPath();
    ctx.ellipse(0, 18, 24, 9, 0, 0, 6.283);
    ctx.fill();
    ctx.globalAlpha = e.stun > 0 ? 0.58 : 1;
    const gr = ctx.createRadialGradient(-7, -12, 4, 0, 0, 31);
    gr.addColorStop(0, e.hit > 0 ? '#7ffff0' : '#263646');
    gr.addColorStop(1, '#030406');
    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.arc(0, 0, 24 + Math.sin(time * 5 + e.x) * 3, 0, 6.283);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.85)';
    ctx.lineWidth = 7;
    for (let i = 0; i < 4; i++) {
      const a = i * 1.57 + time * 0.8;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 8, Math.sin(a) * 8);
      ctx.quadraticCurveTo(Math.cos(a) * 34, Math.sin(a) * 24 + 18, Math.cos(a) * 25, Math.sin(a) * 34 + 25);
      ctx.stroke();
    }
    ctx.fillStyle = e.stun > 0 ? '#b7fff7' : '#ff4a66';
    ctx.beginPath();
    ctx.arc(-8, -5, 3, 0, 6.283);
    ctx.arc(8, -5, 3, 0, 6.283);
    ctx.fill();
    ctx.restore();
  }

  const list = [];
  for (const t of trees) list.push({ y: t.y + t.r, type: 'tree', o: t });
  for (const e of enemies) list.push({ y: e.y + e.r, type: 'enemy', o: e });
  if (player) list.push({ y: player.y + player.r, type: 'player' });
  list.sort((a, b) => a.y - b.y);
  for (const it of list) {
    if (it.type === 'tree') drawtree(it.o);
    else if (it.type === 'enemy') drawenemy(it.o);
    else if (it.type === 'player') drawplayer();
  }

  for (const p of pulses) {
    const k = p.age / p.dur;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgba(255,236,150,' + (1 - k) + ')';
    ctx.lineWidth = 10 * (1 - k) + 2;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.max * k, 0, 6.283);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(126,255,219,' + (0.65 * (1 - k)) + ')';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.max * k * 0.65, 0, 6.283);
    ctx.stroke();
    ctx.restore();
  }

  for (const b of bursts) {
    const k = b.age / 0.7;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = b.color;
    ctx.globalAlpha = 1 - k;
    for (let i = 0; i < b.n; i++) {
      const a = i * 6.283 / b.n + b.x * 0.01;
      const r = 12 + k * 58 * (0.55 + (i % 5) / 6);
      ctx.beginPath();
      ctx.moveTo(b.x + Math.cos(a) * r * 0.35, b.y + Math.sin(a) * r * 0.35);
      ctx.lineTo(b.x + Math.cos(a) * r, b.y + Math.sin(a) * r);
      ctx.stroke();
    }
    ctx.restore();
  }

  for (const f of floaters) {
    ctx.save();
    ctx.globalAlpha = 1 - f.age / 1.1;
    ctx.fillStyle = f.color;
    ctx.font = '900 18px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(f.text, f.x, f.y - f.age * 42);
    ctx.restore();
  }

  ctx.restore();

  const vig = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.2, w / 2, h / 2, Math.max(w, h) * 0.72);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,.55)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);
                    }
