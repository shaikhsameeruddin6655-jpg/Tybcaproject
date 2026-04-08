// Checkout Management System

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

// Utility function for opening modals
function openModal(content, title = '') {
    const modalContainer = document.getElementById('modalContainer');
    if (!modalContainer) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal()"></div>
        <div class="modal-content">
            ${title ? `<div class="modal-header"><h3>${title}</h3><button class="modal-close" onclick="closeModal()">&times;</button></div>` : ''}
            <div class="modal-body">${content}</div>
        </div>
    `;
    modalContainer.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// Utility function for closing modals
function closeModal() {
    const modalContainer = document.getElementById('modalContainer');
    const modal = modalContainer.querySelector('.modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

class CheckoutManager {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.checkoutData = null;
        this.formData = {};
        this.init();
    }

    init() {
        this.loadCheckoutData();
        this.setupEventListeners();
        this.renderOrderSummary();
        this.updateProgress();
        this.prefillUserInfo();
    }

    // Load checkout data from localStorage
    loadCheckoutData() {
        const savedData = localStorage.getItem('checkoutData');
        if (savedData) {
            this.checkoutData = JSON.parse(savedData);
        } else {
            // Redirect to cart if no checkout data
            showToast('No items in cart. Redirecting to cart...', 'info');
            setTimeout(() => {
                window.location.href = 'cart.html';
            }, 2000);
            return;
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Form submission
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }

        // Payment method selection
        const paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');
        paymentOptions.forEach(option => {
            option.addEventListener('change', (e) => {
                this.switchPaymentMethod(e.target.value);
            });
        });

        // Billing address toggle
        const sameAsShipping = document.getElementById('sameAsShipping');
        if (sameAsShipping) {
            sameAsShipping.addEventListener('change', (e) => {
                this.toggleBillingAddress(!e.target.checked);
            });
        }

        // Card number formatting
        const cardNumber = document.getElementById('cardNumber');
        if (cardNumber) {
            cardNumber.addEventListener('input', (e) => {
                this.formatCardNumber(e.target);
            });
        }

        // Card expiry formatting
        const cardExpiry = document.getElementById('cardExpiry');
        if (cardExpiry) {
            cardExpiry.addEventListener('input', (e) => {
                this.formatCardExpiry(e.target);
            });
        }

        // CVV input validation
        const cardCvv = document.getElementById('cardCvv');
        if (cardCvv) {
            cardCvv.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
            });
        }

        // Navigation buttons
        this.setupNavigationButtons();

        // Promo code in sidebar
        const sidebarApplyPromo = document.getElementById('sidebarApplyPromo');
        if (sidebarApplyPromo) {
            sidebarApplyPromo.addEventListener('click', () => {
                this.applySidebarPromoCode();
            });
        }

        const sidebarPromoCode = document.getElementById('sidebarPromoCode');
        if (sidebarPromoCode) {
            sidebarPromoCode.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.applySidebarPromoCode();
                }
            });
        }
    }

    // Setup navigation buttons
    setupNavigationButtons() {
        // Add navigation buttons to each step
        const steps = document.querySelectorAll('.checkout-step');
        steps.forEach((step, index) => {
            const stepNumber = index + 1;
            
            // Add continue button to all steps except the last
            if (stepNumber < this.totalSteps) {
                const continueBtn = document.createElement('button');
                continueBtn.type = 'button';
                continueBtn.className = 'btn btn-primary continue-btn';
                continueBtn.innerHTML = `Continue <i class="fas fa-arrow-right"></i>`;
                continueBtn.onclick = () => this.nextStep();
                step.appendChild(continueBtn);
            }
            
            // Add back button to all steps except the first
            if (stepNumber > 1) {
                const backBtn = document.createElement('button');
                backBtn.type = 'button';
                backBtn.className = 'btn btn-outline back-btn';
                backBtn.innerHTML = `<i class="fas fa-arrow-left"></i> Back`;
                backBtn.onclick = () => this.previousStep();
                step.insertBefore(backBtn, step.firstChild);
            }
        });
    }

    // Switch payment method
    switchPaymentMethod(method) {
        const paymentForms = document.querySelectorAll('.payment-form');
        const paymentOptions = document.querySelectorAll('.payment-option');

        // Hide all payment forms
        paymentForms.forEach(form => {
            form.classList.remove('active');
        });

        // Remove active class from all options
        paymentOptions.forEach(option => {
            option.classList.remove('active');
        });

        // Show selected payment form and mark option as active
        const selectedForm = document.getElementById(`${method}PaymentForm`);
        const selectedOption = document.querySelector(`[data-method="${method}"]`);

        if (selectedForm) {
            selectedForm.classList.add('active');
        }
        
        if (selectedOption) {
            selectedOption.classList.add('active');
        }
    }

    // Toggle billing address fields
    toggleBillingAddress(show) {
        const billingFields = document.getElementById('billingFields');
        if (billingFields) {
            billingFields.style.display = show ? 'block' : 'none';
        }
    }

    // Format card number
    formatCardNumber(input) {
        let value = input.value.replace(/\s/g, '');
        let formattedValue = '';
        
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        
        input.value = formattedValue;
    }

    // Format card expiry
    formatCardExpiry(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length >= 2) {
            formattedValue = value.slice(0, 2) + '/' + value.slice(2, 4);
        } else {
            formattedValue = value;
        }
        
        input.value = formattedValue;
    }

    // Navigate to next step
    nextStep() {
        if (this.validateCurrentStep()) {
            this.saveCurrentStepData();
            
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.showStep(this.currentStep);
                this.updateProgress();
            }
        }
    }

    // Navigate to previous step
    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showStep(this.currentStep);
            this.updateProgress();
        }
    }

    // Show specific step
    showStep(stepNumber) {
        const steps = document.querySelectorAll('.checkout-step');
        
        steps.forEach((step, index) => {
            if (index + 1 === stepNumber) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Scroll to top of form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update progress indicators
    updateProgress() {
        const progressSteps = document.querySelectorAll('.progress-step');
        
        progressSteps.forEach((step, index) => {
            const stepNumber = index + 1;
            
            if (stepNumber < this.currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (stepNumber === this.currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }

    // Validate current step
    validateCurrentStep() {
        const currentStepElement = document.querySelector('.checkout-step.active');
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        
        for (let field of requiredFields) {
            if (!field.value.trim()) {
                field.focus();
                showToast(`Please fill in ${field.name.replace(/([A-Z])/g, ' $1').trim()}`, 'error');
                return false;
            }
            
            // Email validation
            if (field.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    field.focus();
                    showToast('Please enter a valid email address', 'error');
                    return false;
                }
            }
            
            // Phone validation
            if (field.type === 'tel') {
                const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                if (!phoneRegex.test(field.value) || field.value.replace(/\D/g, '').length < 10) {
                    field.focus();
                    showToast('Please enter a valid phone number', 'error');
                    return false;
                }
            }
        }

        // Additional validations for specific steps
        if (this.currentStep === 3) {
            return this.validatePaymentStep();
        }

        if (this.currentStep === 4) {
            return this.validateReviewStep();
        }

        return true;
    }

    // Validate payment step
    validatePaymentStep() {
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
        
        if (!paymentMethod) {
            showToast('Please select a payment method', 'error');
            return false;
        }

        if (paymentMethod === 'card') {
            const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
            const cardExpiry = document.getElementById('cardExpiry').value;
            const cardCvv = document.getElementById('cardCvv').value;
            const cardName = document.getElementById('cardName').value;

            if (cardNumber.length < 13 || cardNumber.length > 19) {
                showToast('Please enter a valid card number', 'error');
                return false;
            }

            if (!cardExpiry.match(/^\d{2}\/\d{2}$/)) {
                showToast('Please enter a valid expiry date (MM/YY)', 'error');
                return false;
            }

            if (cardCvv.length < 3 || cardCvv.length > 4) {
                showToast('Please enter a valid CVV', 'error');
                return false;
            }

            if (!cardName.trim()) {
                showToast('Please enter the name on the card', 'error');
                return false;
            }
        }

        return true;
    }

    // Validate review step
    validateReviewStep() {
        const agreeTerms = document.getElementById('agreeTerms').checked;
        const agreeService = document.getElementById('agreeService').checked;

        if (!agreeTerms) {
            showToast('Please agree to the Terms of Service', 'error');
            return false;
        }

        if (!agreeService) {
            showToast('Please acknowledge the service agreement', 'error');
            return false;
        }

        return true;
    }

    // Save current step data
    saveCurrentStepData() {
        const currentStepElement = document.querySelector('.checkout-step.active');
        const formData = new FormData(currentStepElement);
        
        for (let [key, value] of formData.entries()) {
            this.formData[key] = value;
        }
    }

    // Render order summary
    renderOrderSummary() {
        if (!this.checkoutData) return;

        // Render sidebar items
        this.renderSidebarItems();
        
        // Render review items
        this.renderReviewItems();
        
        // Update summary totals
        this.updateSummaryTotals();
    }

    // Render sidebar items
    renderSidebarItems() {
        const sidebarItems = document.getElementById('sidebarItems');
        if (!sidebarItems || !this.checkoutData) return;

        sidebarItems.innerHTML = '';

        this.checkoutData.items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'sidebar-item';
            
            itemElement.innerHTML = `
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>Quantity: ${item.quantity}</p>
                </div>
                <div class="item-price">
                    <!-- Item price hidden per user request -->
                </div>
            `;
            
            sidebarItems.appendChild(itemElement);
        });
    }

    // Render review items
    renderReviewItems() {
        const reviewItems = document.getElementById('reviewItems');
        if (!reviewItems || !this.checkoutData) return;

        reviewItems.innerHTML = '';

        this.checkoutData.items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'review-item';
            
            itemElement.innerHTML = `
                <div class="review-item-details">
                    <h4>${item.name}</h4>
                    <p>${item.description || 'Professional painting service'}</p>
                    <p>Quantity: ${item.quantity}</p>
                </div>
                <div class="review-item-price">
                    <!-- Item price hidden per user request -->
                </div>
            `;
            
            reviewItems.appendChild(itemElement);
        });
    }

    // Update summary totals
    updateSummaryTotals() {
        if (!this.checkoutData) return;

        const { subtotal, tax, shipping, discount, total } = this.checkoutData;

        // Update sidebar
        this.updateElement('sidebarSubtotal', formatPrice(subtotal));
        this.updateElement('sidebarTax', formatPrice(tax));
        this.updateElement('sidebarShipping', shipping === 0 ? 'FREE' : formatPrice(shipping));
        this.updateElement('sidebarTotal', formatPrice(total));

        // Update review
        this.updateElement('reviewSubtotal', formatPrice(subtotal));
        this.updateElement('reviewTax', formatPrice(tax));
        this.updateElement('reviewShipping', shipping === 0 ? 'FREE' : formatPrice(shipping));
        this.updateElement('reviewTotal', formatPrice(total));
        this.updateElement('placeOrderTotal', formatPrice(total));

        // Show discount if applicable
        if (discount > 0) {
            this.updateElement('sidebarDiscount', `-${formatPrice(discount)}`);
            this.updateElement('reviewDiscount', `-${formatPrice(discount)}`);
            document.getElementById('sidebarDiscountRow').style.display = 'flex';
            document.getElementById('reviewDiscountRow').style.display = 'flex';
        }
    }

    // Update DOM element
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    // Apply sidebar promo code
    applySidebarPromoCode() {
        const promoInput = document.getElementById('sidebarPromoCode');
        const promoMessage = document.getElementById('sidebarPromoMessage');
        
        if (!promoInput || !promoMessage) return;

        const code = promoInput.value.trim().toUpperCase();
        
        if (!code) {
            this.showSidebarPromoMessage('Please enter a promo code', 'error');
            return;
        }

        // Sample promo codes (same as cart)
        const promoCodes = {
            'SAVE10': { discount: 10, type: 'percentage', minAmount: 50000 },
            'SAVE20': { discount: 20, type: 'percentage', minAmount: 75000 },
            'FLAT50': { discount: 50, type: 'fixed', minAmount: 0 },
            'WELCOME': { discount: 15, type: 'percentage', minAmount: 25000 }
        };

        const promo = promoCodes[code];
        
        if (!promo) {
            this.showSidebarPromoMessage('Invalid promo code', 'error');
            return;
        }

        if (this.checkoutData.subtotal < promo.minAmount) {
            this.showSidebarPromoMessage(`Minimum order amount is ${formatPrice(promo.minAmount)}`, 'error');
            return;
        }

        // Apply promo code
        this.checkoutData.promoCode = code;
        this.checkoutData.discount = this.calculateDiscount(this.checkoutData.subtotal, promo);
        this.checkoutData.total = this.checkoutData.subtotal + this.checkoutData.tax + this.checkoutData.shipping - this.checkoutData.discount;

        localStorage.setItem('checkoutData', JSON.stringify(this.checkoutData));
        
        this.renderOrderSummary();
        this.showSidebarPromoMessage(`Promo code "${code}" applied!`, 'success');
        promoInput.value = '';
    }

    // Calculate discount
    calculateDiscount(subtotal, promo) {
        const { discount, type } = promo;

        if (type === 'percentage') {
            return subtotal * (discount / 100);
        } else if (type === 'fixed') {
            return discount;
        }

        return 0;
    }

    // Show sidebar promo message
    showSidebarPromoMessage(message, type) {
        const promoMessage = document.getElementById('sidebarPromoMessage');
        if (!promoMessage) return;

        promoMessage.textContent = message;
        promoMessage.className = `promo-message ${type}`;
        
        setTimeout(() => {
            promoMessage.textContent = '';
            promoMessage.className = 'promo-message';
        }, 5000);
    }

    // Prefill user information if logged in
    prefillUserInfo() {
        if (!auth.isLoggedIn()) return;

        const user = auth.getCurrentUser();
        if (!user) return;

        // Prefill contact information
        const nameParts = user.name.split(' ');
        document.getElementById('firstName').value = nameParts[0] || '';
        document.getElementById('lastName').value = nameParts.slice(1).join(' ') || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('phone').value = user.phone || '';
    }

    // Handle form submission
    handleFormSubmit() {
        // Save all form data
        this.saveCurrentStepData();

        // Validate final step
        if (!this.validateCurrentStep()) {
            return;
        }

        // Process order
        this.processOrder();
    }

    // Process order
    async processOrder() {
        const submitBtn = document.querySelector('.place-order-btn');
        const originalText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = '<span class="spinner"></span> Processing Order...';
        submitBtn.disabled = true;

        try {
            // Simulate order processing
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Create order
            const order = this.createOrder();

            // Save order
            this.saveOrder(order);

            // Clear cart
            localStorage.removeItem('cart');
            localStorage.removeItem('checkoutData');

            // Show success message
            this.showOrderSuccess(order);

        } catch (error) {
            console.error('Order processing error:', error);
            showToast('Error processing order. Please try again.', 'error');
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    // Create order object
    createOrder() {
        const order = {
            id: 'ORD' + Date.now(),
            orderNumber: Math.floor(100000 + Math.random() * 900000),
            customer: {
                firstName: this.formData.firstName,
                lastName: this.formData.lastName,
                email: this.formData.email,
                phone: this.formData.phone
            },
            shipping: {
                address: this.formData.address,
                city: this.formData.city,
                state: this.formData.state,
                zipCode: this.formData.zipCode,
                country: this.formData.country,
                serviceDate: this.formData.serviceDate,
                notes: this.formData.notes
            },
            payment: {
                method: this.formData.paymentMethod,
                status: 'completed'
            },
            items: this.checkoutData.items,
            pricing: {
                subtotal: this.checkoutData.subtotal,
                tax: this.checkoutData.tax,
                shipping: this.checkoutData.shipping,
                discount: this.checkoutData.discount,
                total: this.checkoutData.total,
                promoCode: this.checkoutData.promoCode
            },
            status: 'confirmed',
            createdAt: new Date().toISOString(),
            estimatedCompletion: this.calculateEstimatedCompletion()
        };

        return order;
    }

    // Calculate estimated completion date
    calculateEstimatedCompletion() {
        const serviceDate = this.formData.serviceDate;
        if (serviceDate) {
            const date = new Date(serviceDate);
            date.setDate(date.getDate() + 7); // Add 7 days for completion
            return date.toISOString().split('T')[0];
        }
        
        // Default to 2 weeks from now
        const date = new Date();
        date.setDate(date.getDate() + 14);
        return date.toISOString().split('T')[0];
    }

    // Save order to localStorage and user's order history
    saveOrder(order) {
        // Save to all orders
        let allOrders = JSON.parse(localStorage.getItem('orders')) || [];
        allOrders.push(order);
        localStorage.setItem('orders', JSON.stringify(allOrders));

        // Save to user's orders if logged in
        if (auth.isLoggedIn()) {
            const user = auth.getCurrentUser();
            let userOrders = JSON.parse(localStorage.getItem(`userOrders_${user.id}`)) || [];
            userOrders.push(order);
            localStorage.setItem(`userOrders_${user.id}`, JSON.stringify(userOrders));
        }
    }

    // Show order success
    showOrderSuccess(order) {
        const successContent = `
            <div class="order-success">
                <div class="success-icon">
                    <i class="fas fa-check-circle fa-4x text-success"></i>
                </div>
                <h2>Order Confirmed!</h2>
                <p>Thank you for your order. Your painting service has been confirmed.</p>
                
                <div class="order-details">
                    <div class="detail-row">
                        <span>Order Number:</span>
                        <span><strong>${order.orderNumber}</strong></span>
                    </div>
                    <div class="detail-row">
                        <span>Total Amount:</span>
                        <span><strong>${formatPrice(order.pricing.total)}</strong></span>
                    </div>
                    <div class="detail-row">
                        <span>Estimated Completion:</span>
                        <span><strong>${new Date(order.estimatedCompletion).toLocaleDateString()}</strong></span>
                    </div>
                </div>
                
                <div class="next-steps">
                    <h4>What happens next?</h4>
                    <ul>
                        <li>You'll receive a confirmation email at ${order.customer.email}</li>
                        <li>Our team will contact you within 24 hours to schedule the service</li>
                        <li>You'll receive updates via email and SMS</li>
                    </ul>
                </div>
                
                <div class="success-actions">
                    <button class="btn btn-primary" onclick="location.href='orders.html'">
                        <i class="fas fa-list"></i>
                        View My Orders
                    </button>
                    <button class="btn btn-outline" onclick="location.href='index.html'">
                        <i class="fas fa-home"></i>
                        Back to Home
                    </button>
                </div>
            </div>
        `;

        openModal(successContent, 'Order Successful');
        
        // Remove close button from modal
        const modalClose = document.querySelector('.modal-close');
        if (modalClose) {
            modalClose.style.display = 'none';
        }

        // Disable background click to close
        const modal = document.querySelector('.modal');
        if (modal) {
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        }
    }
}

// Initialize checkout manager
const checkoutManager = new CheckoutManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CheckoutManager;
}
