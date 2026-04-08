// Cart Management System

// Utility function for formatting prices
function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

// Utility function for toast notifications
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

class CartManager {
    constructor() {
        this.cart = [];
        this.promoCodes = {
            'SAVE10': { discount: 10, type: 'percentage', minAmount: 50000 },
            'SAVE20': { discount: 20, type: 'percentage', minAmount: 75000 },
            'FLAT50': { discount: 50, type: 'fixed', minAmount: 0 },
            'WELCOME': { discount: 15, type: 'percentage', minAmount: 25000 }
        };
        this.appliedPromo = null;
        this.shippingRates = {
            standard: 0,
            express: 25,
            overnight: 50
        };
        this.currentShipping = 'standard';
        this.taxRate = 0.1; // 10% tax
    }

    init() {
        this.loadCart();
        this.setupEventListeners();
        this.renderCart();
        this.updateCartCount();
        this.loadRelatedProducts();
    }

    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    // Setup event listeners
    setupEventListeners() {
        // Promo code application
        const applyPromoBtn = document.getElementById('applyPromoBtn');
        if (applyPromoBtn) {
            applyPromoBtn.addEventListener('click', () => this.applyPromoCode());
        }

        // Promo code input enter key
        const promoInput = document.getElementById('promoCode');
        if (promoInput) {
            promoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.applyPromoCode();
                }
            });
        }

        // Cart item event delegation
        document.addEventListener('click', (e) => {
            if (e.target.closest('.quantity-btn')) {
                const btn = e.target.closest('.quantity-btn');
                const cartItem = btn.closest('.cart-item');
                const index = parseInt(cartItem.dataset.index);
                const isIncrease = btn.querySelector('.fa-plus') !== null;
                this.updateQuantity(index, isIncrease ? 1 : -1);
            }
            
            if (e.target.closest('.btn-outline') && e.target.closest('.cart-item-actions')) {
                const cartItem = e.target.closest('.cart-item');
                const index = parseInt(cartItem.dataset.index);
                this.saveForLater(index);
            }
            
            if (e.target.closest('.btn-danger') && e.target.closest('.cart-item-actions')) {
                const cartItem = e.target.closest('.cart-item');
                const index = parseInt(cartItem.dataset.index);
                this.removeItem(index);
            }
        });
    }

    // Render cart items
    renderCart() {
        const cartItemsContainer = document.getElementById('cartItems');
        const emptyCartMessage = document.getElementById('emptyCart');

        if (!cartItemsContainer || !emptyCartMessage) return;

        if (this.cart.length === 0) {
            cartItemsContainer.style.display = 'none';
            emptyCartMessage.style.display = 'block';
            this.updateOrderSummary();
            return;
        }

        cartItemsContainer.style.display = 'block';
        emptyCartMessage.style.display = 'none';

        cartItemsContainer.innerHTML = '';

        this.cart.forEach((item, index) => {
            const cartItem = this.createCartItem(item, index);
            cartItemsContainer.appendChild(cartItem);
        });

        this.updateOrderSummary();
    }

    // Create cart item element
    createCartItem(item, index) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.dataset.index = index;

        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image || 'images/products/default.jpg'}" alt="${item.name}">
            </div>
            
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-description">${item.description || 'Professional painting service'}</p>
                <div class="cart-item-features">
                    ${item.features ? item.features.slice(0, 2).map(feature => `<span class="feature-tag">${feature}</span>`).join('') : ''}
                </div>
            </div>
            
            <div class="cart-item-price">
                <div class="price-display">
                    <!-- Price hidden per user request -->
                    ${item.originalPrice ? `<span class="original-price">${formatPrice(item.originalPrice)}</span>` : ''}
                </div>
            </div>
            
            <div class="cart-item-quantity">
                <div class="quantity-controls">
                    <button class="quantity-btn">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" readonly>
                    <button class="quantity-btn">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            
            <div class="cart-item-total">
                <!-- Item total hidden per user request -->
            </div>
            
            <div class="cart-item-actions">
                <button class="btn btn-outline btn-sm">
                    <i class="fas fa-heart"></i>
                    Save
                </button>
                <button class="btn btn-danger btn-sm">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        return cartItem;
    }

    // Update quantity
    updateQuantity(index, change) {
        const item = this.cart[index];
        if (!item) return;

        const newQuantity = item.quantity + change;
        
        if (newQuantity >= 1 && newQuantity <= 10) {
            item.quantity = newQuantity;
            this.saveCart();
            this.renderCart();
            this.updateCartCount();
        }
    }

    // Add to cart
    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: product.id,
                name: product.title || product.name,
                price: product.price,
                image: product.image,
                description: product.description,
                quantity: 1,
                features: product.features || []
            });
        }
        
        this.saveCart();
        this.renderCart();
        this.updateCartCount();
        showToast(`${product.title || product.name} added to cart`, 'success');
    }

    // Remove item from cart
    removeItem(index) {
        const item = this.cart[index];
        if (!item) return;

        if (confirm(`Remove "${item.name}" from your cart?`)) {
            this.cart.splice(index, 1);
            this.saveCart();
            this.renderCart();
            this.updateCartCount();
            showToast(`${item.name} removed from cart`, 'info');
        }
    }

    // Save item for later
    saveForLater(index) {
        const item = this.cart[index];
        if (!item) return;

        // Get saved items from localStorage
        let savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
        
        // Check if item is already saved
        if (!savedItems.find(saved => saved.id === item.id)) {
            savedItems.push({ ...item, savedAt: new Date().toISOString() });
            localStorage.setItem('savedItems', JSON.stringify(savedItems));
            
            this.removeItem(index);
            showToast(`${item.name} saved for later`, 'success');
        } else {
            showToast('Item already saved for later', 'info');
        }
    }

    // Update order summary
    updateOrderSummary() {
        const subtotal = this.calculateSubtotal();
        const tax = this.calculateTax(subtotal);
        const shipping = this.calculateShipping(subtotal);
        const discount = this.calculateDiscount(subtotal);
        const total = subtotal + tax + shipping - discount;

        // Update DOM elements
        this.updateElement('subtotal', formatPrice(subtotal));
        this.updateElement('tax', formatPrice(tax));
        this.updateElement('shipping', shipping === 0 ? 'FREE' : formatPrice(shipping));
        this.updateElement('discount', `-${formatPrice(discount)}`);
        this.updateElement('total', formatPrice(total));

        // Show/hide discount row
        const discountRow = document.getElementById('discountRow');
        if (discountRow) {
            discountRow.style.display = discount > 0 ? 'flex' : 'none';
        }

        // Update checkout button state
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.disabled = this.cart.length === 0;
        }
    }

    // Calculate subtotal
    calculateSubtotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Calculate tax
    calculateTax(subtotal) {
        return subtotal * this.taxRate;
    }

    // Calculate shipping
    calculateShipping(subtotal) {
        // Free shipping on orders over ₹1,000
        if (subtotal >= 1000) {
            return 0;
        }
        return this.shippingRates[this.currentShipping];
    }

    // Calculate discount
    calculateDiscount(subtotal) {
        if (!this.appliedPromo) return 0;

        const { discount, type } = this.appliedPromo;

        if (type === 'percentage') {
            return subtotal * (discount / 100);
        } else if (type === 'fixed') {
            return discount;
        }

        return 0;
    }

    // Apply promo code
    applyPromoCode() {
        const promoInput = document.getElementById('promoCode');
        const promoMessage = document.getElementById('promoMessage');
        
        if (!promoInput || !promoMessage) return;

        const code = promoInput.value.trim().toUpperCase();
        
        if (!code) {
            this.showPromoMessage('Please enter a promo code', 'error');
            return;
        }

        const promo = this.promoCodes[code];
        
        if (!promo) {
            this.showPromoMessage('Invalid promo code', 'error');
            return;
        }

        const subtotal = this.calculateSubtotal();
        
        if (subtotal < promo.minAmount) {
            this.showPromoMessage(`Minimum order amount is ${formatPrice(promo.minAmount)}`, 'error');
            return;
        }

        // Apply promo code
        this.appliedPromo = { ...promo, code };
        this.saveCart();
        this.renderCart();
        
        this.showPromoMessage(`Promo code "${code}" applied successfully!`, 'success');
        promoInput.value = '';
    }

    // Show promo message
    showPromoMessage(message, type) {
        const promoMessage = document.getElementById('promoMessage');
        if (!promoMessage) return;

        promoMessage.textContent = message;
        promoMessage.className = `promo-message ${type}`;
        
        setTimeout(() => {
            promoMessage.textContent = '';
            promoMessage.className = 'promo-message';
        }, 5000);
    }

    // Update DOM element
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    // Get cart count
    getCartCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Update cart count display
    updateCartCount() {
        const cartCountElement = document.getElementById('cartCount');
        if (cartCountElement) {
            const count = this.getCartCount();
            cartCountElement.textContent = count;
            cartCountElement.style.display = count > 0 ? 'block' : 'none';
        }
    }

    // Get cart total
    getCartTotal() {
        const subtotal = this.calculateSubtotal();
        const tax = this.calculateTax(subtotal);
        const shipping = this.calculateShipping(subtotal);
        const discount = this.calculateDiscount(subtotal);
        return subtotal + tax + shipping - discount;
    }

    // Clear cart
    clearCart() {
        if (confirm('Are you sure you want to clear your entire cart?')) {
            this.cart = [];
            this.appliedPromo = null;
            this.saveCart();
            this.renderCart();
            showToast('Cart cleared', 'info');
        }
    }

    // Load related products
    loadRelatedProducts() {
        const relatedGrid = document.getElementById('relatedProductsGrid');
        if (!relatedGrid) return;

        // Sample related products
        const relatedProducts = [
            {
                id: 101,
                title: 'Color Consultation Service',
                category: 'service',
                description: 'Professional color consultation for your painting project',
                price: 99,
                image: 'images/products/color-consultation.jpg',
                badge: 'Popular'
            },
            {
                id: 102,
                title: 'Surface Preparation',
                category: 'service',
                description: 'Professional surface preparation before painting',
                price: 149,
                image: 'images/products/surface-prep.jpg',
                badge: 'Recommended'
            },
            {
                id: 103,
                title: 'Premium Paint Upgrade',
                category: 'service',
                description: 'Upgrade to premium eco-friendly paints',
                price: 199,
                image: 'images/products/premium-paint.jpg',
                badge: 'Premium'
            },
            {
                id: 104,
                title: 'Extended Warranty',
                category: 'service',
                description: '5-year extended warranty on painting services',
                price: 79,
                image: 'images/products/warranty.jpg',
                badge: 'Value'
            }
        ];

        relatedGrid.innerHTML = '';

        relatedProducts.forEach(product => {
            const productCard = this.createRelatedProductCard(product);
            relatedGrid.appendChild(productCard);
        });
    }

    // Create related product card
    createRelatedProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card related-product';

        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}" loading="lazy">
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
                            data-product-price="${product.price}"
                            data-product-description="${product.description}"
                            data-product-image="${product.image}">
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    // Proceed to checkout
    proceedToCheckout() {
        if (this.cart.length === 0) {
            showToast('Your cart is empty', 'error');
            return;
        }

        // Check if user is logged in
        if (!auth.isLoggedIn()) {
            showToast('Please login to proceed to checkout', 'info');
            auth.showLoginModal();
            return;
        }

        // Save cart data for checkout
        const checkoutData = {
            items: this.cart,
            subtotal: this.calculateSubtotal(),
            tax: this.calculateTax(this.calculateSubtotal()),
            shipping: this.calculateShipping(this.calculateSubtotal()),
            discount: this.calculateDiscount(this.calculateSubtotal()),
            total: this.getCartTotal(),
            promoCode: this.appliedPromo?.code || null
        };

        localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
        
        // Redirect to checkout page
        window.location.href = 'checkout.html';
    }

    // Get saved items
    getSavedItems() {
        return JSON.parse(localStorage.getItem('savedItems')) || [];
    }

    // Move saved item to cart
    moveToCart(savedIndex) {
        const savedItems = this.getSavedItems();
        const item = savedItems[savedIndex];
        
        if (!item) return;

        // Remove saved property
        delete item.savedAt;
        
        // Add to cart
        this.cart.push(item);
        this.saveCart();
        this.renderCart();

        // Remove from saved items
        savedItems.splice(savedIndex, 1);
        localStorage.setItem('savedItems', JSON.stringify(savedItems));

        showToast(`${item.name} moved to cart`, 'success');
    }

    // Export cart data
    exportCart() {
        const cartData = {
            items: this.cart,
            subtotal: this.calculateSubtotal(),
            tax: this.calculateTax(this.calculateSubtotal()),
            shipping: this.calculateShipping(this.calculateSubtotal()),
            discount: this.calculateDiscount(this.calculateSubtotal()),
            total: this.getCartTotal(),
            promoCode: this.appliedPromo?.code || null,
            exportedAt: new Date().toISOString()
        };

        const dataStr = JSON.stringify(cartData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

        const exportFileDefaultName = `cart_export_${new Date().getTime()}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }
}

// Initialize cart manager
const cartManager = new CartManager();

// Global function for checkout button
window.proceedToCheckout = () => cartManager.proceedToCheckout();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartManager;
}
