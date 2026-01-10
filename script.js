document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MOBILE MENU & SCROLL SPY (FIXED) ---
    const menuToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    // Select all links inside the mobile menu
    const navLinks = document.querySelectorAll('.mobile-nav-content a'); 
    const sections = document.querySelectorAll('section, header'); 

    // Function to close menu safely
    function closeMenu() {
        if (menuToggle) menuToggle.classList.remove('active');
        if (mobileMenu) mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto'; // UNLOCK SCROLL INSTANTLY
    }

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = mobileMenu.classList.contains('active');
            if (!isActive) {
                menuToggle.classList.add('active');
                mobileMenu.classList.add('active');
                document.body.style.overflow = 'hidden'; // Lock Scroll
            } else {
                closeMenu();
            }
        });

        // FIX: Manual Scroll Handling
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); // Stop the default jump
                
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                closeMenu(); // Close menu first

                if (targetSection) {
                    // Small delay to allow the menu to disappear visually
                    setTimeout(() => {
                        const navHeight = document.querySelector('.navbar').offsetHeight || 80;
                        const elementPosition = targetSection.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - navHeight;
        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                        });
                    }, 50); // 50ms delay is enough
                }
            });
        });
    }

    // --- SCROLL SPY (Keeps Blue Box Updated) ---
    function activeMenu() {
        let len = sections.length;
        // Find which section is currently on screen
        while (--len && window.scrollY + 150 < sections[len].offsetTop) {}
        
        navLinks.forEach(link => link.classList.remove('active'));
        
        if(len >= 0) {
            const currentId = sections[len].id;
            // Target the link that matches the current ID
            const activeLink = document.querySelector(`.mobile-nav-content a[href="#${currentId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }
    window.addEventListener('scroll', activeMenu);
    // Run once on load to highlight 'Home'
    activeMenu(); 
    

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

    // --- 6. UNIFIED CAROUSEL SYSTEM (Dots + Auto Scroll) ---
    const track = document.querySelector('.carousel-track');
    const dots = document.querySelectorAll('.carousel-dots .dot');

    if (track && dots.length > 0) {
        let autoScrollInterval;
        
        // A. THE MATH: Highlight the correct dot on scroll
        const updateDots = () => {
            const width = track.offsetWidth;
            const scrollPos = track.scrollLeft;
            // Math: Scroll Position divided by Card Width = Current Index
            const index = Math.round(scrollPos / width);
            
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[index]) dots[index].classList.add('active');
        };

        track.addEventListener('scroll', updateDots);

        // B. THE ENGINE: Auto-move every 3 seconds
        const autoScroll = () => {
            const cardWidth = track.offsetWidth;
            const maxScroll = track.scrollWidth - track.clientWidth;

            // If near end, go to start. Else, go next.
            if (track.scrollLeft >= maxScroll - 10) {
                track.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                track.scrollBy({ left: cardWidth, behavior: 'smooth' });
            }
        };

        // C. START/STOP LOGIC
        const startTimer = () => {
            clearInterval(autoScrollInterval);
            autoScrollInterval = setInterval(autoScroll, 3000);
        };

        const stopTimer = () => clearInterval(autoScrollInterval);

        // Pause when touching/hovering
        track.addEventListener('touchstart', stopTimer, { passive: true });
        track.addEventListener('mouseenter', stopTimer);
        
        // Resume when leaving
        track.addEventListener('touchend', startTimer);
        track.addEventListener('mouseleave', startTimer);

        // Start the engine!
        startTimer();
    }
    
        // Start initially
        startAutoScroll();
    }
