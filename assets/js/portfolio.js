/* ============================================================
   PORTFOLIO.JS — Paulo Maculuve
   ============================================================ */

'use strict';

/* === DARK / LIGHT MODE ===================================================== */
const html = document.documentElement;
const themeBtn = document.getElementById('themeBtn');

(function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);
  setThemeIcon(saved);
})();

themeBtn.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  setThemeIcon(next);
});

function setThemeIcon(theme) {
  themeBtn.innerHTML = theme === 'dark'
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>`;
}

/* === NAVBAR ================================================================ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 48);
  updateActiveLink();
  document.getElementById('toTop').classList.toggle('show', window.scrollY > 400);
}, { passive: true });

function updateActiveLink() {
  const links = document.querySelectorAll('.nav-links a');
  document.querySelectorAll('section[id]').forEach(section => {
    const r = section.getBoundingClientRect();
    if (r.top <= 100 && r.bottom >= 100) {
      links.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${section.id}`);
      });
    }
  });
}

/* === MOBILE MENU =========================================================== */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* === TYPED TEXT ============================================================ */
const roles = [
  'Desenvolvedor Web',
  'Desenvolvedor Full Stack',
  'Especialista em APIs REST',
  'Desenvolvedor de Software',
];
let ri = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typed');

function type() {
  const role = roles[ri];
  typedEl.textContent = deleting
    ? role.slice(0, ci - 1)
    : role.slice(0, ci + 1);

  if (!deleting) {
    ci++;
    if (ci > role.length) { setTimeout(() => { deleting = true; type(); }, 2200); return; }
  } else {
    ci--;
    if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(type, deleting ? 55 : 95);
}
type();

/* === CUSTOM CURSOR ========================================================= */
const cursor = document.querySelector('.cursor');
const cursorRing = document.querySelector('.cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
}, { passive: true });

(function animRing() {
  rx += (mx - rx) * .13;
  ry += (my - ry) * .13;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button, .proj-card, .chip').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.cssText    += ';width:14px;height:14px';
    cursorRing.style.cssText += ';width:50px;height:50px;border-color:var(--accent)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.cssText    += ';width:8px;height:8px';
    cursorRing.style.cssText += ';width:34px;height:34px;border-color:rgba(200,255,87,.4)';
  });
});

/* === COUNTER ANIMATION ===================================================== */
function runCounter(el) {
  const target = +el.dataset.to;
  const dur    = 1600;
  const step   = target / (dur / 16);
  let cur = 0;
  const t = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = Math.floor(cur);
    if (cur >= target) clearInterval(t);
  }, 16);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { runCounter(e.target); counterObs.unobserve(e.target); }
  });
}, { threshold: .5 });

document.querySelectorAll('[data-to]').forEach(el => counterObs.observe(el));

/* === SKILL BARS ============================================================ */
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const fill = e.target.querySelector('.skill-fill');
      fill.style.width = fill.dataset.pct + '%';
      barObs.unobserve(e.target);
    }
  });
}, { threshold: .3 });

document.querySelectorAll('.skill-bar').forEach(b => barObs.observe(b));

/* === SHOW MORE PROJECTS ==================================================== */
const showMoreBtn   = document.getElementById('showMoreBtn');
const projExtra     = document.getElementById('projExtra');

if (showMoreBtn && projExtra) {
  showMoreBtn.addEventListener('click', () => {
    const open = projExtra.classList.toggle('open');
    showMoreBtn.textContent = open ? '← Ver menos' : 'Ver todos os projectos →';
  });
}

/* === WHATSAPP CONTACT FORM ================================================= */
/* Como funciona:
   1. Utilizador preenche nome, email e mensagem
   2. Ao submeter, NÃO enviamos email
   3. A mensagem é formatada e codificada com encodeURIComponent
   4. Abre o WhatsApp via wa.me com o texto pré-preenchido
   Número: +258846568447
*/
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', e => {
  e.preventDefault();

  const name    = document.getElementById('cName').value.trim();
  const email   = document.getElementById('cEmail').value.trim();
  const message = document.getElementById('cMessage').value.trim();

  const text    = `Olá, o meu nome é ${name}. Email: ${email}. Mensagem: ${message}`;
  const encoded = encodeURIComponent(text);
  const waUrl   = `https://wa.me/258846568447?text=${encoded}`;

  window.open(waUrl, '_blank', 'noopener,noreferrer');

  /* Feedback visual */
  const btn = contactForm.querySelector('button[type="submit"]');
  const orig = btn.innerHTML;
  btn.innerHTML = '✓ A abrir WhatsApp...';
  btn.disabled = true;
  btn.style.opacity = '.7';

  setTimeout(() => {
    btn.innerHTML = orig;
    btn.disabled = false;
    btn.style.opacity = '1';
    contactForm.reset();
  }, 3000);
});

/* === BACK TO TOP =========================================================== */
document.getElementById('toTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* === SMOOTH NAV LINKS ====================================================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});
