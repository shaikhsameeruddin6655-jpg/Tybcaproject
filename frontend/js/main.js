// Main JavaScript File
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavigation();
    initScrollEffects();
    initAnimations();
    initModals();
    initForms();
    initFilters();
    initSearch();
    initFAQ();
    initCart();
    initCartSystem();
    initThemeSystem();
    initProductFilters();
    initMobileMenu();
    
    // Initialize cart count
    updateCartCount();
    
    // Initialize load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.innerHTML = '<span class="spinner"></span> Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                loadMoreProducts();
                this.innerHTML = 'Load More Products';
                this.disabled = false;
            }, 1500);
        });
    }
    
    // Initialize sample products
    loadSampleProducts();
});

// Navigation System
function initNavigation() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-container') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });

    // Smooth scrolling for navigation links
    function smoothScroll(target) {
        const element = document.querySelector(target);
        if (element) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = element.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Desktop navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                smoothScroll(href);
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Close mobile menu
                navMenu.classList.remove('active');
                mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });

    // Mobile navigation
    mobileNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                smoothScroll(href);
                
                // Update active state
                mobileNavItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Update active navigation on scroll
    function updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });

                mobileNavItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavigation);
}

// Scroll Effects
function initScrollEffects() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;

        // Header background on scroll
        if (currentScrollY > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = 'var(--shadow-md)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }

        // Hide/show header on scroll (mobile only)
        if (window.innerWidth <= 768) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }

        lastScrollY = currentScrollY;
    });
}

// Animations
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.product-card, .service-card, .testimonial-card, .faq-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Counter animation for statistics (if added later)
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }
}

// Modal System
function initModals() {
    const modalContainer = document.getElementById('modalContainer');
    
    window.openModal = function(content, title = '') {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    <button class="modal-close" onclick="closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        
        modalContainer.appendChild(modal);
        
        // Trigger animation
        setTimeout(() => modal.classList.add('active'), 10);
        
        // Close on background click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        });
    };
    
    window.closeModal = function() {
        const modal = modalContainer.querySelector('.modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    };
}

// Form Validation
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(form)) {
                submitForm(form);
            }
        });
    });
    
    // Real-time validation
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name || field.id;
    let error = '';
    
    // Required validation
    if (field.hasAttribute('required') && !value) {
        error = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            error = 'Please enter a valid email address';
        }
    }
    
    // Password validation
    if (field.type === 'password' && value) {
        if (value.length < 8) {
            error = 'Password must be at least 8 characters long';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value) || value.length < 10) {
            error = 'Please enter a valid phone number';
        }
    }
    
    if (error) {
        showFieldError(field, error);
        return false;
    } else {
        clearFieldError(field);
        return true;
    }
}

function showFieldError(field, error) {
    clearFieldError(field);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    errorElement.textContent = error;
    
    field.parentNode.appendChild(errorElement);
    field.classList.add('error');
}

function clearFieldError(field) {
    const errorElement = field.parentNode.querySelector('.form-error');
    if (errorElement) {
        errorElement.remove();
    }
    field.classList.remove('error');
}

function submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="spinner"></span> Processing...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showToast('Form submitted successfully!', 'success');
        
        // Close modal if in modal
        closeModal();
    }, 2000);
}

// Product Filters
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            const icon = question.querySelector('i');
            
            // Close other items
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    const otherItem = otherQuestion.parentElement;
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherQuestion.querySelector('i');
                    
                    otherItem.classList.remove('active');
                    otherAnswer.style.maxHeight = '0';
                    otherIcon.style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle current item
            faqItem.classList.toggle('active');
            if (faqItem.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
            } else {
                answer.style.maxHeight = '0';
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const contactData = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };
            
            // Validate form
            if (!contactData.name || !contactData.email || !contactData.phone || !contactData.subject || !contactData.message) {
                showToast('Please fill in all required fields', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(contactData.email)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }
            
            // Phone validation (Indian phone numbers)
            const phoneRegex = /^[+]?[91]?[6-9]\d{9}$/;
            if (!phoneRegex.test(contactData.phone.replace(/\s/g, ''))) {
                showToast('Please enter a valid phone number', 'error');
                return;
            }
            
            // Simulate form submission
            showToast('Sending your message...', 'info');
            
            setTimeout(() => {
                // Save to localStorage (in production, this would be sent to server)
                let contactMessages = JSON.parse(localStorage.getItem('contactMessages')) || [];
                contactMessages.push({
                    ...contactData,
                    id: Date.now(),
                    timestamp: new Date().toISOString(),
                    status: 'pending'
                });
                localStorage.setItem('contactMessages', JSON.stringify(contactMessages));
                
                // Reset form
                contactForm.reset();
                
                // Show success message
                showToast('Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
                
                // Show confirmation modal
                const confirmationContent = `
                    <div class="contact-confirmation">
                        <div class="confirmation-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h3>Message Received!</h3>
                        <p>Thank you for contacting Paints Works. We have received your message and will respond within 24 hours.</p>
                        <div class="confirmation-details">
                            <p><strong>Reference ID:</strong> #${Date.now()}</p>
                            <p><strong>Contact:</strong> ${contactData.phone}</p>
                            <p><strong>Email:</strong> ${contactData.email}</p>
                        </div>
                        <button class="btn btn-primary" onclick="closeModal()">Got it!</button>
                    </div>
                `;
                
                openModal(confirmationContent, 'Confirmation');
            }, 1500);
        });
    }
}

