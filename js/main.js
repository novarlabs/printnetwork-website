document.addEventListener('DOMContentLoaded', () => {

    // --- Header scroll state ---
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        header.classList.toggle('header--scrolled', y > 50);
        lastScroll = y;
    }, { passive: true });

    // --- Mobile burger menu ---
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('open');
        document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    nav.querySelectorAll('.header__link').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // --- Scroll reveal ---
    const revealTargets = document.querySelectorAll(
        '.about__container, .about__image-wrap, .about__text, ' +
        '.services__label, .services__headline, .card, ' +
        '.divider, ' +
        '.contact__header, .form'
    );

    revealTargets.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
    });

    revealTargets.forEach(el => observer.observe(el));

    // --- Stagger card animations ---
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.12}s`;
    });

    // --- Contact form handling ---
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const data = new FormData(form);
        const values = Object.fromEntries(data.entries());

        // Basic validation
        if (!values.name || !values.email || !values.category || !values.message) {
            showFormMessage('Bitte füllen Sie alle Pflichtfelder aus.', 'error');
            return;
        }

        // Email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
            showFormMessage('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
            return;
        }

        // Build mailto fallback
        const subject = encodeURIComponent(`Anfrage von ${values.name} — ${values.category}`);
        const body = encodeURIComponent(
            `Name: ${values.name}\n` +
            `E-Mail: ${values.email}\n` +
            `Telefon: ${values.phone || '—'}\n` +
            `Kategorie: ${values.category}\n` +
            `Menge: ${values.quantity || '—'}\n` +
            `Wunschtermin: ${values.deadline || '—'}\n` +
            `Kontaktweg: ${values.contact_method || '—'}\n\n` +
            `Nachricht:\n${values.message}`
        );

        window.location.href = `mailto:kontakt@printnetwork.eu?subject=${subject}&body=${body}`;
        showFormMessage('Vielen Dank! Ihr E-Mail-Programm wird geöffnet.', 'success');
        form.reset();
    });

    function showFormMessage(text, type) {
        let msg = form.querySelector('.form__message');
        if (!msg) {
            msg = document.createElement('div');
            msg.className = 'form__message';
            form.appendChild(msg);
        }

        msg.textContent = text;
        msg.style.cssText = `
            padding: 1em;
            margin-top: 1em;
            font-family: var(--font-body);
            font-size: 0.9rem;
            text-align: center;
            border: 1px solid ${type === 'error' ? '#c00' : '#000'};
            color: ${type === 'error' ? '#c00' : '#000'};
            background: ${type === 'error' ? '#fff0f0' : '#f0f0f0'};
            animation: fadeUp 0.4s ease forwards;
        `;

        if (type === 'success') {
            setTimeout(() => msg.remove(), 5000);
        }
    }

    // --- Active nav highlight on scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__link');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.style.opacity = link.getAttribute('href') === `#${id}` ? '1' : '0.5';
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 72}px 0px 0px 0px`
    });

    sections.forEach(section => navObserver.observe(section));

    // Reset opacity when at top
    window.addEventListener('scroll', () => {
        if (window.scrollY < 100) {
            navLinks.forEach(link => link.style.opacity = '1');
        }
    }, { passive: true });

});
