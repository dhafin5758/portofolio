// Main Application Logic
document.addEventListener('DOMContentLoaded', function () {
    const isWriteupsPage = !!document.getElementById('writeups-grid');

    if (isWriteupsPage) {
        initWriteups();
    } else {
        initNavigation();
        initSmoothScroll();
    }

    initMobileMenu();

    // Initialize marked.js options
    if (typeof marked !== 'undefined') {
        marked.setOptions({
            highlight: function (code, lang) {
                if (typeof hljs !== 'undefined' && lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(code, { language: lang }).value;
                    } catch (err) {
                        console.error('Highlight error:', err);
                    }
                }
                return code;
            },
            breaks: true,
            gfm: true
        });
    }

    // Shared features
    initCertificateLightbox();
    initAnimations();
});

// Navigation handling (mainly for index.html internal sections)
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-section]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const section = this.getAttribute('data-section');
            if (section) {
                e.preventDefault();
                showSection(section);

                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');

                // Update URL without reload
                history.pushState(null, null, `#${section}`);
            }

            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) mobileMenu.classList.add('hidden');
        });
    });

    // Handle initial hash if present
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        showSection(hash);
        const activeLink = document.querySelector(`.nav-link[data-section="${hash}"]`);
        if (activeLink) {
            navLinks.forEach(l => l.classList.remove('active'));
            activeLink.classList.add('active');
        }
    } else if (!document.getElementById('writeups-grid')) {
        // Set initial active state for home if not on writeups page
        const homeLink = document.querySelector('.nav-link[data-section="home"]');
        if (homeLink) homeLink.classList.add('active');
    }
}

// Mobile menu toggle
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// Smooth scroll handling for non-SPA links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]:not([data-section])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// Show specific section (for SPA-like behavior on index.html)
function showSection(sectionId) {
    const sections = ['home', 'about', 'certifications', 'contact'];
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            section.style.display = id === sectionId ? 'block' : 'none';
        }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize write-ups section
function initWriteups() {
    renderWriteups('all');
    setupFilters();
    setupWriteupDetailNav();
}

// Render write-ups grid
function renderWriteups(filter = 'all') {
    const grid = document.getElementById('writeups-grid');
    if (!grid) return;

    const filtered = typeof filterWriteups === 'function' ? filterWriteups(filter) : writeups;
    const sorted = typeof sortWriteupsByDate === 'function' ? sortWriteupsByDate(filtered) : filtered;

    if (sorted.length === 0) {
        grid.innerHTML = '<p class="text-center text-cyber-light/60 col-span-full">No write-ups found in this category.</p>';
        return;
    }

    grid.innerHTML = sorted.map(writeup => `
        <div class="writeup-card fade-in" data-id="${writeup.id}" onclick="loadWriteup('${writeup.file}', '${writeup.title}')">
            <h3>${writeup.title}</h3>
            <p>${writeup.description}</p>
            <div class="tags mb-3">
                ${writeup.tags.map(tag => `<span class="tag ${writeup.category}">${tag}</span>`).join('')}
            </div>
            <div class="meta">
                <span class="category">#${writeup.category}</span>
                <span class="date">${formatDate(writeup.date)}</span>
            </div>
        </div>
    `).join('');
}

// Setup category filters
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');

            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Render filtered write-ups
            renderWriteups(filter);
        });
    });
}

// Load and display a write-up
async function loadWriteup(file, title) {
    const writeupsSection = document.getElementById('writeups');
    const detailSection = document.getElementById('writeup-detail');
    const contentDiv = document.getElementById('writeup-content');

    if (!detailSection || !contentDiv) return;

    // Show loading state
    contentDiv.innerHTML = '<div class="text-center py-12"><div class="loading mx-auto"></div><p class="mt-4 text-cyber-light/60">Loading write-up...</p></div>';

    // Toggle visibility
    if (writeupsSection) writeupsSection.classList.add('hidden');
    detailSection.classList.remove('hidden');
    detailSection.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error('Failed to load write-up');

        const markdown = await response.text();
        const html = marked.parse(markdown);
        contentDiv.innerHTML = html;

        if (typeof hljs !== 'undefined') {
            contentDiv.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        }
    } catch (error) {
        console.error('Error loading write-up:', error);
        contentDiv.innerHTML = `
            <div class="text-center py-12">
                <h2 class="text-2xl text-red-400 mb-4">Error Loading Write-up</h2>
                <p class="text-cyber-light/60 mb-4">${error.message}</p>
                <button onclick="location.reload()" class="cyber-button">Back to Write-ups</button>
            </div>
        `;
    }
}

function setupWriteupDetailNav() {
    const backBtn = document.getElementById('back-to-writeups');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            const writeupsSection = document.getElementById('writeups');
            const detailSection = document.getElementById('writeup-detail');
            if (writeupsSection) writeupsSection.classList.remove('hidden');
            if (detailSection) detailSection.classList.add('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.stat-card, .writeup-card, .contact-card, .cert-card').forEach(el => {
        observer.observe(el);
    });
}

function initCertificateLightbox() {
    const lightbox = document.getElementById('cert-lightbox');
    const lightboxImg = document.getElementById('cert-lightbox-img');
    const closeBtn = document.querySelector('.cert-lightbox-close');

    if (!lightbox || !lightboxImg) return;

    document.querySelectorAll('.cert-card img').forEach(img => {
        img.addEventListener('click', function () {
            lightbox.classList.remove('hidden');
            lightbox.classList.add('show');
            lightboxImg.src = this.src;
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('show');
        lightbox.classList.add('hidden');
        document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox.classList.contains('show')) closeLightbox(); });
}
