// Products Management System
class ProductsSystem {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentCategory = 'all';
        this.currentSearch = '';
        this.sortBy = 'popularity';
        this.init();
    }

    init() {
        this.loadProducts();
        this.setupEventListeners();
        this.renderProducts();
    }

    // Load products from data or API
    loadProducts() {
        // Sample product data - in production, this would come from an API
        this.products = [
            {
                id: 1,
                title: 'Elegant Bedroom Interior',
                category: 'interior',
                description: 'Sophisticated color palette for master bedrooms with accent walls featuring warm neutrals and soft pastels.',
                price: 25000,  // Bedroom interior - reasonable pricing
                originalPrice: 35000,
                image: 'images/products/bedroom-elegant.jpg',
                images: [
                    'images/products/bedroom-elegant-1.jpg',
                    'images/products/bedroom-elegant-2.jpg',
                    'images/products/bedroom-elegant-3.jpg'
                ],
                badge: 'Bestseller',
                rating: 4.8,
                reviews: 124,
                features: ['Premium Quality Paint', 'Color Consultation', '3-Year Warranty'],
                inStock: true,
                popularity: 95
            },
            {
                id: 2,
                title: 'Modern Kitchen Design',
                category: 'interior',
                description: 'Fresh and clean look for modern kitchen spaces with contemporary color schemes and durable finishes.',
                price: 30000,  // Kitchen - higher due to moisture resistance needs
                originalPrice: 42000,
                image: 'images/products/kitchen-modern.jpg',
                images: [
                    'images/products/kitchen-modern-1.jpg',
                    'images/products/kitchen-modern-2.jpg'
                ],
                badge: 'New',
                rating: 4.6,
                reviews: 89,
                features: ['Moisture Resistant', 'Easy Clean Surface', 'Modern Color Palette'],
                inStock: true,
                popularity: 88
            },
            {
                id: 3,
                title: 'Exterior House Makeover',
                category: 'exterior',
                description: 'Complete exterior transformation with weather-resistant paints and professional application.',
                price: 75000,  // Exterior - premium pricing for full house exterior
                originalPrice: 95000,
                image: 'images/products/house-exterior.jpg',
                images: [
                    'images/products/house-exterior-1.jpg',
                    'images/products/house-exterior-2.jpg',
                    'images/products/house-exterior-3.jpg'
                ],
                badge: 'Premium',
                rating: 4.9,
                reviews: 203,
                features: ['Weather Protection', '10-Year Warranty', 'Free Color Consultation'],
                inStock: true,
                popularity: 92
            },
            {
                id: 4,
                title: 'Office Interior Professional',
                category: 'commercial',
                description: 'Professional color scheme for productive work environments with employee wellbeing in mind.',
                price: 45000,  // Office interior - commercial pricing
                originalPrice: 60000,
                image: 'images/products/office-commercial.jpg',
                images: [
                    'images/products/office-commercial-1.jpg',
                    'images/products/office-commercial-2.jpg'
                ],
                badge: 'Popular',
                rating: 4.7,
                reviews: 156,
                features: ['Productivity Colors', 'Low VOC', 'Quick Drying'],
                inStock: true,
                popularity: 85
            },
            {
                id: 5,
                title: 'Kids Room Fun Design',
                category: 'interior',
                description: 'Colorful and creative designs for children\'s spaces with safe, non-toxic paints.',
                price: 20000,  // Kids room - smaller space, lower price
                originalPrice: 28000,
                image: 'images/products/kids-room.jpg',
                images: [
                    'images/products/kids-room-1.jpg',
                    'images/products/kids-room-2.jpg',
                    'images/products/kids-room-3.jpg'
                ],
                badge: 'Sale',
                rating: 4.5,
                reviews: 98,
                features: ['Child-Safe Paints', 'Washable Finish', 'Fun Themes Available'],
                inStock: true,
                popularity: 78
            },
            {
                id: 6,
                title: 'Restaurant Interior',
                category: 'commercial',
                description: 'Appetizing color schemes for dining establishments that enhance the dining experience.',
                price: 55000,  // Restaurant - commercial space pricing
                originalPrice: 70000,
                image: 'images/products/restaurant-interior.jpg',
                images: [
                    'images/products/restaurant-interior-1.jpg',
                    'images/products/restaurant-interior-2.jpg'
                ],
                badge: 'Featured',
                rating: 4.8,
                reviews: 67,
                features: ['Appetite-Enhancing Colors', 'Durable Finish', 'Custom Branding'],
                inStock: true,
                popularity: 82
            },
            {
                id: 7,
                title: 'Luxury Living Room',
                category: 'interior',
                description: 'High-end painting solutions for luxury living spaces with premium materials and finishes.',
                price: 40000,  // Living room - standard interior pricing
                originalPrice: 52000,
                image: 'images/products/living-luxury.jpg',
                images: [
                    'images/products/living-luxury-1.jpg',
                    'images/products/living-luxury-2.jpg'
                ],
                badge: 'Luxury',
                rating: 4.9,
                reviews: 143,
                features: ['Premium Materials', 'Custom Finishes', 'Designer Consultation'],
                inStock: true,
                popularity: 90
            },
            {
                id: 8,
                title: 'Industrial Exterior',
                category: 'exterior',
                description: 'Durable and rugged painting solutions for industrial buildings and warehouses.',
                price: 85000,  // Industrial exterior - specialized pricing
                originalPrice: 110000,
                image: 'images/products/industrial-exterior.jpg',
                images: [
                    'images/products/industrial-exterior-1.jpg',
                    'images/products/industrial-exterior-2.jpg'
                ],
                badge: 'Heavy Duty',
                rating: 4.6,
                reviews: 45,
                features: ['Industrial Grade', 'Chemical Resistant', '15-Year Warranty'],
                inStock: true,
                popularity: 70
            }
        ];

        this.filteredProducts = [...this.products];
    }

    // Setup event listeners
    setupEventListeners() {
        // Category filters
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterByCategory(e.target.dataset.category);
                this.updateActiveFilter(e.target);
            });
        });

        // Search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchProducts(e.target.value);
            });
        }

        // Sort
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortProducts(e.target.value);
            });
        }

        // Load more
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreProducts();
            });
        }
    }

    // Filter products by category
    filterByCategory(category) {
        this.currentCategory = category;
        this.applyFilters();
    }

    // Search products
    searchProducts(query) {
        this.currentSearch = query.toLowerCase();
        this.applyFilters();
    }

    // Sort products
    sortProducts(sortBy) {
        this.sortBy = sortBy;
        this.applyFilters();
    }

    // Apply all filters
    applyFilters() {
        let filtered = [...this.products];

        // Category filter
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(product => product.category === this.currentCategory);
        }

        // Search filter
        if (this.currentSearch) {
            filtered = filtered.filter(product => 
                product.title.toLowerCase().includes(this.currentSearch) ||
                product.description.toLowerCase().includes(this.currentSearch) ||
                product.category.toLowerCase().includes(this.currentSearch)
            );
        }

        // Sort
        switch (this.sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'popularity':
            default:
                filtered.sort((a, b) => b.popularity - a.popularity);
                break;
        }

        this.filteredProducts = filtered;
        this.renderProducts();
    }

    // Render products
    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        productsGrid.innerHTML = '';

        this.filteredProducts.forEach((product, index) => {
            const productCard = this.createProductCard(product);
            productCard.style.animationDelay = `${index * 0.1}s`;
            productsGrid.appendChild(productCard);
        });

        // Update load more button
        this.updateLoadMoreButton();
    }

    // Create product card element
    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.category = product.category;
        card.dataset.productId = product.id;

        const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}" loading="lazy">
                ${product.badge ? `<span class="product-badge ${product.badge.toLowerCase()}">${product.badge}</span>` : ''}
                ${discount > 0 ? `<span class="product-badge discount">-${discount}%</span>` : ''}
                <div class="product-overlay">
                    <button class="btn btn-primary quick-view-btn" onclick="products.showQuickView(${product.id})">
                        <i class="fas fa-eye"></i>
                        Quick View
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div>
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                
                <div class="product-rating">
                    <div class="stars">
                        ${this.generateStars(product.rating)}
                    </div>
                    <span class="rating-text">(${product.reviews} reviews)</span>
                </div>
                
                <div class="product-price">
                    <span class="price">${formatPrice(product.price)}</span>
                    ${product.originalPrice ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ''}
                </div>
                
                <div class="product-features">
                    ${product.features.slice(0, 2).map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
                
                <div class="product-actions">
                    <button class="btn btn-primary add-to-cart-btn" 
                            data-product-id="${product.id}" 
                            data-product-name="${product.title}" 
                            data-product-price="${product.price}">
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                    <button class="btn btn-outline" onclick="products.showProductDetail(${product.id})">
                        <i class="fas fa-info-circle"></i>
                        Details
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    // Generate star rating HTML
    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        let stars = '';
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        if (halfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }

        return stars;
    }

    // Show product detail modal
    showProductDetail(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const detailContent = `
            <div class="product-detail">
                <div class="product-detail-grid">
                    <div class="product-images">
                        <div class="main-image">
                            <img src="${product.image}" alt="${product.title}" id="mainProductImage">
                        </div>
                        <div class="image-thumbnails">
                            ${product.images.map((img, index) => `
                                <img src="${img}" alt="${product.title} ${index + 1}" 
                                     class="thumbnail ${index === 0 ? 'active' : ''}"
                                     onclick="products.changeMainImage('${img}', this)">
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="product-info-detail">
                        <div class="product-badges">
                            ${product.badge ? `<span class="product-badge ${product.badge.toLowerCase()}">${product.badge}</span>` : ''}
                        </div>
                        
                        <h2 class="product-title-detail">${product.title}</h2>
                        
                        <div class="product-rating-detail">
                            <div class="stars">
                                ${this.generateStars(product.rating)}
                            </div>
                            <span class="rating-text">${product.rating} (${product.reviews} reviews)</span>
                        </div>
                        
                        <div class="product-price-detail">
                            <span class="price">${formatPrice(product.price)}</span>
                            ${product.originalPrice ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ''}
                        </div>
                        
                        <div class="product-description-detail">
                            <h4>Description</h4>
                            <p>${product.description}</p>
                        </div>
                        
                        <div class="product-features-detail">
                            <h4>Features</h4>
                            <ul>
                                ${product.features.map(feature => `<li><i class="fas fa-check text-success"></i> ${feature}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="product-category-detail">
                            <span class="category-tag">${product.category}</span>
                            ${product.inStock ? '<span class="stock-tag in-stock">In Stock</span>' : '<span class="stock-tag out-of-stock">Out of Stock</span>'}
                        </div>
                        
                        <div class="product-actions-detail">
                            <div class="quantity-selector">
                                <button class="quantity-btn" onclick="products.updateQuantity(-1)">-</button>
                                <input type="number" id="quantityInput" value="1" min="1" max="10" readonly>
                                <button class="quantity-btn" onclick="products.updateQuantity(1)">+</button>
                            </div>
                            
                            <button class="btn btn-primary btn-large add-to-cart-detail-btn" 
                                    data-product-id="${product.id}" 
                                    data-product-name="${product.title}" 
                                    data-product-price="${product.price}">
                                <i class="fas fa-shopping-cart"></i>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        openModal(detailContent, product.title);
        this.setupProductDetailEvents();
    }

    // Show quick view modal
    showQuickView(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const quickViewContent = `
            <div class="quick-view">
                <div class="quick-view-grid">
                    <div class="quick-view-image">
                        <img src="${product.image}" alt="${product.title}">
                    </div>
                    <div class="quick-view-info">
                        <h3>${product.title}</h3>
                        <div class="stars">${this.generateStars(product.rating)}</div>
                        <div class="price">${formatPrice(product.price)}</div>
                        <p>${product.description}</p>
                        <button class="btn btn-primary w-full" 
                                data-product-id="${product.id}" 
                                data-product-name="${product.title}" 
                                data-product-price="${product.price}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;

        openModal(quickViewContent, 'Quick View');
    }

    // Change main product image
    changeMainImage(imageSrc, thumbnail) {
        const mainImage = document.getElementById('mainProductImage');
        if (mainImage) {
            mainImage.src = imageSrc;
        }

        // Update active thumbnail
        document.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.classList.remove('active');
        });
        thumbnail.classList.add('active');
    }

    // Update quantity selector
    updateQuantity(change) {
        const input = document.getElementById('quantityInput');
        if (!input) return;

        let currentValue = parseInt(input.value);
        let newValue = currentValue + change;

        if (newValue >= 1 && newValue <= 10) {
            input.value = newValue;
        }
    }

    // Setup product detail events
    setupProductDetailEvents() {
        // Add to cart buttons
        const addToCartBtns = document.querySelectorAll('.add-to-cart-detail-btn, .quick-view .btn-primary');
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('button').dataset.productId;
                const productName = e.target.closest('button').dataset.productName;
                const productPrice = parseFloat(e.target.closest('button').dataset.productPrice);
                const quantity = parseInt(document.getElementById('quantityInput')?.value || 1);

                for (let i = 0; i < quantity; i++) {
                    addToCart({
                        id: productId,
                        name: productName,
                        price: productPrice,
                        quantity: 1
                    });
                }

                closeModal();
                showToast(`${quantity} × ${productName} added to cart!`, 'success');
            });
        });
    }

    // Update active filter button
    updateActiveFilter(activeBtn) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    // Update load more button
    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (!loadMoreBtn) return;

        if (this.filteredProducts.length < 8) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }

    // Load more products (simulation)
    loadMoreProducts() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.innerHTML = '<span class="spinner"></span> Loading...';
            loadMoreBtn.disabled = true;
        }

        // Simulate API call
        setTimeout(() => {
            // Add more products (in production, this would be an API call)
            const newProducts = [
                {
                    id: Date.now(),
                    title: 'Additional Design Service',
                    category: 'interior',
                    description: 'More painting design services for your spaces.',
                    price: 15000,  // Additional design service - reasonable add-on price
                    image: 'images/products/additional-1.jpg',
                    badge: 'New',
                    rating: 4.4,
                    reviews: 12,
                    features: ['Professional Service', 'Quality Materials'],
                    inStock: true,
                    popularity: 65
                }
            ];

            this.products.push(...newProducts);
            this.applyFilters();

            if (loadMoreBtn) {
                loadMoreBtn.innerHTML = 'Load More Products';
                loadMoreBtn.disabled = false;
            }

            showToast('More products loaded!', 'success');
        }, 1500);
    }

    // Get product by ID
    getProductById(productId) {
        return this.products.find(p => p.id === productId);
    }

    // Get related products
    getRelatedProducts(productId, limit = 4) {
        const product = this.getProductById(productId);
        if (!product) return [];

        return this.products
            .filter(p => p.id !== productId && p.category === product.category)
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, limit);
    }
}

// Initialize products system
const products = new ProductsSystem();

// Make addToCart function available globally
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
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

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductsSystem;
}
