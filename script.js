/* ═══════════════════════════════════════════
   CELESTIAL ALLURE — script.js
   Animations, Stars, Interactions
═══════════════════════════════════════════ */

'use strict';

/* ─── STAR FIELD ─── */
(function initStars() {
    const canvas = document.getElementById('starsCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let w, h;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    function createStars(count) {
        stars = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 1.4 + 0.2,
                alpha: Math.random(),
                speed: Math.random() * 0.004 + 0.001,
                offset: Math.random() * Math.PI * 2,
                gold: Math.random() > 0.85,
            });
        }
    }

    function drawStars(t) {
        ctx.clearRect(0, 0, w, h);
        for (const s of stars) {
            const a = 0.3 + 0.5 * Math.abs(Math.sin(t * s.speed + s.offset));
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            if (s.gold) {
                ctx.fillStyle = `rgba(201,168,76,${a * 0.85})`;
            } else {
                ctx.fillStyle = `rgba(255,248,220,${a * 0.55})`;
            }
            ctx.fill();
        }
        requestAnimationFrame(drawStars);
    }

    resize();
    window.addEventListener('resize', () => { resize(); createStars(220); });
    createStars(220);
    requestAnimationFrame(drawStars);
})();


/* ─── NAVBAR SCROLL GLASS ─── */
(function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    function onScroll() {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();


/* ─── INTERSECTION OBSERVER — REVEAL ON SCROLL ─── */
(function initReveal() {
    const items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;
    const io = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('revealed'), i * 120);
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });
    items.forEach(el => io.observe(el));
})();


/* ─── PILLAR REVEAL ─── */
(function initPillarReveal() {
    const pillars = document.querySelectorAll('.pillar');
    const why = document.querySelectorAll('.why-card');

    const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                const siblings = e.target.closest('.philosophy-pillars, .why-grid');
                if (!siblings) return;
                const cards = [...siblings.querySelectorAll('.pillar, .why-card')];
                const idx = cards.indexOf(e.target);
                setTimeout(() => e.target.classList.add('revealed'), idx * 100);
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });

    [...pillars, ...why].forEach(el => io.observe(el));
})();


/* ─── SILLAGE BAR ANIMATION ─── */
(function initSillage() {
    const fill = document.querySelector('.sillage-fill');
    if (!fill) return;
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                setTimeout(() => { fill.style.width = '90%'; }, 300);
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });
    io.observe(fill);
})();


/* ─── SMOOTH ANCHOR SCROLL ─── */
(function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
})();


/* ─── ADD TO CART BUTTON FEEDBACK ─── */
(function initCartButtons() {
    document.querySelectorAll('.btn-card').forEach(btn => {
        btn.addEventListener('click', function () {
            const original = this.textContent;
            this.textContent = '✦ Added';
            this.style.background = 'var(--gold)';
            this.style.color = 'var(--obsidian)';
            this.style.borderColor = 'var(--gold)';
            setTimeout(() => {
                this.textContent = original;
                this.style.background = '';
                this.style.color = '';
                this.style.borderColor = '';
            }, 1800);
        });
    });
})();


/* ─── GOLD BUTTON RIPPLE ─── */
(function initGoldRipple() {
    document.querySelectorAll('.btn-gold').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const ripple = document.createElement('span');
            ripple.style.cssText = `
        position:absolute;
        border-radius:50%;
        width:8px;height:8px;
        background:rgba(255,255,255,0.5);
        left:${x - 4}px;top:${y - 4}px;
        transform:scale(0);
        animation:rippleOut 0.6s ease-out forwards;
        pointer-events:none;
      `;
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    if (!document.getElementById('rippleStyle')) {
        const style = document.createElement('style');
        style.id = 'rippleStyle';
        style.textContent = `
      @keyframes rippleOut {
        to { transform: scale(30); opacity: 0; }
      }
    `;
        document.head.appendChild(style);
    }
})();


/* ─── PARALLAX HERO NEBULA ─── */
(function initParallax() {
    const nebulae = document.querySelectorAll('.nebula');
    if (!nebulae.length) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const y = window.scrollY;
                nebulae[0] && (nebulae[0].style.transform = `translateY(${y * 0.12}px)`);
                nebulae[1] && (nebulae[1].style.transform = `translateY(${-y * 0.08}px)`);
                nebulae[2] && (nebulae[2].style.transform = `translateY(${y * 0.05}px)`);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();


/* ─── PYRAMID LAYER HOVER HIGHLIGHT ─── */
(function initPyramid() {
    document.querySelectorAll('.pyramid-layer').forEach(layer => {
        layer.addEventListener('mouseenter', () => {
            layer.style.background = 'rgba(201,168,76,0.07)';
        });
        layer.addEventListener('mouseleave', () => {
            layer.style.background = '';
        });
    });
})();


/* ─── NAV CART ICON PULSE ─── */
(function initCartPulse() {
    const cartBtn = document.querySelector('.nav-icon[aria-label="Cart"]');
    if (!cartBtn) return;
    let count = 0;
    document.querySelectorAll('.btn-card').forEach(btn => {
        btn.addEventListener('click', () => {
            count++;
            cartBtn.style.color = 'var(--gold-light)';
            cartBtn.style.transform = 'scale(1.25)';
            cartBtn.style.transition = 'all 0.25s';
            setTimeout(() => {
                cartBtn.style.color = '';
                cartBtn.style.transform = '';
            }, 600);
        });
    });
})();

/* ─── HERO VIDEO CONTROLLER ─── */
(function initHeroVideo() {
    const video = document.getElementById('hero-video');
    if (!video) return;

    // Ensure autoplay works across browsers
    video.muted = true;
    video.playsInline = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
        playPromise.catch(() => {
            // Fallback: play on first user interaction
            document.addEventListener('click', () => video.play(), { once: true });
            document.addEventListener('touchstart', () => video.play(), { once: true });
        });
    }

    // Subtle scroll-driven scale effect for cinematic feel
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const maxScroll = window.innerHeight;
        const progress = Math.min(scrollY / maxScroll, 1);
        const scale = 1.1 - (progress * 0.08); // Slightly shrinks as you scroll
        const opacity = 1 - (progress * 0.5);
        video.style.transform = `scale(${scale})`;
        video.style.opacity = opacity;
    }, { passive: true });
})();

