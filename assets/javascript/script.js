// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Respect user's reduced motion preference
const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Typing Animation
document.addEventListener('DOMContentLoaded', () => {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;

    const texts = [
        'Site Reliability Engineering',
        'Cybersecurity',
        'Cloud Architect',
        'DevSecOps, Cloud Infrastructure and Platform Engineering'
    ];

    // Stabilize layout: set min-width to longest word to avoid container reflow
    try {
        const longest = texts.reduce((a, b) => (a.length >= b.length ? a : b), '');
        const measure = document.createElement('span');
        measure.style.position = 'absolute';
        measure.style.visibility = 'hidden';
        measure.style.whiteSpace = 'nowrap';
        measure.style.left = '-9999px';
        measure.style.top = '-9999px';
        measure.textContent = longest;
        // try to inherit font styles for accurate measurement
        const cs = window.getComputedStyle(typingText);
        measure.style.fontFamily = cs.fontFamily;
        measure.style.fontSize = cs.fontSize;
        measure.style.fontWeight = cs.fontWeight;
        measure.style.letterSpacing = cs.letterSpacing;
        document.body.appendChild(measure);
        const width = measure.getBoundingClientRect().width;
        document.body.removeChild(measure);
        // Apply width stabilization to the container so the caret sits
        // immediately after the actual text content (not after a wide box)
        const container = typingText.parentElement; // .hero-subtitle
        if (container) {
            // Use block-level flex so it stacks under the H2, and center contents
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'center';
            // Avoid forcing a wide inline box which can place it on the same line as the H2
            container.style.minWidth = '';
        }

        // Let the text span size to its content
        typingText.style.display = 'inline-block';
        typingText.style.whiteSpace = 'nowrap';
        typingText.style.minWidth = '';
        typingText.style.willChange = 'contents';
        // Avoid layout containment so inline width changes affect siblings (the caret)
        typingText.style.contain = '';
    } catch (e) {
        // ignore measurement issues
    }

    // Reduce motion: skip typewriter animation and show a stable role
    if (prefersReducedMotion) {
        typingText.textContent = 'Site Reliability Engineering';

        return; // abort typewriter
    }

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeWriter() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 20 : 40; // even faster typing

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 800; // longer pause after word completed
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 100; // even shorter pause before next text
        }

        setTimeout(typeWriter, typeSpeed);
    }

    setTimeout(typeWriter, 100); // initial delay further reduced
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });
        }
    });
});

