/* ============================================
   VistraDev — Main JavaScript
   ============================================ */

// ============================================
// Cursor Glow
// ============================================
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// ============================================
// Particle Background
// ============================================
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.color = Math.random() > 0.5 ? '124, 58, 237' : '6, 182, 212';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = Math.min(Math.floor(window.innerWidth / 10), 120);
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(124, 58, 237, ${0.06 * (1 - dist / 100)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animationId = requestAnimationFrame(animateParticles);
}

resizeCanvas();
initParticles();
animateParticles();

window.addEventListener('resize', () => {
    cancelAnimationFrame(animationId);
    resizeCanvas();
    initParticles();
    animateParticles();
});

// ============================================
// Navbar Scroll Effect
// ============================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, { passive: true });

// ============================================
// Mobile Navigation Toggle
// ============================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close on outside click
document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ============================================
// Scroll Animation (Intersection Observer)
// ============================================
const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay') || 0;
            setTimeout(() => {
                entry.target.classList.add('animated');
            }, parseInt(delay));
            animateObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('[data-animate]').forEach(el => {
    animateObserver.observe(el);
});

// ============================================
// Counter Animation
// ============================================
function animateCounter(el, target, duration = 1500) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current);
    }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-count'));
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => {
    counterObserver.observe(el);
});

// ============================================
// FAQ Accordion
// ============================================
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isActive = item.classList.contains('active');

        // Close all
        document.querySelectorAll('.faq-item.active').forEach(i => i.classList.remove('active'));

        // Open clicked (if it wasn't active)
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ============================================
// Smooth Scroll for anchor links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ============================================
// Pricing Card Hover Glow Effect
// ============================================
document.querySelectorAll('.pricing-card, .service-card, .advantage-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(124, 58, 237, 0.07), transparent 60%), var(--bg-card)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.background = '';
    });
});

// ============================================
// Active Nav Link on Scroll
// ============================================
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinksAll.forEach(link => {
                link.classList.remove('active-link');
                if (link.getAttribute('href') === '#' + entry.target.id) {
                    link.classList.add('active-link');
                }
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ============================================
// Parallax on Hero Orbs
// ============================================
const heroOrbs = document.querySelectorAll('.hero-orb');
window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    heroOrbs.forEach((orb, i) => {
        const factor = (i + 1) * 0.4;
        orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
}, { passive: true });

// ============================================
// WhatsApp Button Entrance
// ============================================
setTimeout(() => {
    const waBtn = document.querySelector('.whatsapp-float');
    if (waBtn) {
        waBtn.style.opacity = '0';
        waBtn.style.transform = 'scale(0) translateY(20px)';
        waBtn.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        setTimeout(() => {
            waBtn.style.opacity = '1';
            waBtn.style.transform = 'scale(1) translateY(0)';
        }, 1500);
    }
}, 0);

// ============================================
// Promo Banner Countdown
// ============================================
(function() {
    const closeBtn = document.getElementById('promoClose');
    const banner = document.getElementById('promoBanner');
    closeBtn?.addEventListener('click', () => {
        if (banner) { banner.style.maxHeight = '0'; banner.style.overflow = 'hidden'; banner.style.padding = '0'; }
    });
    const end = new Date(Date.now() + (23 * 3600 + 59 * 60) * 1000);
    function updatePromo() {
        const diff = Math.max(0, end - Date.now());
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        const hEl = document.getElementById('pHours');
        const mEl = document.getElementById('pMins');
        const sEl = document.getElementById('pSecs');
        if (hEl) hEl.textContent = String(h).padStart(2,'0');
        if (mEl) mEl.textContent = String(m).padStart(2,'0');
        if (sEl) sEl.textContent = String(s).padStart(2,'0');
    }
    updatePromo(); setInterval(updatePromo, 1000);
})();

// ============================================
// Typing Effect
// ============================================
(function() {
    const el = document.getElementById('typedText');
    if (!el) return;
    const words = ["votre concurrent", "quelqu'un d'autre", "une boutique visible en ligne", "une marque qui inspire confiance"];
    let wi = 0, ci = 0, del = false;
    function type() {
        const w = words[wi];
        el.textContent = del ? w.substring(0, ci - 1) : w.substring(0, ci + 1);
        if (!del) ci++; else ci--;
        if (!del && ci === w.length) { setTimeout(() => { del = true; type(); }, 2200); return; }
        if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; }
        setTimeout(type, del ? 40 : 65);
    }
    setTimeout(type, 1500);
})();

// ============================================
// Testimonials Carousel
// ============================================
(function() {
    const track = document.getElementById('carouselTrack');
    const dotsContainer = document.getElementById('carouselDots');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    if (!track) return;
    const slides = track.querySelectorAll('.carousel-slide');
    const total = slides.length;
    let current = 0, autoplay;

    function getVisible() {
        return window.innerWidth >= 900 ? 3 : window.innerWidth >= 600 ? 2 : 1;
    }

    function buildDots() {
        dotsContainer.innerHTML = '';
        const max = total - getVisible() + 1;
        for (let i = 0; i < max; i++) {
            const d = document.createElement('button');
            d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            d.addEventListener('click', () => { goTo(i); resetAutoplay(); });
            dotsContainer.appendChild(d);
        }
    }

    function updateDots() {
        dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function goTo(index) {
        const vis = getVisible();
        current = Math.max(0, Math.min(index, total - vis));
        track.style.transform = `translateX(-${current * (100 / vis)}%)`;
        updateDots();
    }

    function resetAutoplay() {
        clearInterval(autoplay);
        autoplay = setInterval(() => goTo(current + 1 > total - getVisible() ? 0 : current + 1), 4500);
    }

    prevBtn?.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
    nextBtn?.addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });

    const wrap = track.closest('.carousel-wrap');
    wrap?.addEventListener('mouseenter', () => clearInterval(autoplay));
    wrap?.addEventListener('mouseleave', resetAutoplay);

    let tx = 0;
    track.addEventListener('touchstart', e => tx = e.touches[0].clientX, { passive: true });
    track.addEventListener('touchend', e => {
        const d = tx - e.changedTouches[0].clientX;
        if (Math.abs(d) > 50) goTo(d > 0 ? current + 1 : current - 1);
        resetAutoplay();
    });

    window.addEventListener('resize', () => { buildDots(); goTo(0); });

    buildDots(); resetAutoplay();
})();

// ============================================
// 3D Tilt on pricing & advantage cards
// ============================================
document.querySelectorAll('.pricing-card, .advantage-card, .service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
        card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease';
    });
});

// ============================================
// Magnetic Buttons
// ============================================
document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.2;
        const y = (e.clientY - r.top - r.height / 2) * 0.2;
        btn.style.transform = `translate(${x}px, ${y}px)`;
        btn.style.transition = 'transform 0.1s ease';
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
    });
});

// ============================================
// Page Load Animation
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => { document.body.style.opacity = '1'; });
});