// Search Functionality
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const productCards = document.querySelectorAll('.product-card');
    
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.toLowerCase().trim();
            
            searchTimeout = setTimeout(() => {
                productCards.forEach(card => {
                    const title = card.querySelector('.product-title').textContent.toLowerCase();
                    const description = card.querySelector('.product-description').textContent.toLowerCase();
                    const category = card.querySelector('.product-category').textContent.toLowerCase();
                    
                    if (query === '' || title.includes(query) || description.includes(query) || category.includes(query)) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            }, 300);
        });
    }
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Cart System
function initCart() {
    updateCartCount();
    
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-cart-btn')) {
            const btn = e.target.closest('.add-to-cart-btn');
            const productId = btn.dataset.productId;
            const productName = btn.dataset.productName;
            const productPrice = btn.dataset.productPrice;
            
            addToCart({
                id: productId,
                name: productName,
                price: parseFloat(productPrice),
                quantity: 1
            });
        }
    });
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists
    const existingProduct = cart.find(item => item.id === product.id);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Also update cart manager if it exists
    if (window.cartManager) {
        window.cartManager.loadCart();
        window.cartManager.renderCart();
    }
    
    showToast(`${product.name} added to cart!`, 'success');
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = totalItems > 0 ? 'block' : 'none';
    }
    
    // Update badge if it exists
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
        badge.textContent = totalItems > 99 ? '99+' : totalItems;
        badge.style.display = totalItems > 0 ? 'block' : 'none';
    });
}

// Toast Notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    } else {
        // If section doesn't exist on current page, navigate to index.html
        if (sectionId && window.location.pathname !== '/') {
            window.location.href = `index.html#${sectionId}`;
        }
    }
}

// Initialize cart count on page load
updateCartCount();

function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Load More Products
function loadMoreProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const currentProducts = productsGrid.children.length;
    
    // Sample additional products
    const newProducts = [
        {
            id: currentProducts + 1,
            title: 'Modern Living Room Design',
            category: 'interior',
            description: 'Contemporary color scheme for modern living spaces',
            price: 299,
            image: 'images/product-living.jpg',
            badge: 'Popular'
        },
        {
            id: currentProducts + 2,
            title: 'Exterior Protection Coating',
            category: 'exterior',
            description: 'Weather-resistant coating for long-lasting protection',
            price: 599,
            image: 'images/product-exterior.jpg',
            badge: 'Premium'
        }
    ];
    
    newProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
    
    showToast('More products loaded!', 'success');
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.category = product.category;
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.title}">
            ${product.badge ? `<span class="product-badge ${product.badge.toLowerCase()}">${product.badge}</span>` : ''}
        </div>
        <div class="product-info">
            <div class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div>
            <h3 class="product-title">${product.title}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">
                <span class="price">${formatPrice(product.price)}</span>
            </div>
            <div class="product-actions">
                <button class="btn btn-primary add-to-cart-btn" 
                        data-product-id="${product.id}" 
                        data-product-name="${product.title}" 
                        data-product-price="${product.price}">
                    <i class="fas fa-shopping-cart"></i>
                    Add to Cart
                </button>
                <button class="btn btn-outline" onclick="viewProduct(${product.id})">
                    <i class="fas fa-eye"></i>
                    View
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function viewProduct(productId) {
    // This would typically open a product detail page or modal
    showToast(`Viewing product ${productId}`, 'info');
}

function loadSampleProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    const sampleProducts = [
        {
            id: 1,
            title: 'Elegant Bedroom Interior',
            category: 'interior',
            description: 'Sophisticated color palette for master bedrooms with accent walls',
            price: 399,
            image: 'images/bedroom-interior.jpg',
            badge: 'Bestseller'
        },
        {
            id: 2,
            title: 'Modern Kitchen Design',
            category: 'interior',
            description: 'Fresh and clean look for modern kitchen spaces',
            price: 449,
            image: 'images/kitchen-modern.jpg',
            badge: 'New'
        },
        {
            id: 3,
            title: 'Exterior House Makeover',
            category: 'exterior',
            description: 'Complete exterior transformation with weather-resistant paints',
            price: 899,
            image: 'images/house-exterior.jpg',
            badge: 'Premium'
        },
        {
            id: 4,
            title: 'Office Interior Professional',
            category: 'commercial',
            description: 'Professional color scheme for productive work environments',
            price: 599,
            image: 'images/office-commercial.jpg',
            badge: 'Popular'
        },
        {
            id: 5,
            title: 'Kids Room Fun Design',
            category: 'interior',
            description: 'Colorful and creative designs for children\'s spaces',
            price: 299,
            image: 'images/kids-room.jpg',
            badge: 'Sale'
        },
        {
            id: 6,
            title: 'Restaurant Interior',
            category: 'commercial',
            description: 'Appetizing color schemes for dining establishments',
            price: 799,
            image: 'images/restaurant-interior.jpg',
            badge: 'Featured'
        }
    ];
    
    sampleProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Initialize auth system
const auth = new AuthSystem();
