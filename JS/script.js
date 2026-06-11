// ====================================
// SRC Sports Academy JavaScript
// ====================================

// ====================================
// HAMBURGER MENU FUNCTIONALITY
// ====================================

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav ul');

    const insertCardImages = () => {
        const cards = document.querySelectorAll('.card[data-searchable]');
        if (!cards.length) return;

        const basePath = window.location.pathname.includes('/pages/') ? '../assets/images/' : 'assets/images/';
        cards.forEach(card => {
            if (card.querySelector('.card-image')) return;

            const title = card.dataset.title || 'SRC Sports Academy';
            const img = document.createElement('img');
            img.className = 'card-image';
            img.src = `${basePath}sport-placeholder.svg`;
            img.alt = title;
            card.insertBefore(img, card.firstChild);
        });
    };

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = nav.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnHamburger) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            }
        });
    }

    insertCardImages();
});

// ====================================
// VISITOR COUNTER
// ====================================

function initializeVisitorCounter() {
    let visitors = localStorage.getItem('visitCount') || 0;
    visitors = parseInt(visitors) + 1;
    localStorage.setItem('visitCount', visitors);

    const counterElement = document.getElementById('visitor-counter');
    if (counterElement) {
        counterElement.textContent = visitors;
    }
}

// Initialize counter on page load
window.addEventListener('load', initializeVisitorCounter);

// ====================================
// SIMPLE CAPTCHA VERIFICATION
// ====================================

function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const correctAnswer = num1 + num2;

    const captchaQuestion = document.getElementById('captcha-question');
    if (captchaQuestion) {
        captchaQuestion.textContent = `${num1} + ${num2} = ?`;
        captchaQuestion.dataset.answer = correctAnswer;
    }
}

function validateCaptcha() {
    const captchaInput = document.getElementById('captcha-answer');
    const captchaQuestion = document.getElementById('captcha-question');

    if (!captchaInput || !captchaQuestion) return true;

    const userAnswer = parseInt(captchaInput.value);
    const correctAnswer = parseInt(captchaQuestion.dataset.answer);

    if (userAnswer !== correctAnswer) {
        showNotification('CAPTCHA answer is incorrect. Please try again.', 'error');
        generateCaptcha();
        captchaInput.value = '';
        return false;
    }
    return true;
}

// Generate CAPTCHA on page load
window.addEventListener('load', generateCaptcha);

// ====================================
// FORM VALIDATION
// ====================================

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return true;

    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = 'var(--error-color)';
            isValid = false;
        } else {
            field.style.borderColor = 'var(--border-color)';
        }

        // Email validation
        if (field.type === 'email' && field.value && !validateEmail(field.value)) {
            field.style.borderColor = 'var(--error-color)';
            showNotification('Please enter a valid email address.', 'error');
            isValid = false;
        }
    });

    return isValid;
}

// ====================================
// SEARCH FUNCTIONALITY
// ====================================

function setupSearchBar() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    if (!searchInput || !searchBtn) {
        return;
    }

    if (window.jQuery) {
        $('#search-btn').on('click', function() {
            const query = $('#search-input').val().trim();
            if (query) {
                performSearch(query);
            }
        });

        $('#search-input').on('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = $(this).val().trim();
                if (query) {
                    performSearch(query);
                }
            }
        });
    } else {
        searchBtn.addEventListener('click', function() {
            const query = searchInput.value.trim();
            if (query) {
                performSearch(query);
            }
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    performSearch(query);
                }
            }
        });
    }
}

function performSearch(query) {
    const results = [];
    const queryLower = query.toLowerCase();

    if (window.jQuery) {
        $('[data-searchable]').each(function() {
            const element = $(this);
            const text = element.text().toLowerCase();
            if (text.includes(queryLower)) {
                results.push({
                    title: element.attr('data-title') || element.text().trim().substring(0, 50),
                    url: element.attr('data-url') || '#'
                });
            }
        });
    } else {
        const searchableContent = document.querySelectorAll('[data-searchable]');
        searchableContent.forEach(element => {
            const text = element.textContent.toLowerCase();
            if (text.includes(queryLower)) {
                results.push({
                    title: element.getAttribute('data-title') || element.textContent.substring(0, 50),
                    url: element.getAttribute('data-url') || '#'
                });
            }
        });
    }

    displaySearchResults(query, results);
}

function displaySearchResults(query, results) {
    const resultsContainer = document.getElementById('search-results');
    
    if (!resultsContainer) {
        if (results.length > 0) {
            showNotification(`Found ${results.length} result(s) for "${query}"`, 'success');
        } else {
            showNotification(`No results found for "${query}"`, 'warning');
        }
        return;
    }

    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = `<p>No results found for "${query}"</p>`;
        return;
    }

    const resultsList = document.createElement('ul');
    results.forEach(result => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${result.url}">${result.title}</a>`;
        resultsList.appendChild(li);
    });

    resultsContainer.appendChild(resultsList);
}

// ====================================
// NOTIFICATION SYSTEM
// ====================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.innerHTML = `
        <div class="notification-content">
            <p>${message}</p>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        </div>
    `;

    document.body.appendChild(notification);

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        notification.remove();
    });

    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// ====================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ====================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ====================================
// KEYBOARD NAVIGATION
// ====================================

document.addEventListener('keydown', function(e) {
    // Skip search on Ctrl+F or Cmd+F
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        return;
    }

    // Alt+H to focus on hamburger menu (accessibility)
    if (e.altKey && e.key === 'h') {
        const hamburger = document.querySelector('.hamburger');
        if (hamburger) {
            hamburger.focus();
        }
    }

    // Alt+S to focus on search bar
    if (e.altKey && e.key === 's') {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }
});

// ====================================
// LAZY LOADING IMAGES
// ====================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ====================================
// INIT ON LOAD
// ====================================

window.addEventListener('load', function() {
    setupSearchBar();
});
