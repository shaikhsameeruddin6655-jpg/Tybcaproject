// Estimate Calculator System
class EstimateCalculator {
    constructor() {
        this.currentEstimate = null;
        this.savedEstimates = [];
        this.init();
    }

    init() {
        this.loadSavedEstimates();
        this.setupEventListeners();
    }

    // Load saved estimates
    loadSavedEstimates() {
        this.savedEstimates = JSON.parse(localStorage.getItem('savedEstimates')) || [];
    }

    // Save estimates to localStorage
    saveEstimates() {
        localStorage.setItem('savedEstimates', JSON.stringify(this.savedEstimates));
    }

    // Setup event listeners
    setupEventListeners() {
        const estimateForm = document.getElementById('estimateForm');
        if (estimateForm) {
            estimateForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.calculateEstimate(e.target);
            });
        }

        // Real-time calculation on input change
        const inputs = estimateForm?.querySelectorAll('input, select');
        inputs?.forEach(input => {
            input.addEventListener('change', () => {
                if (this.hasRequiredFields()) {
                    this.calculateEstimate(estimateForm);
                }
            });
        });
    }

    // Check if required fields are filled
    hasRequiredFields() {
        const form = document.getElementById('estimateForm');
        if (!form) return false;

        const projectName = form.projectName.value;
        const projectType = form.projectType.value;
        const squareFootage = form.squareFootage.value;
        const paintQuality = form.paintQuality.value;

        return projectName && projectType && squareFootage && paintQuality;
    }

    // Calculate estimate
    calculateEstimate(form) {
        const formData = new FormData(form);
        
        const projectData = {
            projectName: formData.get('projectName'),
            projectType: formData.get('projectType'),
            squareFootage: parseFloat(formData.get('squareFootage')),
            rooms: parseInt(formData.get('rooms')) || 1,
            ceilings: formData.get('ceilings') === 'yes',
            paintQuality: formData.get('paintQuality'),
            prepWork: formData.getAll('prepWork'),
            specialFeatures: formData.getAll('specialFeatures'),
            urgency: formData.get('urgency')
        };

        // Calculate costs
        const costs = this.calculateCosts(projectData);
        
        // Display results
        this.displayResults(projectData, costs);
        
        // Show cost breakdown
        this.showCostBreakdown(costs);
    }

    // Calculate costs
    calculateCosts(projectData) {
        const { squareFootage, rooms, ceilings, paintQuality, prepWork, specialFeatures, urgency } = projectData;

        // Base rates per square foot (in INR)
        const baseRates = {
            'basic': { interior: 80, exterior: 120, commercial: 100 },
            'standard': { interior: 120, exterior: 180, commercial: 150 },
            'premium': { interior: 180, exterior: 280, commercial: 220 }
        };

        const baseRate = baseRates[paintQuality][projectData.projectType];
        
        // Material costs
        let materialCost = squareFootage * baseRate * 0.4; // 40% of total is material
        
        // Add ceiling cost if applicable
        if (ceilings) {
            materialCost += squareFootage * baseRate * 0.15;
        }

        // Labor costs
        let laborHours = this.calculateLaborHours(squareFootage, rooms, prepWork, specialFeatures);
        let laborRate = this.getLaborRate(projectData.projectType, urgency);
        let laborCost = laborHours * laborRate;

        // Additional costs for preparation work
        let prepCost = 0;
        prepWork.forEach(work => {
            switch(work) {
                case 'wall-repair':
                    prepCost += squareFootage * 15;
                    break;
                case 'sanding':
                    prepCost += squareFootage * 8;
                    break;
                case 'priming':
                    prepCost += squareFootage * 10;
                    break;
                case 'cleaning':
                    prepCost += squareFootage * 5;
                    break;
            }
        });

        // Additional costs for special features
        let featureCost = 0;
        specialFeatures.forEach(feature => {
            switch(feature) {
                case 'textures':
                    featureCost += squareFootage * 25;
                    break;
                case 'accents':
                    featureCost += squareFootage * 20;
                    break;
                case 'trim':
                    featureCost += rooms * 500;
                    break;
                case 'cabinets':
                    featureCost += rooms * 800;
                    break;
            }
        });

        // Urgency multiplier
        let urgencyMultiplier = 1;
        switch(urgency) {
            case 'rush':
                urgencyMultiplier = 1.2;
                break;
            case 'express':
                urgencyMultiplier = 1.4;
                break;
        }

        // Calculate subtotal
        let subtotal = (materialCost + laborCost + prepCost + featureCost) * urgencyMultiplier;

        // Tax (18% GST)
        let tax = subtotal * 0.18;

        // Total
        let total = subtotal + tax;

        return {
            materialCost: Math.round(materialCost),
            laborCost: Math.round(laborCost),
            prepCost: Math.round(prepCost),
            featureCost: Math.round(featureCost),
            subtotal: Math.round(subtotal),
            tax: Math.round(tax),
            total: Math.round(total),
            laborHours: Math.round(laborHours * 10) / 10,
            urgencyMultiplier
        };
    }

    // Calculate labor hours
    calculateLaborHours(squareFootage, rooms, prepWork, specialFeatures) {
        let baseHours = squareFootage / 100; // Base: 1 hour per 100 sq ft
        
        // Add time for rooms
        baseHours += rooms * 2; // 2 hours per room for setup/cleanup
        
        // Add time for preparation work
        prepWork.forEach(work => {
            switch(work) {
                case 'wall-repair':
                    baseHours += squareFootage / 50;
                    break;
                case 'sanding':
                    baseHours += squareFootage / 80;
                    break;
                case 'priming':
                    baseHours += squareFootage / 120;
                    break;
                case 'cleaning':
                    baseHours += squareFootage / 150;
                    break;
            }
        });

        // Add time for special features
        specialFeatures.forEach(feature => {
            switch(feature) {
                case 'textures':
                    baseHours += squareFootage / 60;
                    break;
                case 'accents':
                    baseHours += squareFootage / 80;
                    break;
                case 'trim':
                    baseHours += rooms * 1.5;
                    break;
                case 'cabinets':
                    baseHours += rooms * 2;
                    break;
            }
        });

        return baseHours;
    }

    // Get labor rate per hour
    getLaborRate(projectType, urgency) {
        const baseRates = {
            'interior': 350,
            'exterior': 450,
            'commercial': 400
        };

        let rate = baseRates[projectType];
        
        // Urgency multiplier
        switch(urgency) {
            case 'rush':
                rate *= 1.3;
                break;
            case 'express':
                rate *= 1.5;
                break;
        }

        return rate;
    }

    // Display results
    displayResults(projectData, costs) {
        const resultsContainer = document.getElementById('estimateResults');
        if (!resultsContainer) return;

        this.currentEstimate = {
            ...projectData,
            ...costs,
            calculatedAt: new Date().toISOString()
        };

        resultsContainer.innerHTML = `
            <div class="estimate-summary">
                <div class="summary-header">
                    <h3>${projectData.projectName}</h3>
                    <span class="estimate-badge">Instant Estimate</span>
                </div>
                
                <div class="summary-details">
                    <div class="detail-item">
                        <span class="label">Project Type:</span>
                        <span class="value">${projectData.projectType.charAt(0).toUpperCase() + projectData.projectType.slice(1)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Area:</span>
                        <span class="value">${projectData.squareFootage.toLocaleString('en-IN')} sq. ft.</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Rooms:</span>
                        <span class="value">${projectData.rooms}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Paint Quality:</span>
                        <span class="value">${projectData.paintQuality.charAt(0).toUpperCase() + projectData.paintQuality.slice(1)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Estimated Labor:</span>
                        <span class="value">${costs.laborHours} hours</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Timeline:</span>
                        <span class="value">${this.getTimeline(projectData.urgency)}</span>
                    </div>
                </div>

                <div class="summary-total">
                    <div class="total-amount">
                        <span class="amount-label">Total Estimate:</span>
                        <span class="amount-value">₹${costs.total.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="total-breakdown">
                        <span>Materials: ₹${costs.materialCost.toLocaleString('en-IN')} | Labor: ₹${costs.laborCost.toLocaleString('en-IN')} | Tax: ₹${costs.tax.toLocaleString('en-IN')}</span>
                    </div>
                </div>

                <div class="summary-features">
                    ${projectData.prepWork.length > 0 ? `
                        <div class="feature-group">
                            <h4>Preparation Work:</h4>
                            <div class="feature-list">
                                ${projectData.prepWork.map(work => `<span class="feature-tag">${this.formatWorkName(work)}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${projectData.specialFeatures.length > 0 ? `
                        <div class="feature-group">
                            <h4>Special Features:</h4>
                            <div class="feature-list">
                                ${projectData.specialFeatures.map(feature => `<span class="feature-tag">${this.formatFeatureName(feature)}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // Show cost breakdown
    showCostBreakdown(costs) {
        const breakdownSection = document.getElementById('costBreakdown');
        if (!breakdownSection) return;

        breakdownSection.style.display = 'block';

        // Update material breakdown
        const materialBreakdown = document.getElementById('materialBreakdown');
        if (materialBreakdown) {
            materialBreakdown.innerHTML = `
                <div class="breakdown-row">
                    <span>Paint & Materials:</span>
                    <span>₹${costs.materialCost.toLocaleString('en-IN')}</span>
                </div>
                <div class="breakdown-row">
                    <span>Tools & Equipment:</span>
                    <span>₹${Math.round(costs.materialCost * 0.1).toLocaleString('en-IN')}</span>
                </div>
                <div class="breakdown-row">
                    <span>Waste & Cleanup:</span>
                    <span>₹${Math.round(costs.materialCost * 0.05).toLocaleString('en-IN')}</span>
                </div>
            `;
        }

        // Update labor breakdown
        const laborBreakdown = document.getElementById('laborBreakdown');
        if (laborBreakdown) {
            laborBreakdown.innerHTML = `
                <div class="breakdown-row">
                    <span>Labor (${costs.laborHours} hours):</span>
                    <span>₹${costs.laborCost.toLocaleString('en-IN')}</span>
                </div>
                <div class="breakdown-row">
                    <span>Supervision:</span>
                    <span>₹${Math.round(costs.laborCost * 0.15).toLocaleString('en-IN')}</span>
                </div>
                <div class="breakdown-row">
                    <span>Setup & Cleanup:</span>
                    <span>₹${Math.round(costs.laborCost * 0.1).toLocaleString('en-IN')}</span>
                </div>
            `;
        }

        // Update additional breakdown
        const additionalBreakdown = document.getElementById('additionalBreakdown');
        if (additionalBreakdown) {
            additionalBreakdown.innerHTML = `
                ${costs.prepCost > 0 ? `
                    <div class="breakdown-row">
                        <span>Preparation Work:</span>
                        <span>₹${costs.prepCost.toLocaleString('en-IN')}</span>
                    </div>
                ` : ''}
                ${costs.featureCost > 0 ? `
                    <div class="breakdown-row">
                        <span>Special Features:</span>
                        <span>₹${costs.featureCost.toLocaleString('en-IN')}</span>
                    </div>
                ` : ''}
                ${costs.urgencyMultiplier > 1 ? `
                    <div class="breakdown-row">
                        <span>Urgency Surcharge:</span>
                        <span>₹${Math.round((costs.subtotal - costs.materialCost - costs.laborCost - costs.prepCost - costs.featureCost) * (costs.urgencyMultiplier - 1)).toLocaleString('en-IN')}</span>
                    </div>
                ` : ''}
            `;
        }

        // Update summary
        document.getElementById('subtotalAmount').textContent = `₹${costs.subtotal.toLocaleString('en-IN')}`;
        document.getElementById('taxAmount').textContent = `₹${costs.tax.toLocaleString('en-IN')}`;
        document.getElementById('totalAmount').textContent = `₹${costs.total.toLocaleString('en-IN')}`;
    }

    // Get timeline based on urgency
    getTimeline(urgency) {
        const timelines = {
            'normal': '2-3 weeks',
            'rush': '1 week',
            'express': '3-4 days'
        };
        return timelines[urgency] || timelines['normal'];
    }

    // Format work name for display
    formatWorkName(work) {
        const names = {
            'wall-repair': 'Wall Repair',
            'sanding': 'Sanding',
            'priming': 'Priming',
            'cleaning': 'Deep Cleaning'
        };
        return names[work] || work;
    }

    // Format feature name for display
    formatFeatureName(feature) {
        const names = {
            'textures': 'Textured Walls',
            'accents': 'Accent Walls',
            'trim': 'Trim & Molding',
            'cabinets': 'Cabinet Painting'
        };
        return names[feature] || feature;
    }

    // Save estimate
    saveEstimate() {
        if (!this.currentEstimate) {
            showToast('Please calculate an estimate first', 'error');
            return;
        }

        if (!auth.isLoggedIn()) {
            showToast('Please login to save estimates', 'info');
            auth.showLoginModal();
            return;
        }

        const estimate = {
            ...this.currentEstimate,
            id: Date.now().toString(),
            userId: auth.getCurrentUser().id,
            status: 'draft'
        };

        this.savedEstimates.push(estimate);
        this.saveEstimates();
        
        showToast('Estimate saved successfully!', 'success');
        this.displaySavedEstimates();
    }

    // Request quote
    requestQuote() {
        if (!this.currentEstimate) {
            showToast('Please calculate an estimate first', 'error');
            return;
        }

        const quoteContent = `
            <div class="quote-request-modal">
                <h3>Request Quote</h3>
                <p>We'll review your estimate and send you a detailed quote within 24 hours.</p>
                
                <form id="quoteRequestForm">
                    <div class="form-group">
                        <label class="form-label" for="contactName">Full Name *</label>
                        <input type="text" class="form-input" id="contactName" name="contactName" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="contactEmail">Email Address *</label>
                        <input type="email" class="form-input" id="contactEmail" name="contactEmail" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="contactPhone">Phone Number *</label>
                        <input type="tel" class="form-input" id="contactPhone" name="contactPhone" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="projectAddress">Project Address *</label>
                        <textarea class="form-input" id="projectAddress" name="projectAddress" rows="2" required placeholder="Complete address where painting work will be done"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="additionalNotes">Additional Notes</label>
                        <textarea class="form-input" id="additionalNotes" name="additionalNotes" rows="3" placeholder="Any specific requirements or questions..."></textarea>
                    </div>
                    
                    <div class="estimate-summary">
                        <h4>Estimate Summary</h4>
                        <div class="summary-row">
                            <span>Project:</span>
                            <span>${this.currentEstimate.projectName}</span>
                        </div>
                        <div class="summary-row">
                            <span>Estimated Cost:</span>
                            <span>₹${this.currentEstimate.total.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Send Quote Request</button>
                    </div>
                </form>
            </div>
        `;

        openModal(quoteContent, 'Request Quote');

        // Setup form submission
        document.getElementById('quoteRequestForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.processQuoteRequest(e.target);
        });
    }

    // Process quote request
    processQuoteRequest(form) {
        const formData = new FormData(form);
        
        // In production, this would send to server
        const quoteRequest = {
            ...this.currentEstimate,
            contactInfo: {
                name: formData.get('contactName'),
                email: formData.get('contactEmail'),
                phone: formData.get('contactPhone'),
                address: formData.get('projectAddress'),
                notes: formData.get('additionalNotes')
            },
            requestedAt: new Date().toISOString(),
            status: 'pending'
        };

        // Save quote request
        let quoteRequests = JSON.parse(localStorage.getItem('quoteRequests')) || [];
        quoteRequests.push(quoteRequest);
        localStorage.setItem('quoteRequests', JSON.stringify(quoteRequests));

        closeModal();
        showToast('Quote request sent successfully! We\'ll contact you within 24 hours.', 'success');
    }

    // Book project
    bookProject() {
        if (!this.currentEstimate) {
            showToast('Please calculate an estimate first', 'error');
            return;
        }

        // Add to cart as a service
        const cartItem = {
            id: `estimate_${Date.now()}`,
            name: `${this.currentEstimate.projectName} - Custom Painting Service`,
            price: this.currentEstimate.total,
            quantity: 1,
            description: `${this.currentEstimate.squareFootage} sq. ft. ${this.currentEstimate.projectType} painting with ${this.currentEstimate.paintQuality} quality paint`,
            type: 'custom_estimate',
            estimateData: this.currentEstimate
        };

        // Add to cart
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(cartItem);
        localStorage.setItem('cart', JSON.stringify(cart));

        updateCartCount();
        
        // Also update cart manager if it exists
        if (window.cartManager) {
            window.cartManager.loadCart();
            window.cartManager.renderCart();
        }
        
        showToast('Project added to cart! Proceed to checkout to confirm booking.', 'success');
        
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 1500);
    }

    // Display saved estimates
    displaySavedEstimates() {
        const savedEstimatesSection = document.getElementById('savedEstimates');
        const estimatesList = document.getElementById('estimatesList');

        if (!savedEstimatesSection || !estimatesList) return;

        if (this.savedEstimates.length === 0) {
            savedEstimatesSection.style.display = 'none';
            return;
        }

        savedEstimatesSection.style.display = 'block';
        
        // Show only recent estimates (max 3)
        const recentEstimates = this.savedEstimates.slice(-3).reverse();
        
        estimatesList.innerHTML = recentEstimates.map(estimate => `
            <div class="estimate-card">
                <div class="estimate-header">
                    <h4>${estimate.projectName}</h4>
                    <span class="estimate-date">${this.formatDate(estimate.calculatedAt)}</span>
                </div>
                <div class="estimate-details">
                    <span class="estimate-amount">₹${estimate.total.toLocaleString('en-IN')}</span>
                    <span class="estimate-type">${estimate.projectType}</span>
                </div>
                <div class="estimate-actions">
                    <button class="btn btn-sm btn-outline" onclick="estimateCalculator.loadEstimate('${estimate.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="estimateCalculator.bookEstimate('${estimate.id}')">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Load estimate
    loadEstimate(estimateId) {
        const estimate = this.savedEstimates.find(e => e.id === estimateId);
        if (!estimate) return;

        // Fill form with estimate data
        const form = document.getElementById('estimateForm');
        if (form) {
            form.projectName.value = estimate.projectName;
            form.projectType.value = estimate.projectType;
            form.squareFootage.value = estimate.squareFootage;
            form.rooms.value = estimate.rooms;
            form.ceilings.value = estimate.ceilings ? 'yes' : 'no';
            form.paintQuality.value = estimate.paintQuality;
            form.urgency.value = estimate.urgency;

            // Check checkboxes
            estimate.prepWork?.forEach(work => {
                const checkbox = form.querySelector(`input[name="prepWork"][value="${work}"]`);
                if (checkbox) checkbox.checked = true;
            });

            estimate.specialFeatures?.forEach(feature => {
                const checkbox = form.querySelector(`input[name="specialFeatures"][value="${feature}"]`);
                if (checkbox) checkbox.checked = true;
            });

            // Calculate and display
            this.calculateEstimate(form);
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Book estimate
    bookEstimate(estimateId) {
        this.loadEstimate(estimateId);
        setTimeout(() => {
            this.bookProject();
        }, 500);
    }

    // View all estimates
    viewAllEstimates() {
        if (!auth.isLoggedIn()) {
            showToast('Please login to view all estimates', 'info');
            auth.showLoginModal();
            return;
        }

        // This would open a page with all estimates
        showToast('Estimates history page coming soon!', 'info');
    }

    // Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

// Initialize estimate calculator
const estimateCalculator = new EstimateCalculator();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EstimateCalculator;
}
