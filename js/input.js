const keys = new Set();
let joy = { x: 0, y: 0, active: false, id: null };
let actioncallback = null;

export function init() {
  document.addEventListener('keydown', e => {
    keys.add(e.key.toLowerCase());
    if (e.key === ' ' && actioncallback) actioncallback();
    if (e.key === 'Enter') {
      const next = document.getElementById('nextline');
      if (!next.classList.contains('hidden')) next.click();
    }
    if (e.key === 'Escape') {
      const pausebtn = document.getElementById('pausebtn');
      if (!pausebtn.classList.contains('hidden')) pausebtn.click();
    }
  });
  document.addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));

  const stick = document.getElementById('stick');
  const knob = document.getElementById('knob');
  function setknob(dx, dy) {
    const max = 38, m = Math.hypot(dx, dy);
    const k = m > max ? max / m : 1;
    knob.style.transform = 'translate(' + (dx * k) + 'px, ' + (dy * k) + 'px)';
    joy.x = dx / max;
    joy.y = dy / max;
    const l = Math.hypot(joy.x, joy.y);
    if (l > 1) { joy.x /= l; joy.y /= l; }
  }
  stick.addEventListener('pointerdown', e => {
    joy.active = true; joy.id = e.pointerId;
    stick.setPointerCapture(e.pointerId);
    const r = stick.getBoundingClientRect();
    setknob(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
  });
  stick.addEventListener('pointermove', e => {
    if (!joy.active || e.pointerId !== joy.id) return;
    const r = stick.getBoundingClientRect();
    setknob(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
  });
  const release = (e) => { if (!e || e.pointerId === joy.id) { joy.active = false; joy.id = null; joy.x = 0; joy.y = 0; knob.style.transform = 'translate(0,0)'; } };
  stick.addEventListener('pointerup', release);
  stick.addEventListener('pointercancel', release);

  document.getElementById('action').addEventListener('pointerdown', e => { e.preventDefault(); if (actioncallback) actioncallback(); });
}

export function getinput() {
  let x = 0, y = 0;
  if (keys.has('arrowleft') || keys.has('a')) x--;
  if (keys.has('arrowright') || keys.has('d')) x++;
  if (keys.has('arrowup') || keys.has('w')) y--;
  if (keys.has('arrowdown') || keys.has('s')) y++;
  x += joy.x; y += joy.y;
  const l = Math.hypot(x, y);
  if (l > 1) { x /= l; y /= l; }
  return { x, y, l };
}

export function setaction(fn) { actioncallback = fn; }
