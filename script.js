document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. Mobile Menu Logic --- */
    const menuToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.m-link');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isActive = menuToggle.classList.contains('active');
            
            if (!isActive) {
                // Open Menu
                menuToggle.classList.add('active');
                mobileMenu.classList.add('active');
                document.body.style.overflow = 'hidden'; // Lock scroll
                
                // Staggered Animation for links
                mobileLinks.forEach((link, index) => {
                    link.style.transitionDelay = `${0.1 + (index * 0.1)}s`;
                });
            } else {
                // Close Menu
                closeMenu();
            }
        });

        // Close menu when clicking any link
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        function closeMenu() {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto'; // Unlock scroll
            
            // Reset delays
            mobileLinks.forEach(link => {
                link.style.transitionDelay = '0s';
            });
        }
    }

    /* --- 2. Scroll Reveal Animation --- */
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load

    /* --- 3. Copy to Clipboard (with glow + “Copied!”) --- */
    const copyBtn = document.getElementById('copy-btn');
    const discordInput = document.getElementById('discord-user');

    if (copyBtn && discordInput) {
        copyBtn.addEventListener('click', () => {
            const text = discordInput.value;

            const applyCopiedUI = () => {
                const wrapper = copyBtn.closest('.copy-area');

                if (wrapper) wrapper.classList.add('copied');
                copyBtn.classList.add('copied');
                copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';

                setTimeout(() => {
                    if (wrapper) wrapper.classList.remove('copied');
                    copyBtn.classList.remove('copied');
                    copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
                }, 2000);
            };

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text)
                    .then(applyCopiedUI)
                    .catch(applyCopiedUI); // still show success UI even if blocked
            } else {
                // Fallback for older browsers
                discordInput.select();
                document.execCommand('copy');
                window.getSelection().removeAllRanges();
                applyCopiedUI();
            }
        });
    }

    /* --- 4. Back to Top Button --- */
    const backToTop = document.getElementById('back-to-top');
    
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
