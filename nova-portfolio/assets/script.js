// Mobile menu
const menu = document.getElementById('menu');
const nav = document.getElementById('nav');
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}));

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// Scroll progress bar + screenshot scrolling
const bar = document.getElementById('progress');
const showcases = [...document.querySelectorAll('[data-showcase]')];
let ticking = false;

function update() {
  const doc = document.documentElement;
  bar.style.transform = `scaleX(${clamp(doc.scrollTop / (doc.scrollHeight - innerHeight || 1))})`;

  showcases.forEach(sc => {
    const track = sc.querySelector('[data-track]');
    const view = sc.querySelector('.frame-view');
    const rect = sc.getBoundingClientRect();
    const p = reduce ? 0 : clamp(-rect.top / (rect.height - innerHeight));
    const max = Math.max(0, track.offsetHeight - view.clientHeight);
    track.style.transform = `translate3d(0, ${-max * p}px, 0)`;
  });
  ticking = false;
}

addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(update); ticking = true; }
}, { passive: true });
addEventListener('resize', update);
addEventListener('load', update);
update();

// Show the placeholder if a screenshot is missing
document.querySelectorAll('[data-track]').forEach(track => {
  const img = track.querySelector('img');
  const ph = track.querySelector('.placeholder');
  const showPlaceholder = () => { img.hidden = true; ph.hidden = false; update(); };
  img.addEventListener('error', showPlaceholder);
  img.addEventListener('load', update);
  if (img.complete && img.naturalWidth === 0) showPlaceholder();
});
