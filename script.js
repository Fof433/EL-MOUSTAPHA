document.addEventListener('DOMContentLoaded', () => {
    // --- DÉTECTION NAVIGATEUR FACEBOOK ---
    const isFBBrowser = /FBAN|FBAV|FB_IAB|Instagram/i.test(navigator.userAgent);

    if (isFBBrowser) {
        // Affiche une bannière d'avertissement en haut de page
        const banner = document.createElement('div');
        banner.id = 'fb-browser-banner';
        banner.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            Vous utilisez le navigateur Facebook. Pour une meilleure expérience et des liens corrects,
            <strong>ouvrez ce site dans votre navigateur</strong> (⋮ &rarr; "Ouvrir dans Chrome/Safari").
            <button onclick="this.parentElement.remove()" aria-label="Fermer">&times;</button>
        `;
        document.body.prepend(banner);

        // Intercepte les clics sur les icônes sociales depuis FB browser
        document.querySelectorAll('.social-icon').forEach(link => {
            link.addEventListener('click', function (e) {
                const url = this.href;
                if (url && !url.startsWith('mailto')) {
                    e.preventDefault();
                    // Affiche un toast avec le lien à copier
                    showFBToast(url);
                }
            });
        });
    }

    function showFBToast(url) {
        const existing = document.getElementById('fb-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'fb-toast';
        toast.innerHTML = `
            <p><strong>Copiez ce lien et ouvrez-le dans Chrome ou Safari :</strong></p>
            <input type="text" value="${url}" readonly onclick="this.select()">
            <button onclick="navigator.clipboard.writeText('${url}').then(()=>{this.textContent='✅ Copié!'})">Copier</button>
            <button onclick="this.closest('#fb-toast').remove()" style="background:#475569">Fermer</button>
        `;
        document.body.appendChild(toast);
        setTimeout(() => { if (toast.parentElement) toast.remove(); }, 12000);
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
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 3 + 2;
                this.connections = [];
                this.maxDistance = 150;
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
                // Dessiner la molécule
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 123, 255, 0.18)'; // Bleu plus dilué et transparent
                ctx.fill();

                // Cercle extérieur plus lumineux
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius + 3, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(255, 107, 0, 0.12)'; // Orange encore plus transparent
                ctx.lineWidth = 2;
                ctx.stroke();
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
                    ctx.strokeStyle = `rgba(0, 123, 255, ${opacity * 0.09})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        // Créer les molécules
        const molecules = [];
        const moleculeCount = 25;

        for (let i = 0; i < moleculeCount; i++) {
            molecules.push(new Molecule());
        }

        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Mettre à jour et dessiner les connexions
            for (let molecule of molecules) {
                molecule.findConnections(molecules);
            }

            for (let molecule of molecules) {
                molecule.drawConnections();
            }

            // Mettre à jour et dessiner les molécules
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
});
