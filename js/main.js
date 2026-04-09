/* VistraDev — main.js (clean, no layout jitter) */

// ── Nav scroll state ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Mobile burger ──
const burger = document.getElementById('navBurger');
const links  = document.getElementById('navLinks');
burger?.addEventListener('click', () => {
    burger.classList.toggle('open');
    links?.classList.toggle('open');
    document.body.style.overflow = links?.classList.contains('open') ? 'hidden' : '';
});
links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger?.classList.remove('open');
    links.classList.remove('open');
    document.body.style.overflow = '';
}));

// ── Scroll reveal (transform + opacity only — zero layout shift) ──
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// ── Counter animation ──
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const duration = 1400;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = Math.floor(current);
            if (current >= target) clearInterval(timer);
        }, 16);
        counterObserver.unobserve(el);
    });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ── Typing effect (min-height on container prevents layout shift) ──
(function () {
    const el = document.getElementById('typed');
    if (!el) return;
    const words = [
        'votre concurrent',
        "quelqu'un d'autre",
        'une boutique visible',
        'une marque en ligne'
    ];
    let wi = 0, ci = 0, del = false;

    function tick() {
        const w = words[wi];
        el.textContent = del ? w.slice(0, ci - 1) : w.slice(0, ci + 1);
        if (!del) ci++;
        else ci--;
        if (!del && ci === w.length) { setTimeout(tick, 2000); return; }
        if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; }
        setTimeout(tick, del ? 38 : 62);
    }
    setTimeout(tick, 1600);
})();

// ── FAQ accordion ──
document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q')?.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    });
});

// ── Testimonials carousel ──
(function () {
    const track   = document.getElementById('carouselTrack');
    const dotsEl  = document.getElementById('cDots');
    const prevBtn = document.getElementById('cPrev');
    const nextBtn = document.getElementById('cNext');
    if (!track) return;

    const slides = track.querySelectorAll('.carousel-slide');
    const total  = slides.length;
    let cur      = 0;
    let timer;

    function vis() {
        return window.innerWidth >= 900 ? 3 : window.innerWidth >= 600 ? 2 : 1;
    }

    function buildDots() {
        dotsEl.innerHTML = '';
        const count = total - vis() + 1;
        for (let i = 0; i < count; i++) {
            const d = document.createElement('button');
            d.className = 'cdot' + (i === 0 ? ' active' : '');
            d.addEventListener('click', () => { go(i); reset(); });
            dotsEl.appendChild(d);
        }
    }

    function updateDots() {
        dotsEl.querySelectorAll('.cdot').forEach((d, i) => d.classList.toggle('active', i === cur));
    }

    function go(index) {
        const max = total - vis();
        cur = Math.max(0, Math.min(index, max));
        track.style.transform = `translateX(-${cur * (100 / vis())}%)`;
        updateDots();
    }

    function reset() {
        clearInterval(timer);
        timer = setInterval(() => go(cur + 1 > total - vis() ? 0 : cur + 1), 4500);
    }

    prevBtn?.addEventListener('click', () => { go(cur - 1); reset(); });
    nextBtn?.addEventListener('click', () => { go(cur + 1); reset(); });

    // Pause on hover
    const outer = track.closest('.carousel-outer');
    outer?.addEventListener('mouseenter', () => clearInterval(timer));
    outer?.addEventListener('mouseleave', reset);

    // Touch swipe
    let tx = 0;
    track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
        const d = tx - e.changedTouches[0].clientX;
        if (Math.abs(d) > 50) go(d > 0 ? cur + 1 : cur - 1);
        reset();
    });

    window.addEventListener('resize', () => { buildDots(); go(0); });
    buildDots(); reset();
})();
