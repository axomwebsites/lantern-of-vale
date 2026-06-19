export let audio = null;
export let ambient = null;

export function initaudio() {
  if (audio) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  audio = new AC();
  const master = audio.createGain();
  master.gain.value = 0.42;
  master.connect(audio.destination);
  audio.master = master;
  const g = audio.createGain();
  g.gain.value = 0.018;
  const o1 = audio.createOscillator();
  const o2 = audio.createOscillator();
  o1.type = 'sine'; o2.type = 'triangle';
  o1.frequency.value = 86; o2.frequency.value = 129;
  o1.connect(g); o2.connect(g); g.connect(master);
  o1.start(); o2.start();
  ambient = { g, o1, o2 };
}

export function tone(f, d, type = 'sine', vol = 0.13, slide = 0) {
  if (!audio) return;
  const t = audio.currentTime;
  const o = audio.createOscillator();
  const g = audio.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, f + slide), t + d);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  o.connect(g); g.connect(audio.master);
  o.start(t); o.stop(t + d + 0.03);
}

export function noise(d, vol = 0.12, filter = 900) {
  if (!audio) return;
  const sr = audio.sampleRate;
  const buf = audio.createBuffer(1, Math.floor(sr * d), sr);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = audio.createBufferSource();
  const f = audio.createBiquadFilter();
  const g = audio.createGain();
  f.type = 'lowpass'; f.frequency.value = filter;
  g.gain.value = vol;
  src.buffer = buf;
  src.connect(f); f.connect(g); g.connect(audio.master);
  src.start();
    }
