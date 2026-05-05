/* app — runs on every page load via astro:page-load */
const initApp = () => {

    /* code blocks — add copy button to prose pre elements */
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

    initCodeBlocks();
};

/* run on first load and after every view transition */
document.addEventListener('astro:page-load', initApp);

/* theme — re-apply system preference after view transitions */
document.addEventListener('astro:after-swap', () => {
    const theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
});