// Vertical Skills: smooth, continuous vertical ticker (fresh build)
document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('.tech-orbit .skills-carousel');
    const track = root?.querySelector('.vc-track');
    const viewport = root?.querySelector('.vc-viewport');
    if (!root || !track || !viewport) return;

    const rm = prefersReducedMotion;
    // Source skills
    const source = Array.from(document.querySelectorAll('#skills-data .skill-pill'));
    if (source.length === 0) return;

    function createItem(btn) {
        const li = document.createElement('li');
        li.className = 'vc-item';
        li.setAttribute('role', 'listitem');
        const label = btn.getAttribute('aria-label') || btn.querySelector('.label')?.textContent?.trim() || 'Skill';
        const img = btn.querySelector('img.brand-icon');
        const svg = btn.querySelector('svg');
        if (img) {
            const icon = img.cloneNode(true);
            icon.removeAttribute('class');
            icon.setAttribute('aria-hidden', 'true');
            icon.setAttribute('width', '22');
            icon.setAttribute('height', '22');
            icon.setAttribute('decoding', 'async');
            li.appendChild(icon);
        } else if (svg) {
            const icon = svg.cloneNode(true);
            icon.removeAttribute('width');
            icon.removeAttribute('height');
            icon.setAttribute('aria-hidden', 'true');
            li.appendChild(icon);
        }
        const text = document.createElement('span');
        text.className = 'text';
        text.textContent = label;
        li.appendChild(text);
        return li;
    }
    
    // Initial population: two segments (base + clone) for seamless modular wrap
    const baseItems = source.map(createItem);
    const frag = document.createDocumentFragment();
    baseItems.forEach(n => frag.appendChild(n));
    track.appendChild(frag);
    const frag2 = document.createDocumentFragment();
    baseItems.forEach(n => frag2.appendChild(n.cloneNode(true)));
    track.appendChild(frag2);

    if (rm) {
        // Reduced motion: no auto-scroll, allow manual scroll
        return;
    }

    // rAF ticker using modular wrap (no per-frame DOM reparenting)
    let last = performance.now();
    let y = 0;
    const SPEED = 28; // px/s, slightly slower for smoothness
    let running = true;
    function computeBaseHeight() {
        const children = Array.from(track.children).slice(0, baseItems.length);
        let total = 0;
        for (const el of children) {
            const rect = el.getBoundingClientRect();
            const cs = getComputedStyle(el);
            const mt = parseFloat(cs.marginTop) || 0;
            const mb = parseFloat(cs.marginBottom) || 0;
            total += rect.height + mt + mb;
        }
        return total || (children.length * 48);
    }
    let baseHeight = computeBaseHeight();
    
    function tick(now) {
        if (!running) { last = now; requestAnimationFrame(tick); return; }
        const dt = (now - last) / 1000;
        last = now;
        y -= SPEED * dt;
        if (y <= -baseHeight) y += baseHeight;
        track.style.transform = `translate3d(0, ${y.toFixed(3)}px, 0)`;
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    // Pause on hover/focus
    root.addEventListener('mouseenter', () => { running = false; });
    root.addEventListener('mouseleave', () => { running = true; last = performance.now(); });
    viewport.addEventListener('focusin', () => { running = false; });
    viewport.addEventListener('focusout', () => { running = true; last = performance.now(); });

    // Keyboard controls and resize handling
    viewport.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            const first = track.firstElementChild;
            const step = first ? first.getBoundingClientRect().height : 48;
            y -= step;
            last = performance.now();
            track.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            const first = track.firstElementChild;
            const step = first ? first.getBoundingClientRect().height : 48;
            y += step;
            last = performance.now();
            track.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
        } else if (e.key === 'Home') {
            e.preventDefault();
            y = 0;
            track.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
            last = performance.now();
        }
    });
    window.addEventListener('resize', () => {
        baseHeight = computeBaseHeight();
        if (y <= -baseHeight) y = y % baseHeight;
        track.style.transform = `translate3d(0, ${y.toFixed(3)}px, 0)`;
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.skill-card, .project-card, .stat, .contact-item');

    animateElements.forEach(el => {
        if (prefersReducedMotion) {
            el.style.opacity = '1';
            el.style.transform = 'none';
        } else {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        }
    });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000, options = {}) {
    const { suffix = '', decimals = 0 } = options;
    let start = 0;
    const increment = target / (duration / 16);

    function updateCounter() {
        start += increment;
        if (start < target) {
            const value = decimals > 0 ? start.toFixed(decimals) : Math.floor(start);
            element.textContent = `${value}${suffix}`;
            requestAnimationFrame(updateCounter);
        } else {
            const value = decimals > 0 ? target.toFixed(decimals) : Math.round(target);
            element.textContent = `${value}${suffix}`;
        }
    }

    updateCounter();
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            if (prefersReducedMotion) {
                // Keep static values without animation
                statsObserver.unobserve(entry.target);
                return;
            }
            statNumbers.forEach(stat => {
                const original = stat.textContent.trim();
                const hasPercent = original.includes('%');
                const hasPlus = original.includes('+');
                const decimalsMatch = original.match(/\.(\d+)/);
                const decimals = decimalsMatch ? decimalsMatch[1].length : 0;
                const numeric = parseFloat(original.replace(/[^0-9.]/g, '')) || 0;
                const suffix = `${hasPercent ? '%' : ''}${hasPlus ? '+' : ''}`;
                animateCounter(stat, numeric, 2000, { suffix, decimals });
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

// Parallax effect for hero background shapes
window.addEventListener('scroll', () => {
    if (prefersReducedMotion) return;
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.bg-shape');

    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.1);
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        // Simple validation
        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields');
            return;
        }

        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            alert('Thank you for your message! I\'ll get back to you soon.');
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Add hover effects to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Add click effect to buttons
if (!prefersReducedMotion) {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            let ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);

            let x = e.clientX - e.target.offsetLeft;
            let y = e.clientY - e.target.offsetTop;

            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add ripple effect CSS
const rippleCSS = `
.btn {
    position: relative;
    overflow: hidden;
}

.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

// Inject ripple CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Tooltip CSS for orbit satellites (hover/focus)
const tooltipCSS = `
.satellite[data-tooltip] {
    position: absolute;
}
.satellite[data-tooltip]::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    background: rgba(17, 24, 39, 0.95);
    color: white;
    font-size: 12px;
    line-height: 1;
    padding: 6px 8px;
    border-radius: 6px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 150ms ease, transform 150ms ease;
    z-index: 50;
}
.satellite[data-tooltip]::before {
    content: '';
    position: absolute;
    bottom: calc(100% + 2px);
    left: 50%;
    transform: translateX(-50%);
    width: 0; height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid rgba(17, 24, 39, 0.95);
    opacity: 0;
    transition: opacity 150ms ease;
    z-index: 50;
}
.satellite[data-tooltip]:hover::after,
.satellite[data-tooltip]:focus::after,
.satellite[data-tooltip]:hover::before,
.satellite[data-tooltip]:focus::before {
    opacity: 1;
}
@media (prefers-reduced-motion: reduce) {
    .satellite[data-tooltip]::after,
    .satellite[data-tooltip]::before {
        transition: none;
    }
}
`;

// Inject tooltip CSS
const tooltipStyle = document.createElement('style');
tooltipStyle.textContent = tooltipCSS;
document.head.appendChild(tooltipStyle);

// Scroll indicator functionality
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        document.querySelector('#about').scrollIntoView({
            behavior: 'smooth'
        });
    });

    // Hide scroll indicator after scrolling
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    });
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Preloader CSS
const preloaderCSS = `
body:not(.loaded) {
    overflow: hidden;
}

body:not(.loaded)::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
}

body:not(.loaded)::after {
    content: '';
    position: fixed;
    top: 50%;
    left: 50%;
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    z-index: 10000;
    transform: translate(-50%, -50%);
}

@keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
}
`;

// Inject preloader CSS
const preloaderStyle = document.createElement('style');
preloaderStyle.textContent = preloaderCSS;
document.head.appendChild(preloaderStyle);

// Particle effect for hero section (guard when hero is removed)
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return; // no hero present, skip
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(102, 126, 234, 0.5);
            border-radius: 50%;
            pointer-events: none;
            animation: float-particle ${5 + Math.random() * 10}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 5}s;
        `;
        hero.appendChild(particle);
    }
}

