document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MOBILE MENU & SCROLL SPY (FIXED) ---
    const menuToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-content a'); 
    const desktopNavLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section, header'); 
    const navbar = document.querySelector('.navbar');

    // Function to close menu safely
    function closeMenu() {
        if (menuToggle) menuToggle.classList.remove('active');
        if (mobileMenu) mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

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

        // FIX: Manual Scroll Handling
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                closeMenu();

                if (targetSection) {
                    setTimeout(() => {
                        const navHeight = document.querySelector('.navbar').offsetHeight || 80;
                        const elementPosition = targetSection.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - navHeight;
        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                        });
                    }, 50);
                }
            });
        });
    }

    // --- SCROLL SPY (Desktop & Mobile) ---
    function activeMenu() {
        let len = sections.length;
        while (--len && window.scrollY + 150 < sections[len].offsetTop) {}
        
        // Update mobile nav
        mobileNavLinks.forEach(link => link.classList.remove('active'));
        
        // Update desktop nav
        desktopNavLinks.forEach(link => link.classList.remove('active'));
        
        if(len >= 0) {
            const currentId = sections[len].id;
            
            // Mobile active link
            const mobileActiveLink = document.querySelector(`.mobile-nav-content a[href="#${currentId}"]`);
            if (mobileActiveLink) {
                mobileActiveLink.classList.add('active');
            }
            
            // Desktop active link
            const desktopActiveLink = document.querySelector(`.nav-links a[href="#${currentId}"]`);
            if (desktopActiveLink) {
                desktopActiveLink.classList.add('active');
            }
        }
    }
    
    window.addEventListener('scroll', activeMenu);
    activeMenu();
    
    // --- NAVBAR SCROLL EFFECT ---
    function handleNavbarScroll() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleNavbarScroll); 
    

    // --- 2. DISCORD STATUS FETCHER ---
    const DISCORD_USER_ID = '1338869759441375254';
    const statusBadge = document.getElementById('discord-status');
    const statusText = statusBadge?.querySelector('.status-text');
    
    async function fetchDiscordStatus() {
        try {
            // Using Lanyard API (free, no auth required)
            const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
            const data = await response.json();
            
            if (data.success) {
                const status = data.data.discord_status;
                const statusMap = {
                    'online': { text: 'Online', class: 'online' },
                    'idle': { text: 'Idle', class: 'idle' },
                    'dnd': { text: 'Do Not Disturb', class: 'dnd' },
                    'offline': { text: 'Offline', class: 'offline' }
                };
                
                const statusInfo = statusMap[status] || statusMap['offline'];
                
                if (statusBadge && statusText) {
                    statusBadge.className = 'status-badge ' + statusInfo.class;
                    statusText.textContent = statusInfo.text;
                }
            }
        } catch (error) {
            console.log('Discord status fetch failed:', error);
            if (statusBadge && statusText) {
                statusBadge.className = 'status-badge offline';
                statusText.textContent = 'Offline';
            }
        }
    }
    
    // Fetch immediately and then every 30 seconds
    fetchDiscordStatus();
    setInterval(fetchDiscordStatus, 30000);
    
    // --- 3. PROFILE PARALLAX TILT EFFECT ---
    const profileWrapper = document.getElementById('profile-wrapper');
    const profilePhoto = document.getElementById('profile-photo');
    
    if (profileWrapper && profilePhoto && !window.matchMedia('(pointer: coarse)').matches) {
        profileWrapper.addEventListener('mousemove', (e) => {
            const rect = profileWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            profilePhoto.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        profileWrapper.addEventListener('mouseleave', () => {
            profilePhoto.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    }

    // --- 4. TYPEWRITER EFFECT ---
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

    // --- 3. LOADING ANIMATION ON SCROLL ---
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
    
    // Add scroll loading indicator
    const createScrollIndicator = () => {
        if (document.querySelector('.scroll-progress')) return; // Prevent duplicates
        
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            z-index: 9999;
            transition: width 0.3s ease;
        `;
        document.body.appendChild(progressBar);
    };
    
    const updateScrollProgress = () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            progressBar.style.width = scrolled + "%";
        }
    };
    
    // Initialize and update scroll progress
    createScrollIndicator();
    window.addEventListener('scroll', updateScrollProgress);

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


    // --- 7. UNIFIED CAROUSEL SYSTEM (Dots + Auto Scroll + Arrows + Filter) ---
    const track = document.querySelector('.carousel-track');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const carouselItems = document.querySelectorAll('.carousel-item');

    if (track && dots.length > 0) {
        let autoScrollInterval;
        let currentFilter = 'all';
        
        // Get visible items based on filter
        function getVisibleItems() {
            return Array.from(carouselItems).filter(item => {
                if (currentFilter === 'all') return true;
                return item.dataset.category === currentFilter;
            });
        }
        
        // A. UPDATE DOTS & ACTIVE CARD
        const updateCarousel = () => {
            const visibleItems = getVisibleItems();
            const cardWidth = track.offsetWidth * 0.85 + 20; // 85% + gap
            const scrollPos = track.scrollLeft;
            const index = Math.round(scrollPos / cardWidth);
            
            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
                dot.style.display = i < visibleItems.length ? 'block' : 'none';
            });
            
            // Update active card styling
            visibleItems.forEach((item, i) => {
                item.classList.toggle('active', i === index);
            });
        };

        track.addEventListener('scroll', updateCarousel);

        // B. ARROW NAVIGATION
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                const cardWidth = track.offsetWidth * 0.85 + 20;
                track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
                stopTimer();
                startTimer();
            });
            
            nextBtn.addEventListener('click', () => {
                const cardWidth = track.offsetWidth * 0.85 + 20;
                track.scrollBy({ left: cardWidth, behavior: 'smooth' });
                stopTimer();
                startTimer();
            });
        }

        // C. FILTER FUNCTIONALITY
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                currentFilter = btn.dataset.filter;
                
                // Show/hide items
                carouselItems.forEach(item => {
                    if (currentFilter === 'all' || item.dataset.category === currentFilter) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                // Reset scroll and update
                track.scrollTo({ left: 0, behavior: 'smooth' });
                setTimeout(updateCarousel, 300);
            });
        });

        // D. AUTO SCROLL
        const autoScroll = () => {
            const visibleItems = getVisibleItems();
            const cardWidth = track.offsetWidth * 0.85 + 20;
            const maxScroll = (visibleItems.length - 1) * cardWidth;

            if (track.scrollLeft >= maxScroll - 10) {
                track.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                track.scrollBy({ left: cardWidth, behavior: 'smooth' });
            }
        };

        // E. START/STOP LOGIC
        const startTimer = () => {
            clearInterval(autoScrollInterval);
            autoScrollInterval = setInterval(autoScroll, 4000);
        };

        const stopTimer = () => clearInterval(autoScrollInterval);

        track.addEventListener('touchstart', stopTimer, { passive: true });
        track.addEventListener('mouseenter', stopTimer);
        
        track.addEventListener('touchend', startTimer);
        track.addEventListener('mouseleave', startTimer);

        // Initialize
        updateCarousel();
        startTimer();

        // --- 7. TECH STACK "SPINNER" PHYSICS ---
        const techScroller = document.querySelector('.tech-scroller');
        
        if (techScroller) {
            let isHovered = false;
            let scrollSpeed = 1; // Adjust speed (Higher = Faster)

            // 1. The Engine: Moves the scrollbar automatically
            const autoScrollTech = () => {
                if (!isHovered) {
                    techScroller.scrollLeft += scrollSpeed;
                    
                    // Infinite Loop Reset: If we reach the end, jump back to start invisibly
                    // (Requires duplicate content to look smooth)
                    if (techScroller.scrollLeft >= (techScroller.scrollWidth - techScroller.clientWidth) - 10) {
                       techScroller.scrollLeft = 0;
                    }
                }
                requestAnimationFrame(autoScrollTech);
            };

            // 2. Interaction: Stop engine when user touches/hovers
            techScroller.addEventListener('mouseenter', () => isHovered = true);
            techScroller.addEventListener('touchstart', () => isHovered = true, { passive: true });

            // 3. Resume: Restart engine when user leaves (with a small delay for momentum)
            techScroller.addEventListener('mouseleave', () => isHovered = false);
            techScroller.addEventListener('touchend', () => {
                setTimeout(() => isHovered = false, 2000); // Wait 2 seconds after flick to resume
            });

            // Start the engine
            autoScrollTech();
        }
        
    }
}); // <--- THIS closes the main 'DOMContentLoaded' from line 1. NOTHING should be after this.