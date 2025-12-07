document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MOBILE MENU & SCROLL SPY ---
    const menuToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-card'); // Selects your new menu cards
    const sections = document.querySelectorAll('section, header'); // Sections to track

    // Toggle Menu
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = mobileMenu.classList.contains('active');
            if (!isActive) {
                menuToggle.classList.add('active');
                mobileMenu.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                closeMenu();
            }
        });

        // Close when clicking a link (Fixes redirection issue)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
                // Allow a tiny delay for smooth scroll to kick in
                setTimeout(() => {
                    // Optional: Manually set active if scrollspy lags
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }, 50);
            });
        });

        function closeMenu() {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // --- SCROLL SPY (Moves the Blue Box) ---
    function activeMenu() {
        let len = sections.length;
        while (--len && window.scrollY + 100 < sections[len].offsetTop) {}
        
        navLinks.forEach(link => link.classList.remove('active'));
        
        // This checks if we are currently looking at a section
        if(len >= 0) {
            const currentId = sections[len].id;
            // Find the link that points to this ID
            const activeLink = document.querySelector(`.nav-card[href="#${currentId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }
    window.addEventListener('scroll', activeMenu);
    activeMenu(); // Run on load

    // --- 2. TYPEWRITER EFFECT ---
    const textElement = document.querySelector('.typing-text');
    if (textElement) {
        const words = ["Custom Discord Bots", "Modern Websites", "Minecraft Solutions"];
        let wordIndex = 0, charIndex = 0, isDeleting = false;
        
        const type = () => {
            const currentWord = words[wordIndex];
            const currentText = currentWord.substring(0, charIndex);
            textElement.textContent = currentText;
            
            let typeSpeed = 100;
            if (isDeleting) { typeSpeed = 50; charIndex--; } 
            else { charIndex++; }

            if (!isDeleting && charIndex === currentWord.length + 1) {
                isDeleting = true; typeSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false; wordIndex = (wordIndex + 1) % words.length; typeSpeed = 500;
            }
            setTimeout(type, typeSpeed);
        };
        type();
    }

    // --- 3. SCROLL REVEAL ---
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - 50) reveal.classList.add('active');
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // --- 4. COPY BUTTON ---
    const copyBtn = document.getElementById('copy-btn');
    const discordInput = document.getElementById('discord-user');
    const copyArea = document.querySelector('.copy-area');

    if (copyBtn && discordInput) {
        copyBtn.addEventListener('click', () => {
            discordInput.select();
            navigator.clipboard.writeText(discordInput.value).then(() => {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
                copyBtn.classList.add('copied');
                if(copyArea) copyArea.classList.add('copied');
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    copyBtn.classList.remove('copied');
                    if(copyArea) copyArea.classList.remove('copied');
                }, 2000);
            });
        });
    }

    // --- 5. BACK TO TOP ---
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) backToTop.classList.add('visible');
            else backToTop.classList.remove('visible');
        });
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
});