// Particle animation CSS
const particleCSS = `
@keyframes float-particle {
    0% {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: translateY(-100vh) rotate(360deg);
        opacity: 0;
    }
}
`;

// Inject particle CSS and create particles
const hasHero = document.querySelector('.hero');
if (!prefersReducedMotion && hasHero) {
    const particleStyle = document.createElement('style');
    particleStyle.textContent = particleCSS;
    document.head.appendChild(particleStyle);
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(createParticles, 2000);
    });
}

// Theme toggle removed per request (no floating button created)

// Build the Technology Orbit from the Skills grid
document.addEventListener('DOMContentLoaded', () => {
    const orbitRoots = Array.from(document.querySelectorAll('.tech-orbit .orbit'));
    const rawSkills = Array.from(document.querySelectorAll('#skills-data .skill-pill'));
    const seen = new Set();
    const skills = rawSkills.filter(btn => {
        const label = btn.getAttribute('aria-label') || btn.querySelector('.label')?.textContent?.trim() || 'Skill';
        if (seen.has(label)) return false;
        seen.add(label);
        return true;
    });
    if (orbitRoots.length === 0 || skills.length === 0) return;

    // Respect reduced motion: skip float animations only (rings already disabled via CSS media query)
    const rm = prefersReducedMotion;

    orbitRoots.forEach((orbitRoot) => {
        // Guard: prevent double-initialization if script runs again (e.g., HMR/live reload)
        if (orbitRoot.dataset.orbitBuilt === 'true') {
            return;
        }
        orbitRoot.dataset.orbitBuilt = 'true';

        // If satellites already present (from previous runs), clear them to avoid duplicates
        orbitRoot.querySelectorAll('.satellite').forEach(n => n.remove());
        // Gather ring elements and their radii
        const rings = [
            orbitRoot.querySelector('.ring-1'),
            orbitRoot.querySelector('.ring-2'),
            orbitRoot.querySelector('.ring-3')
        ].filter(Boolean);
        if (rings.length === 0) return;

        // Compute radii using actual layout sizes
        const radii = rings.map(r => (r.getBoundingClientRect().width || r.clientWidth || 0) / 2);
        const totalRadius = radii.reduce((a, b) => a + b, 0) || 1;

        const total = skills.length;
        // Distribute satellites proportionally by circumference (radius)
        let counts = radii.map(r => Math.max(1, Math.floor(total * (r / totalRadius))));
        // Adjust to match exactly the total count
        let diff = total - counts.reduce((a, b) => a + b, 0);
        while (diff !== 0) {
            if (diff > 0) {
                // give extra to the largest ring(s)
                const idx = counts.indexOf(Math.max(...counts));
                counts[idx] += 1; diff -= 1;
            } else {
                // remove from the largest ring(s)
                const idx = counts.indexOf(Math.max(...counts));
                if (counts[idx] > 1) { counts[idx] -= 1; diff += 1; } else { break; }
            }
        }

        const centerX = orbitRoot.clientWidth / 2;
        const centerY = orbitRoot.clientHeight / 2;

        let skillIdx = 0; // reset per orbit to render the same set/order for each duplicate
        rings.forEach((ringEl, ringIdx) => {
            const count = counts[ringIdx];
            const radius = radii[ringIdx];
            if (!count || !radius) return;

            for (let i = 0; i < count; i++) {
                const btn = skills[skillIdx % total];
                const label = btn.getAttribute('aria-label') || btn.querySelector('.label')?.textContent?.trim() || 'Skill';

                // Create satellite
                const sat = document.createElement('div');
                sat.className = 'satellite';
                sat.setAttribute('role', 'img');
                sat.setAttribute('aria-label', label);
                // Native title for default tooltip fallback
                sat.title = label;
                // Custom tooltip content and keyboard focusability
                sat.setAttribute('data-tooltip', label);
                sat.tabIndex = 0;

                // Clone icon (img or svg)
                const img = btn.querySelector('img.brand-icon');
                const svg = btn.querySelector('svg');
                if (img) {
                    const icon = img.cloneNode(true);
                    icon.removeAttribute('class');
                    icon.setAttribute('aria-hidden', 'true');
                    sat.appendChild(icon);
                } else if (svg) {
                    const icon = svg.cloneNode(true);
                    icon.removeAttribute('width');
                    icon.removeAttribute('height');
                    icon.setAttribute('aria-hidden', 'true');
                    sat.appendChild(icon);
                } else {
                    const fallback = document.createElement('span');
                    fallback.textContent = label[0] || '?';
                    sat.appendChild(fallback);
                }

                // Position on ring
                const angle = (i / count) * Math.PI * 2; // radians
                const satHalf = 20; // approximate half of 40px satellite
                const effR = Math.max(0, radius - satHalf - 4);
                const x = centerX + effR * Math.cos(angle) - satHalf;
                const y = centerY + effR * Math.sin(angle) - satHalf;
                sat.style.left = `${x}px`;
                sat.style.top = `${y}px`;

                // Gentle float animation with randomization (skip on reduced motion)
                if (!rm) {
                    const useY = Math.random() > 0.5;
                    const dur = (5 + Math.random() * 3).toFixed(2);
                    const delay = (Math.random() * 2).toFixed(2);
                    sat.style.animation = `${useY ? 'float-y' : 'float-x'} ${dur}s ease-in-out ${delay}s infinite`;
                }

                orbitRoot.appendChild(sat);
                skillIdx++;
            }
        });
    });
});
