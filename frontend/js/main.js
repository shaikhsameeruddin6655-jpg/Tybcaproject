// Main JavaScript File
document.addEventListener('DOMContentLoaded', function() {
    // Initialize shared data first
    initSharedData();
    
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
    
    // Fallback: try loading products again after a short delay
    setTimeout(() => {
        const productsGrid = document.getElementById('productsGrid');
        if (productsGrid && productsGrid.children.length === 0) {
            console.log('Retrying product loading...');
            loadSampleProducts();
        }
    }, 1000);
    
    // Initialize portfolio
    loadPortfolioItems();
    initPortfolioFilters();
});

function initSharedData() {
    if (window.PaintsData) {
        window.PaintsData.initProductStorage();
    }
}

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
    const itemName = product.title || product.name || 'Product';
    const cartItem = {
        id: product.id,
        name: itemName,
        title: itemName,
        price: product.price,
        image: product.image,
        quantity: product.quantity || 1
    };

    const existingProduct = cart.find(item => String(item.id) === String(product.id));

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    if (window.cartManager) {
        window.cartManager.loadCart();
        window.cartManager.renderCart();
    }

    showToast(`${itemName} added to cart!`, 'success');
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
    try {
        if (!product) {
            console.error('Product data is missing');
            return document.createElement('div');
        }
        
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.category = product.category || 'interior';
        
        // Generate features HTML if available
        const featuresHtml = product.features ? 
            `<div class="product-features">
                ${product.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
            </div>` : '';
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.title}" loading="lazy">
            ${product.badge ? `<span class="product-badge ${product.badge.toLowerCase()}">${product.badge}</span>` : ''}
            <div class="product-overlay">
                <button class="btn btn-white btn-sm quick-view" onclick="viewProduct(${product.id})">
                    <i class="fas fa-search-plus"></i> Quick View
                </button>
            </div>
        </div>
        <div class="product-info">
            <div class="product-category">
                <i class="fas fa-${getCategoryIcon(product.category)}"></i>
                ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </div>
            <h3 class="product-title">${product.title}</h3>
            <p class="product-description">${product.description}</p>
            ${featuresHtml}
            <div class="product-meta">
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(4.5)}
                    </div>
                    <span class="rating-text">(23 reviews)</span>
                </div>
                <div class="product-price">
                    <span class="price">${formatPrice(product.price)}</span>
                    <span class="price-unit">per room</span>
                </div>
            </div>
            <div class="product-actions">
                <button class="btn btn-primary add-to-cart-btn" 
                        data-product-id="${product.id}" 
                        data-product-name="${product.title}" 
                        data-product-price="${product.price}"
                        data-product-image="${product.image}"
                        data-product-description="${product.description}">
                    <i class="fas fa-shopping-cart"></i>
                    Add to Cart
                </button>
                <button class="btn btn-outline btn-sm" onclick="viewProduct(${product.id})">
                    <i class="fas fa-eye"></i>
                    Details
                </button>
            </div>
        </div>
    `;
    
    return card;
    } catch (error) {
        console.error('Error creating product card:', error);
        const errorCard = document.createElement('div');
        errorCard.className = 'product-card error';
        errorCard.innerHTML = `<p>Error loading product</p>`;
        return errorCard;
    }
}

function getCategoryIcon(category) {
    const icons = {
        'interior': 'fa-home',
        'exterior': 'fa-building',
        'commercial': 'fa-store'
    };
    return icons[category] || 'fa-paint-brush';
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function viewProduct(productId) {
    // This would typically open a product detail page or modal
    showToast(`Viewing product ${productId}`, 'info');
}

function loadSampleProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    if (!productsGrid) {
        console.error('Products grid element not found!');
        return;
    }
    
    // Clear existing content
    productsGrid.innerHTML = '';

    const storedProducts = localStorage.getItem('adminProducts') || localStorage.getItem('products');
    if (storedProducts) {
        try {
            const adminProducts = JSON.parse(storedProducts);
            if (adminProducts.length > 0) {
                adminProducts.forEach((product, index) => {
                    try {
                        const productCard = createProductCard(product);
                        productsGrid.appendChild(productCard);
                    } catch (error) {
                        console.error(`Error creating product card for ${product.title}:`, error);
                    }
                });
                return;
            }
        } catch (e) {
            console.error('Error loading admin products:', e);
        }
    }

    const sampleProducts = [
        {
            id: 1,
            title: 'Luxury Master Bedroom',
            category: 'interior',
            description: 'Elegant navy and gold accent walls with soft cream trim for sophisticated master suites',
            price: 399,
            image: 'https://picsum.photos/seed/bedroom-luxury/400/300',
            badge: 'Bestseller',
            features: ['Accent Wall', 'Premium Finish', 'Moisture Resistant']
        },
        {
            id: 2,
            title: 'Modern Gray Kitchen',
            category: 'interior',
            description: 'Contemporary gray cabinets with white subway tile backsplash for clean, modern aesthetic',
            price: 449,
            image: 'https://picsum.photos/seed/kitchen-modern/400/300',
            badge: 'New',
            features: ['Cabinet Painting', 'Backsplash', 'Easy Clean']
        },
        {
            id: 3,
            title: 'Coastal Blue Exterior',
            category: 'exterior',
            description: 'Refreshing coastal blue with white trim for beach house charm and weather protection',
            price: 899,
            image: 'https://picsum.photos/seed/house-coastal/400/300',
            badge: 'Premium',
            features: ['Weather Resistant', 'UV Protection', '10 Year Warranty']
        },
        {
            id: 4,
            title: 'Corporate Office Space',
            category: 'commercial',
            description: 'Professional navy and gray color scheme creating productive, sophisticated work environment',
            price: 599,
            image: 'https://picsum.photos/seed/office-corporate/400/300',
            badge: 'Popular',
            features: ['Low Odor', 'Quick Dry', 'Professional Grade']
        },
        {
            id: 5,
            title: 'Adventure Kids Room',
            category: 'interior',
            description: 'Vibrant mountain mural with sky blue ceiling creating imaginative play space',
            price: 299,
            image: 'https://picsum.photos/seed/kids-adventure/400/300',
            badge: 'Sale',
            features: ['Custom Mural', 'Washable Paint', 'Non-Toxic']
        },
        {
            id: 6,
            title: 'Rustic Restaurant Interior',
            category: 'commercial',
            description: 'Warm earth tones with exposed wood accents creating cozy, inviting dining atmosphere',
            price: 799,
            image: 'https://picsum.photos/seed/restaurant-rustic/400/300',
            badge: 'Featured',
            features: ['Accent Wall', 'Durability', 'Food Safe']
        },
        {
            id: 7,
            title: 'Minimalist Living Room',
            category: 'interior',
            description: 'Clean white walls with natural wood accents for bright, spacious modern living',
            price: 349,
            image: 'https://picsum.photos/seed/living-minimal/400/300',
            badge: 'Trending',
            features: ['Neutral Palette', 'Light Reflecting', 'Eco-Friendly']
        },
        {
            id: 8,
            title: 'Industrial Loft Design',
            category: 'commercial',
            description: 'Bold charcoal with exposed brick accents for trendy urban industrial spaces',
            price: 699,
            image: 'https://picsum.photos/seed/loft-industrial/400/300',
            badge: 'Urban',
            features: ['Textured Finish', 'High Traffic', 'Modern Look']
        },
        {
            id: 9,
            title: 'Traditional Colonial Exterior',
            category: 'exterior',
            description: 'Classic colonial white with black shutters maintaining timeless architectural elegance',
            price: 999,
            image: 'https://picsum.photos/seed/colonial-traditional/400/300',
            badge: 'Classic',
            features: ['Historic Colors', 'Premium Paint', '15 Year Warranty']
        }
    ];
    
    console.log('Loading sample products:', sampleProducts.length, 'items');
    
    sampleProducts.forEach((product, index) => {
        try {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
            console.log(`Product ${index + 1} loaded:`, product.title);
        } catch (error) {
            console.error(`Error creating product card for ${product.title}:`, error);
        }
    });
    
    console.log('All products loaded successfully');
}

// Portfolio Functions
function loadPortfolioItems() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    if (!portfolioGrid) return;
    
    const portfolioItems = [
        {
            id: 1,
            title: 'Modern Living Room Transformation',
            category: 'residential',
            beforeImage: 'https://picsum.photos/seed/living-before/400/300',
            afterImage: 'https://picsum.photos/seed/living-after/400/300',
            description: 'Complete living room makeover with accent walls and modern color scheme',
            client: 'Sarah Johnson',
            location: 'Mumbai, Maharashtra',
            duration: '3 days'
        },
        {
            id: 2,
            title: 'Commercial Office Renovation',
            category: 'commercial',
            beforeImage: 'https://picsum.photos/seed/office-before/400/300',
            afterImage: 'https://picsum.photos/seed/office-after/400/300',
            description: 'Professional office space with productive color psychology',
            client: 'Tech Solutions Ltd.',
            location: 'Bangalore, Karnataka',
            duration: '5 days'
        },
        {
            id: 3,
            title: 'Exterior House Makeover',
            category: 'exterior',
            beforeImage: 'https://picsum.photos/seed/house-before/400/300',
            afterImage: 'https://picsum.photos/seed/house-after/400/300',
            description: 'Complete exterior transformation with weather-resistant premium paint',
            client: 'Rajesh Kumar',
            location: 'Delhi NCR',
            duration: '7 days'
        },
        {
            id: 4,
            title: 'Master Bedroom Elegance',
            category: 'residential',
            beforeImage: 'https://picsum.photos/seed/bedroom-before/400/300',
            afterImage: 'https://picsum.photos/seed/bedroom-after/400/300',
            description: 'Luxurious master bedroom with sophisticated color palette',
            client: 'Priya Sharma',
            location: 'Pune, Maharashtra',
            duration: '2 days'
        },
        {
            id: 5,
            title: 'Restaurant Interior Design',
            category: 'commercial',
            beforeImage: 'https://picsum.photos/seed/restaurant-before/400/300',
            afterImage: 'https://picsum.photos/seed/restaurant-after/400/300',
            description: 'Cozy restaurant atmosphere with warm, inviting colors',
            client: 'The Garden Cafe',
            location: 'Hyderabad, Telangana',
            duration: '4 days'
        },
        {
            id: 6,
            title: 'Kids Room Adventure',
            category: 'residential',
            beforeImage: 'https://picsum.photos/seed/kids-before/400/300',
            afterImage: 'https://picsum.photos/seed/kids-after/400/300',
            description: 'Creative kids room with custom mural and playful design',
            client: 'Amit Patel',
            location: 'Ahmedabad, Gujarat',
            duration: '3 days'
        }
    ];
    
    portfolioGrid.innerHTML = '';
    
    portfolioItems.forEach(item => {
        const portfolioCard = createPortfolioCard(item);
        portfolioGrid.appendChild(portfolioCard);
    });
}

function createPortfolioCard(item) {
    const card = document.createElement('div');
    card.className = 'portfolio-card';
    card.dataset.category = item.category;
    
    card.innerHTML = `
        <div class="portfolio-images">
            <div class="image-comparison">
                <div class="before-image">
                    <img src="${item.beforeImage}" alt="Before">
                    <span class="image-label">Before</span>
                </div>
                <div class="after-image">
                    <img src="${item.afterImage}" alt="After">
                    <span class="image-label">After</span>
                </div>
            </div>
        </div>
        <div class="portfolio-content">
            <h3 class="portfolio-title">${item.title}</h3>
            <p class="portfolio-description">${item.description}</p>
            <div class="portfolio-meta">
                <div class="meta-item">
                    <i class="fas fa-user"></i>
                    <span>${item.client}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${item.location}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-clock"></i>
                    <span>${item.duration}</span>
                </div>
            </div>
            <div class="portfolio-actions">
                <button class="btn btn-outline btn-sm" onclick="viewPortfolioDetails(${item.id})">
                    <i class="fas fa-expand"></i>
                    View Details
                </button>
                <button class="btn btn-primary btn-sm" onclick="getSimilarQuote('${item.category}')">
                    <i class="fas fa-quote-right"></i>
                    Get Similar Quote
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.portfolio-filter');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter cards
            portfolioCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.add('visible'), 10);
                } else {
                    card.classList.remove('visible');
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });
}

function viewPortfolioDetails(portfolioId) {
    showToast(`Viewing portfolio details for project ${portfolioId}`, 'info');
}

function getSimilarQuote(category) {
    showToast(`Getting quote for ${category} project...`, 'info');
    setTimeout(() => {
        window.location.href = 'estimate-calculator.html';
    }, 1000);
}

