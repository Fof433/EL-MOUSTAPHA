document.addEventListener("DOMContentLoaded", () => {
    // 1. Loading Bar
    const loader = document.getElementById("page-loader-bar");
    if(loader) {
        loader.style.width = "100%";
        setTimeout(() => { loader.style.opacity = "0"; }, 500);
    }

    // 2. Sticky Navbar
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // 3. Mobile Menu Toggle
    const mobileBtn = document.querySelector(".mobile-menu-btn");
    const navLinks = document.querySelector(".nav-links");
    if(mobileBtn && navLinks) {
        mobileBtn.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            const i = mobileBtn.querySelector("i");
            if (navLinks.classList.contains("active")) {
                i.classList.remove("fa-bars");
                i.classList.add("fa-times");
            } else {
                i.classList.remove("fa-times");
                i.classList.add("fa-bars");
            }
        });
    }

    // Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    if(themeToggleBtn) {
        const savedTheme = localStorage.getItem('theme');
        if (!savedTheme) {
            document.body.classList.remove('light-mode'); // Force dark by default
            localStorage.setItem('theme', 'dark');
        } else if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            themeToggleBtn.classList.replace('fa-moon', 'fa-sun');
        } else {
            document.body.classList.remove('light-mode');
            themeToggleBtn.classList.replace('fa-sun', 'fa-moon');
        }

        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            if(document.body.classList.contains('light-mode')) {
                themeToggleBtn.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'light');
            } else {
                themeToggleBtn.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // 4. Smooth Anchor Scroll & Close Menu
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.classList.remove("active");
            if(mobileBtn) {
                const i = mobileBtn.querySelector("i");
                i.classList.remove("fa-times");
                i.classList.add("fa-bars");
            }

            const targetId = this.getAttribute('href');
            if(targetId && targetId !== '#') {
                const targetEl = document.querySelector(targetId);
                if(targetEl) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 5. Scroll Reveal Intersection Observer (Performance 60fps)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll(".reveal-element").forEach(el => observer.observe(el));

    // 6. Typing Text Effect
    const txtElement = document.querySelector('.txt-type');
    if(txtElement) {
        const words = JSON.parse(txtElement.getAttribute('data-words'));
        const wait = txtElement.getAttribute('data-wait');
        
        class TypeWriter {
            constructor(txtElement, words, wait = 3000) {
                this.txtElement = txtElement;
                this.words = words;
                this.txt = '';
                this.wordIndex = 0;
                this.wait = parseInt(wait, 10);
                this.type();
                this.isDeleting = false;
            }

            type() {
                const current = this.wordIndex % this.words.length;
                const fullTxt = this.words[current];

                if(this.isDeleting) {
                    this.txt = fullTxt.substring(0, this.txt.length - 1);
                } else {
                    this.txt = fullTxt.substring(0, this.txt.length + 1);
                }

                this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

                let typeSpeed = 100;

                if(this.isDeleting) typeSpeed /= 2;

                if(!this.isDeleting && this.txt === fullTxt) {
                    typeSpeed = this.wait;
                    this.isDeleting = true;
                } else if(this.isDeleting && this.txt === '') {
                    this.isDeleting = false;
                    this.wordIndex++;
                    typeSpeed = 500;
                }

                setTimeout(() => this.type(), typeSpeed);
            }
        }
        new TypeWriter(txtElement, words, wait);
    }

    // 7. Hero Background Slider
    const slides = document.querySelectorAll(".hero-slider .slide");
    if(slides.length > 0) {
        let currentSlide = 0;
        slides[currentSlide].classList.add("active");
        setInterval(() => {
            slides[currentSlide].classList.remove("active");
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add("active");
        }, 5000);
    }

    // 8. Dynamic Timeline Fill on Scroll
    const timeline = document.querySelector('.academic-timeline');
    if (timeline) {
        const progressLine = document.createElement("div");
        progressLine.className = "timeline-progress";
        timeline.prepend(progressLine);
        
        const academicItems = document.querySelectorAll('.academic-item');

        window.addEventListener('scroll', () => {
            const timelineRect = timeline.getBoundingClientRect();
            // We want fill to start when top of timeline passes viewport center
            const triggerPoint = window.innerHeight / 1.5;
            const scrollPos = triggerPoint - timelineRect.top;
            
            if (scrollPos > 0) {
                const percentage = Math.min((scrollPos / timelineRect.height) * 100, 100);
                progressLine.style.height = `${percentage}%`;
            } else {
                progressLine.style.height = `0%`;
            }

            // Sync active dots
            academicItems.forEach(item => {
                const itemRect = item.getBoundingClientRect();
                if (itemRect.top < window.innerHeight / 1.5) {
                    item.classList.add("active");
                } else {
                    item.classList.remove("active");
                }
            });
        });
    }

    // 9. Back to Top Button
    const toTopBtn = document.querySelector(".to-top");
    if(toTopBtn) {
        window.addEventListener("scroll", () => {
            if(window.scrollY > 400) toTopBtn.classList.add("visible");
            else toTopBtn.classList.remove("visible");
        });
        toTopBtn.addEventListener("click", (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // 10. Molecules Setup for specific tech background canvas
    const canvas = document.getElementById("molecules-canvas");
    if(canvas) {
        const ctx = canvas.getContext("2d");
        let particlesArray;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        class Particle {
            constructor(x, y, dx, dy, size) {
                this.x = x; this.y = y; this.dx = dx; this.dy = dy; this.size = size;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = 'rgba(100, 255, 218, 0.2)';
                ctx.fill();
            }
            update() {
                if(this.x > canvas.width || this.x < 0) this.dx = -this.dx;
                if(this.y > canvas.height || this.y < 0) this.dy = -this.dy;
                this.x += this.dx;
                this.y += this.dy;
                this.draw();
            }
        }

        function initCanvas() {
            particlesArray = [];
            const numberOfParticles = (canvas.height * canvas.width) / 25000;
            for(let i = 0; i < numberOfParticles; i++) {
                let size = Math.random() * 2 + 1;
                let x = Math.random() * (innerWidth - size * 2) + size;
                let y = Math.random() * (innerHeight - size * 2) + size;
                let dx = (Math.random() - 0.5) * 1;
                let dy = (Math.random() - 0.5) * 1;
                particlesArray.push(new Particle(x, y, dx, dy, size));
            }
        }

        function animateCanvas() {
            requestAnimationFrame(animateCanvas);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for(let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            // Connections
            for(let a = 0; a < particlesArray.length; a++) {
                for(let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                                 + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    if(distance < (canvas.width / 15) * (canvas.height / 15)) {
                        let opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = `rgba(100, 255, 218, ${opacityValue * 0.2})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        initCanvas();
        animateCanvas();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initCanvas();
        });
    }

    // 11. Form Handle fake submit animation
    const contactForm = document.getElementById("contact-form");
    if(contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const btnText = document.getElementById("btn-text");
            const btnIcon = document.getElementById("btn-icon");
            const btnSubmit = document.getElementById("btn-submit");
            
            const originalText = btnText.innerText;
            btnText.innerText = "Envoi en cours...";
            btnIcon.className = "fas fa-spinner fa-spin";
            btnSubmit.style.pointerEvents = "none";
            
            setTimeout(() => {
                contactForm.reset();
                btnText.innerText = "Envoyé avec succès !";
                btnIcon.className = "fas fa-check";
                btnSubmit.style.background = "rgba(100, 255, 218, 0.2)";
                
                setTimeout(() => {
                    btnText.innerText = originalText;
                    btnIcon.className = "fas fa-paper-plane";
                    btnSubmit.style.pointerEvents = "auto";
                    btnSubmit.style.background = "transparent";
                }, 3000);
            }, 1500);
        });
    }
});
