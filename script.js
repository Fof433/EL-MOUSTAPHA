document.addEventListener('DOMContentLoaded', () => {

    // --- 0. ANIMATION DE CHARGEMENT & APPARITION (Modern Reveal) ---
    const loaderBar = document.getElementById('page-loader-bar');

    // Fonction pour déclencher les animations d'entrée
    const startReveal = () => {
        if (loaderBar) {
            loaderBar.style.width = '100%';
            setTimeout(() => {
                loaderBar.style.opacity = '0';

                const staggerElements = [
                    document.querySelector('.navbar'),
                    document.querySelector('.hero-badge'),
                    document.querySelector('.hero-content h1'),
                    document.querySelector('.hero-content h2'),
                    document.querySelector('.hero-content p'),
                    document.querySelector('.hero-btns')
                ];

                staggerElements.forEach((el, index) => {
                    if (el) {
                        el.classList.add('page-fade-in');
                        setTimeout(() => {
                            el.classList.add('is-visible');
                        }, index * 100); // Délai de 0.1s par élément
                    }
                });
            }, 300);
        }
    };

    if (loaderBar) {
        // Barre de progression "Smart"
        if (document.readyState === 'complete') {
            startReveal();
        } else {
            // Progression fictive pendant le chargement
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress > 90) {
                    clearInterval(interval);
                } else {
                    loaderBar.style.width = progress + '%';
                }
            }, 100);

            window.addEventListener('load', () => {
                clearInterval(interval);
                startReveal();
            });
        }
    }

    // --- FORMULAIRE DE CONTACT (mailto) ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('from_name').value.trim();
            const email = document.getElementById('from_email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            const feedback = document.getElementById('form-feedback');
            const btnSubmit = document.getElementById('btn-submit');
            const btnText = document.getElementById('btn-text');

            const mailSubject = encodeURIComponent(`[Portfolio] ${subject} - de ${name}`);
            const mailBody = encodeURIComponent(
                `Nom    : ${name}\nEmail  : ${email}\n\nMessage :\n${message}`
            );
            const mailtoLink = `mailto:elmoustaphafofana51@gmail.com?subject=${mailSubject}&body=${mailBody}`;

            window.location.href = mailtoLink;

            // Feedback visuel
            feedback.textContent = '✅ Votre messagerie s\'ouvre avec le message pré-rempli. Cliquez sur Envoyer dedans !';
            feedback.className = 'form-feedback success';
            feedback.style.display = 'block';
            contactForm.reset();
        });
    }

    // --- Bouton Télécharger mon CV ---
    const btnDownloadCV = document.querySelector('.btn-download-cv');
    if (btnDownloadCV) {
        btnDownloadCV.addEventListener('click', function (e) {
            e.preventDefault();
            // Remplacez 'cv.pdf' par le nom réel du fichier CV
            window.open('cv.pdf', '_blank');
        });
    }

    // --- 0. ANIMATION DES MOLÉCULES ---
    const canvas = document.getElementById('molecules-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        // Redimensionner le canvas
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Classe Molécule
        class Molecule {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                // Vitesse légèrement augmentée pour plus de dynamisme
                this.vx = (Math.random() - 0.5) * 0.8; 
                this.vy = (Math.random() - 0.5) * 0.8;
                this.radius = Math.random() * 2 + 1.5; // Tailles variées
                this.connections = [];
                this.maxDistance = 180; // Distance de connexion plus longue
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Rebondir sur les bords
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                // Rester dans les limites
                this.x = Math.max(0, Math.min(canvas.width, this.x));
                this.y = Math.max(0, Math.min(canvas.height, this.y));
            }

            draw() {
                // Point central incandescent (Blanc pur)
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; 
                ctx.fill();

                // Halo lumineux autour (Orange contrastant)
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius + 4, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 107, 0, 0.15)'; 
                ctx.fill();
            }

            findConnections(molecules) {
                this.connections = [];
                for (let other of molecules) {
                    if (other !== this) {
                        const dx = this.x - other.x;
                        const dy = this.y - other.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < this.maxDistance) {
                            this.connections.push({
                                molecule: other,
                                distance: distance
                            });
                        }
                    }
                }
            }

            drawConnections() {
                for (let connection of this.connections) {
                    const opacity = 1 - (connection.distance / this.maxDistance);
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(connection.molecule.x, connection.molecule.y);
                    // Lignes blanches semi-transparentes pour bien ressortir sur le fond sombre
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.25})`; 
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        // Créer les molécules
        const molecules = [];
        // Augmenter un peu le nombre vu qu'on a un grand fond
        const moleculeCount = window.innerWidth > 768 ? 40 : 20; 

        for (let i = 0; i < moleculeCount; i++) {
            molecules.push(new Molecule());
        }

        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Mettre à jour et dessiner les connexions d'abord (pour qu'elles soient en dessous)
            for (let molecule of molecules) {
                molecule.findConnections(molecules);
            }

            for (let molecule of molecules) {
                molecule.drawConnections();
            }

            // Mettre à jour et dessiner les molécules par-dessus
            for (let molecule of molecules) {
                molecule.update();
                molecule.draw();
            }

            requestAnimationFrame(animate);
        }

        animate();
    }

    // --- 1. DARK MODE (Avec mémorisation & Transition douce) ---
    const toggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Vérifier la préférence sauvegardée
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.classList.add(currentTheme);
        if (toggleBtn && currentTheme === 'dark-mode') {
            toggleBtn.classList.replace('fa-moon', 'fa-sun');
        }
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');

            if (body.classList.contains('dark-mode')) {
                toggleBtn.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'dark-mode');
            } else {
                toggleBtn.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'light-mode');
            }
        });
    }

    // --- 2. MENU MOBILE BURGER ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li a');

    if (burger) {
        burger.addEventListener('click', () => {
            if (nav) nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
        });
    }

    // Fermer le menu au clic
    if (navLinks) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (nav) nav.classList.remove('nav-active');
                if (burger) burger.classList.remove('toggle');
            });
        });
    }

    // --- 3. TYPING EFFECT (Machine à écrire) ---
    const TypeWriter = function (txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }

    TypeWriter.prototype.type = function () {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

        let typeSpeed = 100;
        if (this.isDeleting) { typeSpeed /= 2; }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }

    // Init TypeWriter
    const txtElement = document.querySelector('.txt-type');
    if (txtElement) {
        const words = JSON.parse(txtElement.getAttribute('data-words'));
        const wait = txtElement.getAttribute('data-wait');
        new TypeWriter(txtElement, words, wait);
    }

    // --- 4. SCROLL & BACK TO TOP ---
    const toTopBtn = document.querySelector('.to-top');
    const sections = document.querySelectorAll('section, header');
    const navItems = document.querySelectorAll('.nav-links a');
    const reveals = document.querySelectorAll('.scroll-reveal');

    // Scroll Reveal Animation Function
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    }

    // Main Scroll Listener
    window.addEventListener('scroll', () => {
        const pageYOffset = window.pageYOffset;

        // Back to top
        if (toTopBtn) {
            if (pageYOffset > 500) {
                toTopBtn.classList.add('active');
            } else {
                toTopBtn.classList.remove('active');
            }
        }

        // Active Link on Scroll (ScrollSpy)
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(a => {
            a.classList.remove('active-link');
            if (current && a.getAttribute('href').includes(current)) {
                a.classList.add('active-link');
            }
        });

        // Trigger reveal
        revealOnScroll();
    });

    // Handle initial reveal on load
    revealOnScroll();

    // --- 4. PHONE DROPDOWN TOGGLE ---
    const phoneToggler = document.querySelector('.phone-toggler');
    const phoneDropdown = document.querySelector('.phone-dropdown');

    if (phoneToggler && phoneDropdown) {
        phoneToggler.addEventListener('click', (e) => {
            e.stopPropagation();
            phoneDropdown.classList.toggle('active');
        });

        // Fermer le menu si on clique ailleurs
        document.addEventListener('click', (e) => {
            if (!phoneDropdown.contains(e.target) && !phoneToggler.contains(e.target)) {
                phoneDropdown.classList.remove('active');
            }
        });
    }
    // --- 5. SOCIAL ICONS ANIMATION & INTERACTIVITY ---
    const socialIcons = document.querySelectorAll('.social-icon');
    if (socialIcons.length > 0) {
        // Entrance animation
        const revealIcons = () => {
            const windowHeight = window.innerHeight;
            const elementVisible = 50; 

            socialIcons.forEach((icon, index) => {
                const elementTop = icon.getBoundingClientRect().top;
                if (elementTop < windowHeight - elementVisible) {
                    setTimeout(() => {
                        icon.style.opacity = '1';
                        icon.style.transform = 'translateY(0) scale(1)';
                    }, index * 100);
                }
            });
        };

        socialIcons.forEach((icon) => {
            icon.style.opacity = '0';
            icon.style.transform = 'translateY(20px) scale(0.9)';
            
            // --- Advanced Hover Interaction (Magnetic / 3D Effect) ---
            icon.addEventListener('mousemove', (e) => {
                const rect = icon.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position within the element.
                const y = e.clientY - rect.top;  // y position within the element.
                
                // Calculate center
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calculate distance from center (max 1 for edges)
                const distanceX = (x - centerX) / centerX;
                const distanceY = (y - centerY) / centerY;
                
                // Apply subtle 3D tilt and translation
                icon.style.transform = `translateY(-4px) scale(1.05) perspective(100px) rotateX(${-distanceY * 10}deg) rotateY(${distanceX * 10}deg)`;
                icon.style.transition = 'transform 0.1s ease'; // Quick tracking
            });

            icon.addEventListener('mouseleave', () => {
                // Reset to default hover state defined in CSS or base state
                icon.style.transform = ''; 
                icon.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'; // Smooth return
            });
        });

        window.addEventListener('scroll', revealIcons);
        setTimeout(revealIcons, 500);
    }
});
