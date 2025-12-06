document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MOBILE MENU (Priority Fix) ---
    try {
        const menuToggle = document.getElementById('mobile-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileLinks = document.querySelectorAll('.m-link');

        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevents accidental closures
                const isActive = mobileMenu.classList.contains('active');
                
                if (!isActive) {
                    // Open
                    menuToggle.classList.add('active');
                    mobileMenu.classList.add('active');
                    document.body.style.overflow = 'hidden'; 
                    
                    // Animate Links
                    mobileLinks.forEach((link, index) => {
                        link.style.transitionDelay = `${0.1 + (index * 0.1)}s`;
                    });
                } else {
                    closeMenu();
                }
            });

            // Close when clicking a link
            mobileLinks.forEach(link => {
                link.addEventListener('click', closeMenu);
            });

            function closeMenu() {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto'; 
                mobileLinks.forEach(link => {
                    link.style.transitionDelay = '0s';
                });
            }
        }
    } catch (error) {
        console.error("Navbar Error:", error);
    }

    // --- 2. TYPEWRITER EFFECT (Fix for "Stuck" Text) ---
    try {
        const textElement = document.querySelector('.typing-text');
        
        if (textElement) {
            const words = ["Custom Discord Bots", "Modern Websites", "Minecraft Plugins", "Automation Tools"];
            let wordIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            
            const type = () => {
                const currentWord = words[wordIndex];
                const currentText = currentWord.substring(0, charIndex);
                
                textElement.textContent = currentText;

                let typeSpeed = 100;

                if (isDeleting) {
                    typeSpeed = 50; // Deleting speed
                    charIndex--;
                } else {
                    charIndex++;
                }

                if (!isDeleting && charIndex === currentWord.length + 1) {
                    isDeleting = true;
                    typeSpeed = 2000; // Wait before deleting
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                    typeSpeed = 500; // Wait before typing next word
                }

                setTimeout(type, typeSpeed);
            };

            // Start loop
            type(); 
        }
    } catch (error) {
        console.error("Typewriter Error:", error);
    }

    // --- 3. SCROLL REVEAL (Fix for Empty Screen) ---
    try {
        const reveals = document.querySelectorAll('.reveal');

        const revealOnScroll = () => {
            const windowHeight = window.innerHeight;
            const elementVisible = 50; // Lower threshold to trigger sooner

            reveals.forEach((reveal) => {
                const elementTop = reveal.getBoundingClientRect().top;
                if (elementTop < windowHeight - elementVisible) {
                    reveal.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', revealOnScroll);
        // Trigger immediately on load to fix blank screen
        revealOnScroll(); 
        setTimeout(revealOnScroll, 500); // Trigger again just in case
    } catch (error) {
        console.error("Scroll Reveal Error:", error);
    }

    // --- 4. COPY BUTTON ---
    try {
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
    } catch (error) {
        console.error("Copy Button Error:", error);
    }
});
