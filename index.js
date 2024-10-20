document.addEventListener('DOMContentLoaded', () => {
    const goTopButton = document.getElementById('goTop');
    const navbarToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('nav');

    // Toggle mobile menu
    navbarToggle.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });

    // Go to Top Button visibility
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            goTopButton.style.display = 'flex';
        } else {
            goTopButton.style.display = 'none';
        }
    });

    // Scroll to top functionality
    goTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    });
});