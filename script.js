document.addEventListener('DOMContentLoaded', () => {
    
    // --- CUSTOM CURSOR ---
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursor-follower');
    
    // Only enable custom cursor on non-touch devices
    if (window.matchMedia('(pointer: fine)').matches && cursor && cursorFollower) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // Smooth cursor animation
        function animateCursor() {
            // Cursor follows mouse directly with slight delay
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            
            // Follower has more delay for trailing effect
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
        
        // Hover effects on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select, .role-card, .project-card, .stat-item, .testimonial-card');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorFollower.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorFollower.classList.remove('hover');
            });
        });
        
        // Click effects
        document.addEventListener('mousedown', () => {
            cursor.classList.add('click');
            cursorFollower.classList.add('click');
        });
        
        document.addEventListener('mouseup', () => {
            cursor.classList.remove('click');
            cursorFollower.classList.remove('click');
        });
    }
    
    // --- PARTICLE BACKGROUND ---
    const particleCanvas = document.getElementById('particle-canvas');
    
    if (particleCanvas && window.matchMedia('(pointer: fine)').matches) {
        const ctx = particleCanvas.getContext('2d');
        let particles = [];
        let animationId;
        let isActive = true;
        
        // Resize canvas
        function resizeCanvas() {
            particleCanvas.width = window.innerWidth;
            particleCanvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Particle class
        class Particle {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * particleCanvas.width;
                this.y = Math.random() * particleCanvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Wrap around screen
                if (this.x < 0) this.x = particleCanvas.width;
                if (this.x > particleCanvas.width) this.x = 0;
                if (this.y < 0) this.y = particleCanvas.height;
                if (this.y > particleCanvas.height) this.y = 0;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(230, 0, 122, ${this.opacity})`;
                ctx.fill();
            }
        }
        
        // Create particles (limited number for performance)
        const particleCount = Math.min(50, Math.floor((particleCanvas.width * particleCanvas.height) / 25000));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        // Draw connections between nearby particles
        function drawConnections() {
            const maxDistance = 100;
            const maxConnections = 3;
            
            for (let i = 0; i < particles.length; i++) {
                let connections = 0;
                
                for (let j = i + 1; j < particles.length; j++) {
                    if (connections >= maxConnections) break;
                    
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < maxDistance) {
                        const opacity = (1 - distance / maxDistance) * 0.2;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 191, 255, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                        connections++;
                    }
                }
            }
        }
        
        // Animation loop with visibility check
        function animate() {
            if (!isActive) return;
            
            ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            drawConnections();
            animationId = requestAnimationFrame(animate);
        }
        
        // Pause when tab is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                isActive = false;
                cancelAnimationFrame(animationId);
            } else {
                isActive = true;
                animate();
            }
        });
        
        // Start animation
        animate();
    }
    
    // --- 0. PRELOADER ---
    const preloader = document.getElementById('preloader');
    
    function hidePreloader() {
        if (preloader) {
            setTimeout(() => {
                preloader.classList.add('hidden');
                // Trigger initial reveal animations after preloader
                setTimeout(revealOnScroll, 100);
            }, 1500); // Show preloader for at least 1.5 seconds
        }
    }
    
    // Hide preloader when page is fully loaded
    if (document.readyState === 'complete') {
        hidePreloader();
    } else {
        window.addEventListener('load', hidePreloader);
    }
    
    // --- THEME TOGGLE ---
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Add a subtle rotation animation
            themeToggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                themeToggle.style.transform = '';
            }, 300);
        });
    }
    
    // --- 1. MOBILE MENU & SCROLL SPY (FIXED) ---
    const menuToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-content a'); 
    const desktopNavLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section, header'); 
    const navbar = document.querySelector('.navbar');
    const mobileBottomNav = document.getElementById('mobile-bottom-nav');
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');

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
        
        // Update bottom nav
        bottomNavItems.forEach(item => item.classList.remove('active'));
        
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
            
            // Bottom nav active link
            const bottomActiveLink = document.querySelector(`.bottom-nav-item[href="#${currentId}"]`);
            if (bottomActiveLink) {
                bottomActiveLink.classList.add('active');
            }
        }
    }
    
    window.addEventListener('scroll', activeMenu);
    activeMenu();
    
    // --- REVEAL ANIMATIONS ON SCROLL ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;
        
        revealElements.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', revealOnScroll);
    // Initial check
    revealOnScroll();
    
    // --- STATISTICS COUNTER ANIMATION ---
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;
    
    function startCounters() {
        if (countersStarted) return;
        
        const statsSection = document.getElementById('stats');
        if (!statsSection) return;
        
        const sectionTop = statsSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight - 100) {
            countersStarted = true;
            
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                const suffix = stat.nextElementSibling?.classList.contains('stat-suffix') ? stat.nextElementSibling.textContent : '';
                const duration = 2000; // 2 seconds
                const step = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        stat.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        stat.textContent = target;
                    }
                };
                
                updateCounter();
            });
        }
    }
    
    window.addEventListener('scroll', startCounters);
    
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
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
            
            const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            if (!response.ok) throw new Error('API request failed');
            
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
            } else {
                throw new Error('API returned unsuccessful');
            }
        } catch (error) {
            console.log('Discord status fetch failed:', error.message);
            // Don't show error to user, just display as offline
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

    // --- LEGACY REVEAL ANIMATIONS (for backward compatibility) ---
    
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

    // --- COPY BUTTON --
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

    // --- BACK TO TOP --
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) backToTop.classList.add('visible');
            else backToTop.classList.remove('visible');
        });
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }


    // --- UNIFIED CAROUSEL SYSTEM (Dots + Auto Scroll + Arrows + Filter) --
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

        // --- TECH STACK "SPINNER" PHYSICS --
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