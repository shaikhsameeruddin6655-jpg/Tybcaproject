// Orders Management System
class OrdersManager {
    constructor() {
        this.orders = [];
        this.filteredOrders = [];
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.init();
    }

    init() {
        this.loadOrders();
        this.setupEventListeners();
        this.renderOrders();
    }

    // Load orders from localStorage
    loadOrders() {
        if (auth.isLoggedIn()) {
            const user = auth.getCurrentUser();
            const userOrders = JSON.parse(localStorage.getItem(`userOrders_${user.id}`)) || [];
            this.orders = userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else {
            // Load from session or show login prompt
            const sessionOrders = JSON.parse(sessionStorage.getItem('guestOrders')) || [];
            this.orders = sessionOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        
        this.filteredOrders = [...this.orders];
    }

    // Setup event listeners
    setupEventListeners() {
        // Filter tabs
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.filterOrders(e.target.dataset.status);
                this.updateActiveFilter(e.target);
            });
        });

        // Search
        const searchInput = document.getElementById('orderSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchOrders(e.target.value);
            });
        }
    }

    // Render orders
    renderOrders() {
        const ordersList = document.getElementById('ordersList');
        const emptyOrders = document.getElementById('emptyOrders');

        if (!ordersList || !emptyOrders) return;

        if (this.filteredOrders.length === 0) {
            ordersList.style.display = 'none';
            emptyOrders.style.display = 'block';
            return;
        }

        ordersList.style.display = 'block';
        emptyOrders.style.display = 'none';

        ordersList.innerHTML = '';

        this.filteredOrders.forEach((order, index) => {
            const orderCard = this.createOrderCard(order);
            orderCard.style.animationDelay = `${index * 0.1}s`;
            ordersList.appendChild(orderCard);
        });
    }

    // Create order card element
    createOrderCard(order) {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        orderCard.dataset.orderId = order.id;

        const statusConfig = this.getStatusConfig(order.status);

        orderCard.innerHTML = `
            <div class="order-header">
                <div class="order-info">
                    <div class="order-number">
                        <h3>Order #${order.orderNumber}</h3>
                        <span class="order-date">${this.formatDate(order.createdAt)}</span>
                    </div>
                    <div class="order-status">
                        <span class="status-badge ${statusConfig.class}">${statusConfig.label}</span>
                    </div>
                </div>
                <div class="order-total">
                    <span class="total-amount">$${order.pricing.total.toFixed(2)}</span>
                </div>
            </div>

            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <div class="item-info">
                            <h4>${item.name}</h4>
                            <p>Quantity: ${item.quantity} × $${item.price}</p>
                        </div>
                        <div class="item-price">
                            $${(item.price * item.quantity).toFixed(2)}
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="order-details">
                <div class="detail-group">
                    <h4>Service Address</h4>
                    <p>${order.shipping.address}, ${order.shipping.city}, ${order.shipping.state} ${order.shipping.zipCode}</p>
                </div>
                <div class="detail-group">
                    <h4>Service Date</h4>
                    <p>${order.shipping.serviceDate ? this.formatDate(order.shipping.serviceDate) : 'To be scheduled'}</p>
                </div>
                <div class="detail-group">
                    <h4>Estimated Completion</h4>
                    <p>${this.formatDate(order.estimatedCompletion)}</p>
                </div>
            </div>

            <div class="order-progress">
                <div class="progress-timeline">
                    ${this.createProgressTimeline(order.status)}
                </div>
            </div>

            <div class="order-actions">
                <button class="btn btn-outline" onclick="ordersManager.viewOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i>
                    View Details
                </button>
                ${order.status === 'confirmed' ? `
                    <button class="btn btn-outline" onclick="ordersManager.rescheduleOrder('${order.id}')">
                        <i class="fas fa-calendar"></i>
                        Reschedule
                    </button>
                ` : ''}
                ${order.status === 'completed' ? `
                    <button class="btn btn-primary" onclick="ordersManager.reorderServices('${order.id}')">
                        <i class="fas fa-redo"></i>
                        Reorder
                    </button>
                ` : ''}
                ${['confirmed', 'in-progress'].includes(order.status) ? `
                    <button class="btn btn-danger" onclick="ordersManager.cancelOrder('${order.id}')">
                        <i class="fas fa-times"></i>
                        Cancel
                    </button>
                ` : ''}
                <button class="btn btn-outline" onclick="ordersManager.downloadInvoice('${order.id}')">
                    <i class="fas fa-download"></i>
                    Invoice
                </button>
            </div>
        `;

        return orderCard;
    }

    // Get status configuration
    getStatusConfig(status) {
        const configs = {
            'confirmed': { label: 'Confirmed', class: 'status-confirmed' },
            'in-progress': { label: 'In Progress', class: 'status-progress' },
            'completed': { label: 'Completed', class: 'status-completed' },
            'cancelled': { label: 'Cancelled', class: 'status-cancelled' },
            'pending': { label: 'Pending', class: 'status-pending' }
        };
        
        return configs[status] || configs['pending'];
    }

    // Create progress timeline
    createProgressTimeline(status) {
        const steps = [
            { key: 'confirmed', label: 'Order Confirmed', completed: true },
            { key: 'in-progress', label: 'Service Scheduled', completed: ['in-progress', 'completed'].includes(status) },
            { key: 'completed', label: 'Service Completed', completed: status === 'completed' }
        ];

        return steps.map((step, index) => `
            <div class="timeline-step ${step.completed ? 'completed' : ''} ${step.key === status ? 'active' : ''}">
                <div class="step-dot"></div>
                <div class="step-label">${step.label}</div>
            </div>
        `).join('');
    }

    // Filter orders by status
    filterOrders(status) {
        this.currentFilter = status;
        this.applyFilters();
    }

    // Search orders
    searchOrders(query) {
        this.searchQuery = query.toLowerCase();
        this.applyFilters();
    }

    // Apply all filters
    applyFilters() {
        let filtered = [...this.orders];

        // Status filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(order => order.status === this.currentFilter);
        }

        // Search filter
        if (this.searchQuery) {
            filtered = filtered.filter(order => 
                order.orderNumber.toString().includes(this.searchQuery) ||
                order.customer.email.toLowerCase().includes(this.searchQuery) ||
                order.items.some(item => item.name.toLowerCase().includes(this.searchQuery))
            );
        }

        this.filteredOrders = filtered;
        this.renderOrders();
    }

    // Update active filter
    updateActiveFilter(activeTab) {
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        activeTab.classList.add('active');
    }

    // View order details
    viewOrderDetails(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const detailsContent = `
            <div class="order-details-modal">
                <div class="order-details-header">
                    <h3>Order Details #${order.orderNumber}</h3>
                    <span class="status-badge ${this.getStatusConfig(order.status).class}">
                        ${this.getStatusConfig(order.status).label}
                    </span>
                </div>

                <div class="order-details-content">
                    <div class="details-section">
                        <h4>Customer Information</h4>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="label">Name:</span>
                                <span class="value">${order.customer.firstName} ${order.customer.lastName}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Email:</span>
                                <span class="value">${order.customer.email}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Phone:</span>
                                <span class="value">${order.customer.phone}</span>
                            </div>
                        </div>
                    </div>

                    <div class="details-section">
                        <h4>Service Information</h4>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="label">Address:</span>
                                <span class="value">${order.shipping.address}, ${order.shipping.city}, ${order.shipping.state} ${order.shipping.zipCode}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Service Date:</span>
                                <span class="value">${order.shipping.serviceDate ? this.formatDate(order.shipping.serviceDate) : 'To be scheduled'}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Notes:</span>
                                <span class="value">${order.shipping.notes || 'None'}</span>
                            </div>
                        </div>
                    </div>

                    <div class="details-section">
                        <h4>Order Items</h4>
                        <div class="items-list">
                            ${order.items.map(item => `
                                <div class="detail-item">
                                    <div class="item-info">
                                        <h5>${item.name}</h5>
                                        <p>Quantity: ${item.quantity}</p>
                                    </div>
                                    <div class="item-price">
                                        $${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="details-section">
                        <h4>Payment Information</h4>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="label">Payment Method:</span>
                                <span class="value">${order.payment.method}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Payment Status:</span>
                                <span class="value">${order.payment.status}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Order Date:</span>
                                <span class="value">${this.formatDate(order.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    <div class="details-section">
                        <h4>Order Summary</h4>
                        <div class="summary-list">
                            <div class="summary-row">
                                <span>Subtotal:</span>
                                <span>$${order.pricing.subtotal.toFixed(2)}</span>
                            </div>
                            <div class="summary-row">
                                <span>Tax:</span>
                                <span>$${order.pricing.tax.toFixed(2)}</span>
                            </div>
                            <div class="summary-row">
                                <span>Shipping:</span>
                                <span>${order.pricing.shipping === 0 ? 'FREE' : `$${order.pricing.shipping.toFixed(2)}`}</span>
                            </div>
                            ${order.pricing.discount > 0 ? `
                                <div class="summary-row discount">
                                    <span>Discount:</span>
                                    <span>-$${order.pricing.discount.toFixed(2)}</span>
                                </div>
                            ` : ''}
                            <div class="summary-row total">
                                <span>Total:</span>
                                <span>$${order.pricing.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="order-details-actions">
                    <button class="btn btn-outline" onclick="ordersManager.downloadInvoice('${order.id}')">
                        <i class="fas fa-download"></i>
                        Download Invoice
                    </button>
                    <button class="btn btn-primary" onclick="closeModal()">
                        Close
                    </button>
                </div>
            </div>
        `;

        openModal(detailsContent, 'Order Details');
    }

    // Reschedule order
    rescheduleOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const rescheduleContent = `
            <div class="reschedule-modal">
                <h3>Reschedule Service</h3>
                <p>Order #${order.orderNumber}</p>
                
                <form id="rescheduleForm">
                    <div class="form-group">
                        <label class="form-label" for="newServiceDate">New Service Date *</label>
                        <input type="date" class="form-input" id="newServiceDate" name="newServiceDate" required>
                        <small class="form-help">We'll contact you to confirm the new date and time</small>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="rescheduleReason">Reason for Rescheduling</label>
                        <textarea class="form-input" id="rescheduleReason" name="rescheduleReason" rows="3" placeholder="Please let us know why you need to reschedule..."></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Submit Request</button>
                    </div>
                </form>
            </div>
        `;

        openModal(rescheduleContent, 'Reschedule Service');

        // Setup form submission
        document.getElementById('rescheduleForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.processReschedule(orderId, e.target);
        });
    }

    // Process reschedule request
    processReschedule(orderId, form) {
        const formData = new FormData(form);
        const newDate = formData.get('newServiceDate');
        const reason = formData.get('rescheduleReason');

        // Update order
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.shipping.serviceDate = newDate;
            order.shipping.notes = (order.shipping.notes || '') + `\n\nReschedule Request: ${reason}`;
            order.status = 'confirmed'; // Reset to confirmed for rescheduling
            
            this.saveOrders();
            this.renderOrders();
            
            closeModal();
            showToast('Reschedule request submitted successfully! We\'ll contact you soon.', 'success');
        }
    }

    // Cancel order
    cancelOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        if (!confirm(`Are you sure you want to cancel order #${order.orderNumber}?`)) {
            return;
        }

        const cancelContent = `
            <div class="cancel-modal">
                <h3>Cancel Order</h3>
                <p>Order #${order.orderNumber}</p>
                
                <form id="cancelForm">
                    <div class="form-group">
                        <label class="form-label" for="cancelReason">Reason for Cancellation *</label>
                        <select class="form-input" id="cancelReason" name="cancelReason" required>
                            <option value="">Select a reason</option>
                            <option value="changed-mind">Changed my mind</option>
                            <option value="found-better">Found a better service</option>
                            <option value="timing">Timing doesn't work</option>
                            <option value="financial">Financial reasons</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="cancelDetails">Additional Details</label>
                        <textarea class="form-input" id="cancelDetails" name="cancelDetails" rows="3" placeholder="Please provide any additional details..."></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" onclick="closeModal()">Keep Order</button>
                        <button type="submit" class="btn btn-danger">Cancel Order</button>
                    </div>
                </form>
            </div>
        `;

        openModal(cancelContent, 'Cancel Order');

        // Setup form submission
        document.getElementById('cancelForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.processCancellation(orderId, e.target);
        });
    }

    // Process cancellation
    processCancellation(orderId, form) {
        const formData = new FormData(form);
        const reason = formData.get('cancelReason');
        const details = formData.get('cancelDetails');

        // Update order
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = 'cancelled';
            order.cancelledAt = new Date().toISOString();
            order.cancellationReason = reason;
            order.cancellationDetails = details;
            
            this.saveOrders();
            this.renderOrders();
            
            closeModal();
            showToast(`Order #${order.orderNumber} has been cancelled.`, 'info');
        }
    }

    // Reorder services
    reorderServices(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        // Add items to cart
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        order.items.forEach(item => {
            const existingItem = cart.find(cartItem => cartItem.id === item.id);
            
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                cart.push({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    description: item.description,
                    image: item.image
                });
            }
        });
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        showToast('Services added to cart! Redirecting to cart...', 'success');
        
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 1500);
    }

    // Download invoice
    downloadInvoice(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        // Create invoice content
        const invoiceContent = this.generateInvoiceContent(order);
        
        // Create and download PDF (simplified version - in production, use a proper PDF library)
        const blob = new Blob([invoiceContent], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${order.orderNumber}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showToast(`Invoice for order #${order.orderNumber} downloaded`, 'success');
    }

    // Generate invoice content
    generateInvoiceContent(order) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice #${order.orderNumber}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    .header { text-align: center; margin-bottom: 40px; }
                    .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
                    .invoice-info { margin-bottom: 30px; }
                    .section { margin-bottom: 20px; }
                    .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                    .total { font-weight: bold; font-size: 18px; margin-top: 20px; }
                    .footer { margin-top: 40px; text-align: center; color: #666; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">Paints Works</div>
                    <h1>Invoice #${order.orderNumber}</h1>
                    <p>Date: ${this.formatDate(order.createdAt)}</p>
                </div>
                
                <div class="invoice-info">
                    <div class="section">
                        <h3>Bill To:</h3>
                        <p>${order.customer.firstName} ${order.customer.lastName}</p>
                        <p>${order.customer.email}</p>
                        <p>${order.customer.phone}</p>
                    </div>
                    
                    <div class="section">
                        <h3>Service Address:</h3>
                        <p>${order.shipping.address}</p>
                        <p>${order.shipping.city}, ${order.shipping.state} ${order.shipping.zipCode}</p>
                    </div>
                </div>
                
                <div class="section">
                    <h3>Services</h3>
                    ${order.items.map(item => `
                        <div class="item">
                            <span>${item.name} (Qty: ${item.quantity})</span>
                            <span>$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="section">
                    <div class="item">
                        <span>Subtotal</span>
                        <span>$${order.pricing.subtotal.toFixed(2)}</span>
                    </div>
                    <div class="item">
                        <span>Tax</span>
                        <span>$${order.pricing.tax.toFixed(2)}</span>
                    </div>
                    <div class="item">
                        <span>Shipping</span>
                        <span>${order.pricing.shipping === 0 ? 'FREE' : `$${order.pricing.shipping.toFixed(2)}`}</span>
                    </div>
                    ${order.pricing.discount > 0 ? `
                        <div class="item">
                            <span>Discount</span>
                            <span>-$${order.pricing.discount.toFixed(2)}</span>
                        </div>
                    ` : ''}
                    <div class="item total">
                        <span>Total</span>
                        <span>$${order.pricing.total.toFixed(2)}</span>
                    </div>
                </div>
                
                <div class="footer">
                    <p>Thank you for choosing Paints Works!</p>
                    <p>This is a computer-generated invoice and does not require a signature.</p>
                </div>
            </body>
            </html>
        `;
    }

    // Save orders to localStorage
    saveOrders() {
        if (auth.isLoggedIn()) {
            const user = auth.getCurrentUser();
            localStorage.setItem(`userOrders_${user.id}`, JSON.stringify(this.orders));
        }
    }

    // Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Get order statistics
    getOrderStats() {
        const stats = {
            total: this.orders.length,
            confirmed: this.orders.filter(o => o.status === 'confirmed').length,
            inProgress: this.orders.filter(o => o.status === 'in-progress').length,
            completed: this.orders.filter(o => o.status === 'completed').length,
            cancelled: this.orders.filter(o => o.status === 'cancelled').length,
            totalSpent: this.orders.reduce((total, order) => total + order.pricing.total, 0)
        };
        
        return stats;
    }
}

// Initialize orders manager
const ordersManager = new OrdersManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OrdersManager;
}
