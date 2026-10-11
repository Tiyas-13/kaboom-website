/* ===== Shared bits for every page ===== */

/* Paste your Formspree (or similar) endpoint here to make the forms actually send.
   e.g. 'https://formspree.io/f/abcdwxyz'. Leave empty to preview without sending. */
const FORM_ENDPOINT = '';

/* --- confetti --- */
const cv = document.getElementById('confetti'), cx = cv.getContext('2d');
let parts = [];
const COLORS = ['#F97316', '#0F766E', '#FACC15', '#38BDF8', '#F472B6', '#A78BFA'];
function size() { cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio }
size(); addEventListener('resize', size);
function burst(x, y, n = 90, power = 1) {
  const d = devicePixelRatio, start = !parts.length;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, s = (4 + Math.random() * 9) * power;
    parts.push({ x: x * d, y: y * d, vx: Math.cos(a) * s * d, vy: (Math.sin(a) * s - 6) * d, r: (4 + Math.random() * 5) * d,
      c: COLORS[i % COLORS.length], rot: Math.random() * 6, vr: (Math.random() - .5) * .4, life: 110 + Math.random() * 60, sq: Math.random() < .5 });
  }
  if (start) requestAnimationFrame(tick);
}
function tick() {
  cx.clearRect(0, 0, cv.width, cv.height);
  parts.forEach(p => {
    p.vy += .35 * devicePixelRatio; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life--;
    cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot); cx.fillStyle = p.c; cx.globalAlpha = Math.min(1, p.life / 40);
    if (p.sq) cx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); else { cx.beginPath(); cx.arc(0, 0, p.r / 1.4, 0, 7); cx.fill() }
    cx.restore();
  });
  parts = parts.filter(p => p.life > 0 && p.y < cv.height + 50);
  if (parts.length) requestAnimationFrame(tick); else cx.clearRect(0, 0, cv.width, cv.height);
}
function burstAt(el, n, p) { const r = el.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, n, p) }

/* --- the KABOOM button --- */
const boom = document.getElementById('boomBtn');
if (boom) {
  let n = 0;
  const lines = ['That was loud.', 'Again? Okay!', 'You’re a natural camper.', 'Kaboom energy: rising.', 'Okay, now go sign up 😄'];
  boom.addEventListener('click', () => {
    n++; burstAt(boom, 110, 1.15);
    document.getElementById('boomCount').textContent = n < 3 ? `${n} kaboom${n > 1 ? 's' : ''}!` : lines[Math.min(n - 3, lines.length - 1)];
  });
}

/* --- reveal on scroll --- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 3) * 80 + 'ms'; io.observe(el) });

/* --- forms (join page) --- */
document.querySelectorAll('form[data-kind]').forEach(form => {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true; btn.textContent = 'Sending…';
    try {
      if (FORM_ENDPOINT) {
        const data = new FormData(form); data.append('form', form.dataset.kind);
        const r = await fetch(FORM_ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        if (!r.ok) throw new Error('send failed');
      } else {
        console.warn('Kaboom: FORM_ENDPOINT is empty, so this form was not actually sent.');
      }
      form.classList.add('sent'); burstAt(form.nextElementSibling, 120, 1.1);
    } catch {
      btn.disabled = false; btn.textContent = 'Try again';
      alert('Hmm, that didn’t go through. Please try again in a moment.');
    }
  });
});

/* --- tabs (join page) --- */
const tabs = document.querySelectorAll('.tabs button');
function showTab(id) {
  tabs.forEach(b => b.classList.toggle('on', b.dataset.tab === id));
  document.querySelectorAll('.panel').forEach(p => p.hidden = p.id !== id);
}
tabs.forEach(b => b.addEventListener('click', () => { showTab(b.dataset.tab); history.replaceState(null, '', '#' + b.dataset.tab) }));
if (tabs.length) showTab(['parent', 'school', 'hello'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'parent');
