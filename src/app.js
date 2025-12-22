// Main Application Logic
document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initWriteups();
    initMobileMenu();
    initSmoothScroll();

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
});

// Navigation handling
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');

            // Handle write-ups special case
            if (section === 'writeups') {
                showWriteupsList();
            } else {
                showSection(section);
            }

            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Close mobile menu if open
            document.getElementById('mobile-menu').classList.add('hidden');
        });
    });

    // Set initial active state
    document.querySelector('.nav-link[data-section="home"]').classList.add('active');
}

// Mobile menu toggle
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Smooth scroll handling
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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

// Show specific section
function showSection(sectionId) {
    // Hide all main sections
    const sections = ['home', 'writeups', 'about', 'certifications', 'contact'];
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            section.style.display = id === sectionId ? 'block' : 'none';
        }
    });

    // Hide writeup detail view
    document.getElementById('writeup-detail').classList.add('hidden');

    // Scroll to top
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
    const filtered = filterWriteups(filter);
    const sorted = sortWriteupsByDate(filtered);

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

// Show write-ups list
function showWriteupsList() {
    document.getElementById('writeups').style.display = 'block';
    document.getElementById('writeup-detail').classList.add('hidden');
    document.getElementById('home').style.display = 'none';
    document.getElementById('about').style.display = 'none';
    document.getElementById('certifications').style.display = 'none';
    document.getElementById('contact').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Load and display a write-up
async function loadWriteup(file, title) {
    const detailSection = document.getElementById('writeup-detail');
    const contentDiv = document.getElementById('writeup-content');

    // Show loading state
    contentDiv.innerHTML = '<div class="text-center py-12"><div class="loading mx-auto"></div><p class="mt-4 text-cyber-light/60">Loading write-up...</p></div>';

    // Hide all other sections, show detail
    document.getElementById('writeups').style.display = 'none';
    document.getElementById('home').style.display = 'none';
    document.getElementById('about').style.display = 'none';
    document.getElementById('certifications').style.display = 'none';
    document.getElementById('contact').style.display = 'none';
    detailSection.classList.remove('hidden');
    detailSection.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error('Failed to load write-up');
        }

        const markdown = await response.text();
        const html = marked.parse(markdown);
        contentDiv.innerHTML = html;

        // Highlight code blocks
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
                <button onclick="showWriteupsList()" class="cyber-button">Back to Write-ups</button>
            </div>
        `;
    }
}

// Setup back button for write-up detail view
function setupWriteupDetailNav() {
    const backBtn = document.getElementById('back-to-writeups');
    backBtn.addEventListener('click', showWriteupsList);
}

// Format date helper
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.stat-card, .writeup-card, .contact-card').forEach(el => {
    observer.observe(el);
});

// Certificate Lightbox Functionality
function initCertificateLightbox() {
    const lightbox = document.getElementById('cert-lightbox');
    const lightboxImg = document.getElementById('cert-lightbox-img');
    const closeBtn = document.querySelector('.cert-lightbox-close');

    // Add click handlers to all certificate images
    document.querySelectorAll('.cert-card img').forEach(img => {
        img.addEventListener('click', function () {
            lightbox.classList.remove('hidden');
            lightbox.classList.add('show');
            lightboxImg.src = this.src;
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    // Close lightbox when clicking the close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close lightbox with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lightbox.classList.contains('show')) {
            closeLightbox();
        }
    });

    function closeLightbox() {
        lightbox.classList.remove('show');
        lightbox.classList.add('hidden');
        document.body.style.overflow = ''; // Re-enable scrolling
    }
}

// Initialize certificate lightbox when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    initCertificateLightbox();
});
