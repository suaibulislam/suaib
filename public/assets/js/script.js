const initApp = () => {
    const myTimezone = 'Asia/Dhaka';

    function updateFooterTime() {
        const footerTimeEl = document.getElementById('footer-time');
        if (!footerTimeEl) return;

        const now = new Date();
        const myTime = new Date(now.toLocaleString('en-US', { timeZone: myTimezone }));

        footerTimeEl.textContent = myTime.toLocaleTimeString('en-GB', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
    }



    function showModal(title, text) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const modalText = document.getElementById('modal-text');
        const modalClose = document.getElementById('modal-close');
        if (!modal || !modalTitle || !modalText || !modalClose) return;

        modalTitle.textContent = title;
        modalText.textContent = text;
        modal.classList.add('is-visible');
        modal.setAttribute('aria-hidden', 'false');
        modalClose.focus();

        const close = () => {
            modal.classList.remove('is-visible');
            modal.setAttribute('aria-hidden', 'true');
            document.removeEventListener('keydown', onKeydown);
        };
        const onKeydown = (event) => {
            if (event.key === 'Escape') close();
        };

        modalClose.onclick = close;
        modal.onclick = (event) => {
            if (event.target === modal) close();
        };
        document.addEventListener('keydown', onKeydown);
    }

    function initContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;

        const validateForm = () => {
            const name = contactForm.querySelector('#name')?.value.trim() || '';
            const email = contactForm.querySelector('#email')?.value.trim() || '';
            const message = contactForm.querySelector('#message')?.value.trim() || '';

            if (name.length < 2) {
                showModal('validation error', 'please enter your name.');
                return false;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showModal('validation error', 'please enter a valid email address.');
                return false;
            }
            if (message.length < 10) {
                showModal('validation error', 'please add a bit more detail to your message.');
                return false;
            }
            return true;
        };

        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (!validateForm()) return;

            const submitBtn = contactForm.querySelector('.submit-btn');
            if (!submitBtn) return;

            submitBtn.disabled = true;
            submitBtn.textContent = 'sending...';

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { Accept: 'application/json' }
                });
                const payload = await response.json().catch(() => ({}));
                const success = response.ok && payload.success !== false;
                if (success) {
                    showModal('message sent', "thanks for reaching out. i'll reply soon.");
                    contactForm.reset();
                } else {
                    showModal('something went wrong', String(payload.message || payload.error || 'please try again later.'));
                }
            } catch (_error) {
                showModal('something went wrong', 'please try again later.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'send message';
            }
        });
    }

    function initThemeSystem() {
        const themeButtons = document.querySelectorAll('.theme-toggle-btn');
        if (themeButtons.length === 0) return;

        const setTheme = (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);

            themeButtons.forEach(btn => {
                const label = btn.querySelector('.theme-current-label');
                if (label) label.textContent = theme;
                btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
            });
        };

        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);

        themeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

                if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    setTheme(nextTheme);
                    return;
                }

                document.documentElement.classList.add('theme-transitioning');

                const transition = document.startViewTransition(() => {
                    setTheme(nextTheme);
                });

                transition.finished.finally(() => {
                    document.documentElement.classList.remove('theme-transitioning');
                });
            });
        });
    }

    function initMobileMenu() {
        const toggle = document.getElementById('menu-toggle');
        const body = document.body;
        const navLinks = document.querySelectorAll('.mobile-menu .nav-link');
        const closeArea = document.getElementById('menu-close-area');

        if (!toggle) return;

        const closeMenu = () => {
            body.classList.remove('menu-open');
            toggle.setAttribute('aria-expanded', 'false');
        };

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = body.classList.contains('menu-open');
            body.classList.toggle('menu-open', !isOpen);
            toggle.setAttribute('aria-expanded', String(!isOpen));
        });

        navLinks.forEach(link => link.addEventListener('click', closeMenu));
        if (closeArea) closeArea.addEventListener('click', closeMenu);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && body.classList.contains('menu-open')) {
                closeMenu();
                toggle.focus();
            }
        });
    }

    function initCodeBlocks() {
        const codeBlocks = document.querySelectorAll('.prose-content pre');

        codeBlocks.forEach((block) => {
            if (block.querySelector('.copy-button')) return;

            const code = block.querySelector('code');
            if (!code) return;

            const lang = code.className.replace('language-', '') || 'code';

            const header = document.createElement('div');
            header.className = 'code-header';
            header.innerHTML = `
                <span class="code-lang">${lang}</span>
                <button class="copy-button" aria-label="Copy code">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    <span class="copy-text">copy</span>
                </button>
            `;

            block.insertBefore(header, block.firstChild);

            const button = header.querySelector('.copy-button');
            button.addEventListener('click', async () => {
                const text = code.innerText;
                await navigator.clipboard.writeText(text);

                button.classList.add('copied');
                button.querySelector('.copy-text').textContent = 'copied!';

                setTimeout(() => {
                    button.classList.remove('copied');
                    button.querySelector('.copy-text').textContent = 'copy';
                }, 2000);
            });
        });
    }

    // tick footer clock
    setInterval(updateFooterTime, 60000);

    initContactForm();
    initThemeSystem();
    initMobileMenu();
    initCodeBlocks();
};

document.addEventListener('astro:page-load', initApp);

document.addEventListener('astro:after-swap', () => {
    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
});