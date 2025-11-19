document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.m-link');
    const bars = document.querySelectorAll('.bar');

    function toggleMenu() {
        mobileOverlay.classList.toggle('active');
        
        // Animate Hamburger to X
        if (mobileOverlay.classList.contains('active')) {
            bars[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            
            // Staggered link animation
            mobileLinks.forEach((link, index) => {
                link.style.transitionDelay = `${0.1 + (index * 0.1)}s`;
            });
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
            
            mobileLinks.forEach(link => {
                link.style.transitionDelay = '0s';
            });
        }
    }

    menuToggle.addEventListener('click', toggleMenu);
    
    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // 2. Scroll Reveal Animation (The "Magic" part)
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

    // 3. Copy Discord Username
    const copyBtn = document.getElementById('copy-btn');
    const discordInput = document.getElementById('discord-user');

    copyBtn.addEventListener('click', () => {
        discordInput.select();
        navigator.clipboard.writeText(discordInput.value);
        
        const originalIcon = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        setTimeout(() => {
            copyBtn.innerHTML = originalIcon;
        }, 2000);
    });

    // 4. Back To Top Button
    const backToTop = document.getElementById('back-to-top');
    
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
});
      
