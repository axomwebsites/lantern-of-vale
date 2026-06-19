let lines = [], index = 0, after = null;
const panel = document.getElementById('dialogue');
const speaker = document.getElementById('speaker');
const text = document.getElementById('dialoguetext');
const nextbtn = document.getElementById('nextline');

export function init() {
  nextbtn.addEventListener('click', () => { advance(false); });
}

export function showdialogue(newlines, callback) {
  lines = newlines;
  index = 0;
  after = callback;
  panel.style.display = 'block';
  advance(true);
}

function advance(first) {
  if (!first) index++;
  if (index >= lines.length) {
    panel.style.display = 'none';
    const fn = after;
    after = null;
    if (fn) fn();
    return;
  }
  speaker.textContent = lines[index][0];
  text.textContent = lines[index][1];
}
