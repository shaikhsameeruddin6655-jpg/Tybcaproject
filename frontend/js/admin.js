// Admin Panel JavaScript - Full CRUD Implementation

// Global variables
let currentEditingProduct = null;
let currentEditingProject = null;
let currentEditingUser = null;

// Initialize default products if not exists
function initializeProducts() {
    if (!localStorage.getItem('adminProducts')) {
        const defaultProducts = [
            {
                id: 1,
                title: 'Elegant Bedroom Interior',
                category: 'interior',
                description: 'Sophisticated color palette for master bedrooms with accent walls featuring warm neutrals and soft pastels.',
                price: 25000,
                originalPrice: 35000,
                image: 'images/products/bedroom-elegant.jpg',
                badge: 'Bestseller',
                rating: 4.8,
                reviews: 124,
                features: ['Premium Quality Paint', 'Color Consultation', '3-Year Warranty'],
                inStock: true,
                popularity: 95,
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                title: 'Modern Kitchen Design',
                category: 'interior',
                description: 'Fresh and clean look for modern kitchen spaces with contemporary color schemes and durable finishes.',
                price: 30000,
                originalPrice: 42000,
                image: 'images/products/kitchen-modern.jpg',
                badge: 'New',
                rating: 4.6,
                reviews: 89,
                features: ['Moisture Resistant', 'Easy Clean Surface', 'Modern Color Palette'],
                inStock: true,
                popularity: 88,
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                title: 'Exterior House Makeover',
                category: 'exterior',
                description: 'Complete exterior transformation with weather-resistant paints and professional application.',
                price: 75000,
                originalPrice: 95000,
                image: 'images/products/house-exterior.jpg',
                badge: 'Premium',
                rating: 4.9,
                reviews: 203,
                features: ['Weather Protection', '10-Year Warranty', 'Free Color Consultation'],
                inStock: true,
                popularity: 92,
                createdAt: new Date().toISOString()
            },
            {
                id: 4,
                title: 'Office Interior Professional',
                category: 'commercial',
                description: 'Professional color scheme for productive work environments with employee wellbeing in mind.',
                price: 45000,
                originalPrice: 60000,
                image: 'images/products/office-commercial.jpg',
                badge: 'Popular',
                rating: 4.7,
                reviews: 156,
                features: ['Productivity Colors', 'Low VOC', 'Quick Drying'],
                inStock: true,
                popularity: 85,
                createdAt: new Date().toISOString()
            },
            {
                id: 5,
                title: 'Kids Room Fun Design',
                category: 'interior',
                description: 'Colorful and creative designs for children\'s spaces with safe, non-toxic paints.',
                price: 20000,
                originalPrice: 28000,
                image: 'images/products/kids-room.jpg',
                badge: 'Sale',
                rating: 4.5,
                reviews: 98,
                features: ['Child-Safe Paints', 'Washable Finish', 'Fun Themes Available'],
                inStock: true,
                popularity: 78,
                createdAt: new Date().toISOString()
            },
            {
                id: 6,
                title: 'Restaurant Interior',
                category: 'commercial',
                description: 'Appetizing color schemes for dining establishments that enhance the dining experience.',
                price: 55000,
                originalPrice: 70000,
                image: 'images/products/restaurant-interior.jpg',
                badge: 'Featured',
                rating: 4.8,
                reviews: 67,
                features: ['Appetite-Enhancing Colors', 'Durable Finish', 'Custom Branding'],
                inStock: true,
                popularity: 82,
                createdAt: new Date().toISOString()
            },
            {
                id: 7,
                title: 'Luxury Living Room',
                category: 'interior',
                description: 'High-end painting solutions for luxury living spaces with premium materials and finishes.',
                price: 40000,
                originalPrice: 52000,
                image: 'images/products/living-luxury.jpg',
                badge: 'Luxury',
                rating: 4.9,
                reviews: 143,
                features: ['Premium Materials', 'Custom Finishes', 'Designer Consultation'],
                inStock: true,
                popularity: 90,
                createdAt: new Date().toISOString()
            },
            {
                id: 8,
                title: 'Industrial Exterior',
                category: 'exterior',
                description: 'Durable and rugged painting solutions for industrial buildings and warehouses.',
                price: 85000,
                originalPrice: 110000,
                image: 'images/products/industrial-exterior.jpg',
                badge: 'Heavy Duty',
                rating: 4.6,
                reviews: 45,
                features: ['Industrial Grade', 'Chemical Resistant', '15-Year Warranty'],
                inStock: true,
                popularity: 70,
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('adminProducts', JSON.stringify(defaultProducts));
    }
}

// Initialize default projects if not exists
function initializeProjects() {
    if (!localStorage.getItem('adminProjects')) {
        const defaultProjects = [
            { id: 1, title: 'Modern Living Room', client: 'John Doe', status: 'completed', progress: 100, createdAt: new Date().toISOString() },
            { id: 2, title: 'Kitchen Renovation', client: 'Jane Smith', status: 'processing', progress: 75, createdAt: new Date().toISOString() },
            { id: 3, title: 'Office Interior', client: 'ABC Corp', status: 'pending', progress: 0, createdAt: new Date().toISOString() },
            { id: 4, title: 'Bedroom Makeover', client: 'Mike Johnson', status: 'confirmed', progress: 25, createdAt: new Date().toISOString() },
            { id: 5, title: 'Commercial Space', client: 'XYZ Ltd', status: 'processing', progress: 60, createdAt: new Date().toISOString() }
        ];
        localStorage.setItem('adminProjects', JSON.stringify(defaultProjects));
    }
}

// Check if user is admin
function checkAdminAccess() {
    // Auto-initialize admin credentials if they don't exist
    if (!localStorage.getItem('adminCredentials')) {
        const defaultAdminCredentials = {
            email: 'admin@paintsworks.com',
            password: 'admin123',
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('adminCredentials', JSON.stringify(defaultAdminCredentials));
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
    const adminCredentials = JSON.parse(localStorage.getItem('adminCredentials') || '{}');
    
    const adminEmail = adminCredentials.email || 'admin@paintsworks.com';
    
    if (!currentUser || currentUser.email !== adminEmail) {
        // Show alert with admin credentials before redirecting
        alert('Admin Access Required\n\nPlease login with admin credentials:\nEmail: ' + adminEmail + '\nPassword: ' + adminCredentials.password);
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    if (!checkAdminAccess()) return;
    
    // Initialize data
    initializeProducts();
    initializeProjects();
    
    // Set admin user display
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
    document.getElementById('adminUser').textContent = currentUser.name || 'Admin User';
    
    // Load dashboard data
    loadDashboardData();
    
    // Setup navigation
    setupNavigation();
    
    // Setup form handlers
    setupFormHandlers();
    
    // Create modal containers
    createModals();
});

// Setup navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.dataset.section;
            const section = document.getElementById(sectionId);
            if (section) {
                section.classList.add('active');
                
                // Load section-specific data
                loadSectionData(sectionId);
            }
        });
    });
}

// Load section-specific data
function loadSectionData(section) {
    switch(section) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'products':
            loadProducts();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'users':
            loadUsers();
            break;
        case 'projects':
            loadProjects();
            break;
    }
}

// Load dashboard data
function loadDashboardData() {
    // Get data from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const orders = getOrdersFromStorage();
    const products = getProductsFromStorage();
    
    // Update stats
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('totalUsers').textContent = users.length;
    
    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    document.getElementById('totalRevenue').textContent = `Rs.${totalRevenue.toLocaleString()}`;
    
    // Load recent orders
    loadRecentOrders(orders);
}

// Normalize order data for admin display
function normalizeOrderForAdmin(order, userContext = null) {
    const customer = order.customer || {};
    const items = order.items || [];
    return {
        ...order,
        customerName: order.customerName || userContext?.name || `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Guest',
        customerEmail: order.customerEmail || userContext?.email || customer.email || 'N/A',
        productName: order.productName || items.map(i => i.name || i.title).filter(Boolean).join(', ') || 'Order items',
        total: order.total ?? order.pricing?.total ?? 0,
        date: order.date || order.createdAt,
        status: order.status || 'pending'
    };
}

function sameId(a, b) {
    return String(a) === String(b);
}

// Get orders from localStorage (users, global orders, and per-user order keys)
function getOrdersFromStorage() {
    const orders = [];
    const seen = new Set();

    const addOrder = (order, userContext = null) => {
        const normalized = normalizeOrderForAdmin(order, userContext);
        const key = normalized.id || normalized.orderNumber;
        if (key && seen.has(String(key))) return;
        if (key) seen.add(String(key));
        orders.push(normalized);
    };

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.forEach(user => {
        if (user.orders && user.orders.length > 0) {
            user.orders.forEach(order => addOrder(order, user));
        }
    });

    const globalOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    globalOrders.forEach(order => addOrder(order));

    return orders.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
}

// Get products from localStorage
function getProductsFromStorage() {
    return JSON.parse(localStorage.getItem('adminProducts') || '[]');
}

// Save products to localStorage
function saveProductsToStorage(products) {
    localStorage.setItem('adminProducts', JSON.stringify(products));
    // Also update the public products for the main site
    localStorage.setItem('products', JSON.stringify(products));
}

// Get projects from localStorage
function getProjectsFromStorage() {
    return JSON.parse(localStorage.getItem('adminProjects') || '[]');
}

// Save projects to localStorage
function saveProjectsToStorage(projects) {
    localStorage.setItem('adminProjects', JSON.stringify(projects));
}

// Load recent orders
function loadRecentOrders(orders) {
    const tbody = document.getElementById('recentOrders');
    const recentOrders = orders.slice(0, 5);
    
    tbody.innerHTML = recentOrders.map(order => `
        <tr>
            <td>#${order.id || Math.random().toString(36).substr(2, 9)}</td>
            <td>${order.customerName || 'Unknown'}</td>
            <td>${order.productName || 'Sample Product'}</td>
            <td>Rs.${(order.total || 0).toLocaleString()}</td>
            <td><span class="status-badge status-${order.status || 'pending'}">${order.status || 'Pending'}</span></td>
            <td>${new Date(order.date || Date.now()).toLocaleDateString()}</td>
        </tr>
    `).join('');
}

// Load products
function loadProducts() {
    const products = getProductsFromStorage();
    const tbody = document.getElementById('productsTable');
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No products found. Click "Add Product" to create one.</td></tr>';
        return;
    }
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <img src="${product.image || 'images/placeholder.jpg'}" alt="${product.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;">
                    <span>${product.title}</span>
                </div>
            </td>
            <td>${product.category}</td>
            <td>Rs.${product.price?.toLocaleString() || 0}</td>
            <td>
                <span class="status-badge ${product.inStock ? 'status-completed' : 'status-cancelled'}">
                    ${product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
            </td>
            <td>
                <div class="admin-actions">
                    <button class="btn-edit" onclick="editProduct(${product.id})" title="Edit Product">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteProduct(${product.id})" title="Delete Product">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load orders
function loadOrders() {
    const orders = getOrdersFromStorage();
    const tbody = document.getElementById('ordersTable');
    
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.id || Math.random().toString(36).substr(2, 9)}</td>
            <td>${order.customerName || 'Unknown'}</td>
            <td>${order.customerEmail || 'N/A'}</td>
            <td>${order.productName || 'Sample Product'}</td>
            <td>Rs.${(order.total || 0).toLocaleString()}</td>
            <td>
                <select class="form-input" onchange="updateOrderStatus('${order.id}', this.value)">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td>${new Date(order.date || Date.now()).toLocaleDateString()}</td>
            <td>
                <div class="admin-actions">
                    <button class="btn-edit" onclick="viewOrder('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load users
function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const tbody = document.getElementById('usersTable');
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            <td>${user.orders ? user.orders.length : 0}</td>
            <td>
                <div class="admin-actions">
                    <button class="btn-edit" onclick="viewUser('${user.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteUser('${user.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load projects
function loadProjects() {
    const projects = getProjectsFromStorage();
    const tbody = document.getElementById('projectsTable');
    
    if (projects.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No projects found. Click "Add Project" to create one.</td></tr>';
        return;
    }
    
    tbody.innerHTML = projects.map(project => `
        <tr>
            <td>${project.id}</td>
            <td>${project.title}</td>
            <td>${project.client}</td>
            <td><span class="status-badge status-${project.status}">${project.status}</span></td>
            <td>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${project.progress || 0}%"></div>
                </div>
                ${project.progress || 0}%
            </td>
            <td>
                <div class="admin-actions">
                    <button class="btn-edit" onclick="editProject(${project.id})" title="Edit Project">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteProject(${project.id})" title="Delete Project">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Setup form handlers
function setupFormHandlers() {
    // Settings form
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('Settings saved successfully!', 'success');
        });
    }
}

// ==================== MODAL SYSTEM ====================

function createModals() {
    // Product Modal
    const productModal = document.createElement('div');
    productModal.id = 'productModal';
    productModal.className = 'admin-modal';
    productModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="productModalTitle">Add Product</h3>
                <button class="modal-close" onclick="closeProductModal()">&times;</button>
            </div>
            <form id="productForm">
                <input type="hidden" id="productId">
                <div class="form-row">
                    <div class="form-group">
                        <label>Product Title *</label>
                        <input type="text" id="productTitle" required class="form-input" placeholder="Enter product title">
                    </div>
                    <div class="form-group">
                        <label>Category *</label>
                        <select id="productCategory" required class="form-input">
                            <option value="">Select Category</option>
                            <option value="interior">Interior</option>
                            <option value="exterior">Exterior</option>
                            <option value="commercial">Commercial</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Price (Rs.) *</label>
                        <input type="number" id="productPrice" required class="form-input" placeholder="Enter price" min="0">
                    </div>
                    <div class="form-group">
                        <label>Original Price (Rs.)</label>
                        <input type="number" id="productOriginalPrice" class="form-input" placeholder="Enter original price (optional)" min="0">
                    </div>
                </div>
                <div class="form-group">
                    <label>Description *</label>
                    <textarea id="productDescription" required class="form-input" rows="3" placeholder="Enter product description"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Badge</label>
                        <select id="productBadge" class="form-input">
                            <option value="">None</option>
                            <option value="New">New</option>
                            <option value="Sale">Sale</option>
                            <option value="Bestseller">Bestseller</option>
                            <option value="Premium">Premium</option>
                            <option value="Popular">Popular</option>
                            <option value="Featured">Featured</option>
                            <option value="Luxury">Luxury</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Stock Status</label>
                        <select id="productInStock" class="form-input">
                            <option value="true">In Stock</option>
                            <option value="false">Out of Stock</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Features (comma separated)</label>
                    <input type="text" id="productFeatures" class="form-input" placeholder="e.g., Premium Quality, 3-Year Warranty, Free Consultation">
                </div>
                <div class="form-group">
                    <label>Product Images (Multiple)</label>
                    <div class="image-upload-container">
                        <input type="file" id="productImageInput" accept="image/*" class="form-input" multiple onchange="handleMultipleImagePreview(this)">
                        <small class="form-hint">Select multiple images. Large files are optimized before saving.</small>
                    </div>
                    <div id="imagePreviewGallery" class="image-preview-gallery"></div>
                </div>
                <div class="form-group">
                    <label>Or Image URLs (comma separated)</label>
                    <input type="text" id="productImageUrl" class="form-input" placeholder="images/products/image1.jpg, images/products/image2.jpg" oninput="updateMultipleImagePreviewFromUrl(this.value)">
                </div>
                <input type="hidden" id="productImagesData" value="">
                <div class="form-row">
                    <div class="form-group">
                        <label>Rating (0-5)</label>
                        <input type="number" id="productRating" class="form-input" min="0" max="5" step="0.1" value="4.5">
                    </div>
                    <div class="form-group">
                        <label>Reviews Count</label>
                        <input type="number" id="productReviews" class="form-input" min="0" value="0">
                    </div>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-outline" onclick="closeProductModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Product</button>
                </div>
            </form>
        </div>
    `;
    
    // Project Modal
    const projectModal = document.createElement('div');
    projectModal.id = 'projectModal';
    projectModal.className = 'admin-modal';
    projectModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="projectModalTitle">Add Project</h3>
                <button class="modal-close" onclick="closeProjectModal()">&times;</button>
            </div>
            <form id="projectForm">
                <input type="hidden" id="projectId">
                <div class="form-group">
                    <label>Project Title *</label>
                    <input type="text" id="projectTitle" required class="form-input" placeholder="Enter project title">
                </div>
                <div class="form-group">
                    <label>Client Name *</label>
                    <input type="text" id="projectClient" required class="form-input" placeholder="Enter client name">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Status *</label>
                        <select id="projectStatus" required class="form-input">
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Progress (%)</label>
                        <input type="number" id="projectProgress" class="form-input" min="0" max="100" value="0">
                    </div>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-outline" onclick="closeProjectModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Project</button>
                </div>
            </form>
        </div>
    `;
    
    // Delete Confirmation Modal
    const deleteModal = document.createElement('div');
    deleteModal.id = 'deleteModal';
    deleteModal.className = 'admin-modal';
    deleteModal.innerHTML = `
        <div class="modal-content modal-small">
            <div class="modal-header">
                <h3>Confirm Delete</h3>
                <button class="modal-close" onclick="closeDeleteModal()">&times;</button>
            </div>
            <div class="modal-body">
                <p id="deleteMessage">Are you sure you want to delete this item?</p>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-outline" onclick="closeDeleteModal()">Cancel</button>
                <button type="button" class="btn btn-danger" id="confirmDeleteBtn" onclick="confirmDelete()">Delete</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(productModal);
    document.body.appendChild(projectModal);
    document.body.appendChild(deleteModal);
    
    // Add modal styles
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .admin-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.6);
            z-index: 10000;
            justify-content: center;
            align-items: center;
            padding: 1rem;
        }
        .admin-modal.active {
            display: flex;
        }
        .modal-content {
            background: white;
            border-radius: 12px;
            width: 100%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .image-preview img {
            max-width: 200px;
            max-height: 200px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        /* Multiple Image Gallery */
        .image-preview-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 12px;
            margin-top: 15px;
            max-height: 310px;
            overflow-y: auto;
            padding-right: 4px;
        }

        .empty-image-gallery {
            grid-column: 1 / -1;
            padding: 1rem;
            border: 1px dashed #cbd5e0;
            border-radius: 8px;
            color: #718096;
            text-align: center;
        }

        .gallery-item {
            position: relative;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            aspect-ratio: 1;
        }

        .gallery-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

        .gallery-item .remove-image-btn {
            position: absolute;
            top: 5px;
            right: 5px;
            background: rgba(239, 68, 68, 0.9);
            color: white;
            border: none;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s ease;
        }

        .gallery-item .remove-image-btn:hover {
            background: rgba(220, 38, 38, 1);
            transform: scale(1.1);
        }

        .gallery-item .main-image-badge {
            position: absolute;
            bottom: 5px;
            left: 5px;
            background: rgba(16, 185, 129, 0.9);
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
        }
        .modal-small {
            max-width: 400px;
        }
        .modal-header {
            padding: 1.5rem;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .modal-header h3 {
            margin: 0;
            color: #2d3748;
        }
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #718096;
        }
        .modal-close:hover {
            color: #2d3748;
        }
        .modal-body {
            padding: 1.5rem;
        }
        .admin-modal form {
            padding: 1.5rem;
        }
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        .form-group {
            margin-bottom: 1rem;
        }
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #4a5568;
        }
        .form-input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 0.95rem;
        }
        .form-input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .form-hint {
            color: #718096;
            font-size: 0.8rem;
            margin-top: 0.25rem;
        }
        .image-upload-container {
            border: 2px dashed #e2e8f0;
            border-radius: 8px;
            padding: 1rem;
            text-align: center;
        }
        .image-preview {
            margin-top: 1rem;
            max-width: 200px;
            max-height: 150px;
            margin-left: auto;
            margin-right: auto;
        }
        .image-preview img {
            max-width: 100%;
            max-height: 150px;
            border-radius: 8px;
        }
        .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            padding: 1rem 1.5rem;
            border-top: 1px solid #e2e8f0;
        }
        .btn-danger {
            background: #f56565;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
        }
        .btn-danger:hover {
            background: #e53e3e;
        }
        .btn-outline {
            background: white;
            color: #4a5568;
            border: 1px solid #e2e8f0;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
        }
        .btn-outline:hover {
            background: #f7fafc;
        }
        .btn-primary {
            background: #667eea;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
        }
        .btn-primary:hover {
            background: #5568d3;
        }
        @media (max-width: 640px) {
            .form-row {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(modalStyles);
    
    // Setup form handlers
    document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
    document.getElementById('projectForm').addEventListener('submit', handleProjectSubmit);
}

// ==================== IMAGE HANDLING ====================

// Store for multiple images
let productImagesArray = [];

function uniqueImages(images) {
    return [...new Set((images || []).map(img => String(img).trim()).filter(Boolean))];
}

function parseImageUrls(urlString) {
    return uniqueImages(String(urlString || '').split(','));
}

function resizeImageFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const maxSize = 1200;
                const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
                const canvas = document.createElement('canvas');
                canvas.width = Math.max(1, Math.round(img.width * scale));
                canvas.height = Math.max(1, Math.round(img.height * scale));

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.82));
            };
            img.onerror = reject;
            img.src = reader.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function handleMultipleImagePreview(input) {
    if (!input.files || input.files.length === 0) return;

    try {
        const optimizedImages = await Promise.all(Array.from(input.files).map(resizeImageFile));
        productImagesArray = uniqueImages([...productImagesArray, ...optimizedImages]);
        renderImageGallery();
        updateImagesDataField();
        showToast(`${optimizedImages.length} image${optimizedImages.length === 1 ? '' : 's'} added`, 'success');
    } catch (error) {
        console.error('Image processing failed:', error);
        showToast('Could not add one or more images', 'error');
    } finally {
        input.value = '';
    }
}

function updateMultipleImagePreviewFromUrl(urlString) {
    productImagesArray = parseImageUrls(urlString);
    renderImageGallery();
    updateImagesDataField(false);
}

function renderImageGallery() {
    const gallery = document.getElementById('imagePreviewGallery');
    if (!gallery) return;

    if (productImagesArray.length === 0) {
        gallery.innerHTML = '<div class="empty-image-gallery">No images selected</div>';
        return;
    }

    gallery.innerHTML = productImagesArray.map((img, index) => `
        <div class="gallery-item" data-index="${index}">
            <img src="${img}" alt="Image ${index + 1}" onerror="this.src='images/placeholder.jpg'">
            <button type="button" class="remove-image-btn" onclick="removeImage(${index})" title="Remove image">
                <i class="fas fa-times"></i>
            </button>
            ${index === 0 ? '<span class="main-image-badge">Main</span>' : ''}
        </div>
    `).join('');
}

function removeImage(index) {
    productImagesArray.splice(index, 1);
    renderImageGallery();
    updateImagesDataField();
}

function updateImagesDataField(syncUrlInput = true) {
    productImagesArray = uniqueImages(productImagesArray);

    const field = document.getElementById('productImagesData');
    if (field) {
        field.value = JSON.stringify(productImagesArray);
    }

    if (syncUrlInput) {
        const urlField = document.getElementById('productImageUrl');
        if (urlField) {
            urlField.value = productImagesArray.join(', ');
        }
    }
}

// Keep old functions for backward compatibility
function handleImagePreview(input) {
    handleMultipleImagePreview(input);
}

function updateImagePreviewFromUrl(url) {
    updateMultipleImagePreviewFromUrl(url);
}

// ==================== PRODUCT CRUD ====================

function addProduct() {
    currentEditingProduct = null;
    productImagesArray = []; // Reset images array
    document.getElementById('productModalTitle').textContent = 'Add Product';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    renderImageGallery();
    updateImagesDataField();
    openModal('productModal');
}

function editProduct(id) {
    const products = getProductsFromStorage();
    const product = products.find(p => sameId(p.id, id));
    if (!product) {
        showToast('Product not found!', 'error');
        return;
    }
    
    currentEditingProduct = product;
    document.getElementById('productModalTitle').textContent = 'Edit Product';
    document.getElementById('productId').value = product.id;
    document.getElementById('productTitle').value = product.title || '';
    document.getElementById('productCategory').value = product.category || '';
    document.getElementById('productPrice').value = product.price || '';
    document.getElementById('productOriginalPrice').value = product.originalPrice || '';
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productBadge').value = product.badge || '';
    document.getElementById('productInStock').value = product.inStock ? 'true' : 'false';
    document.getElementById('productFeatures').value = product.features ? product.features.join(', ') : '';
    document.getElementById('productRating').value = product.rating || 4.5;
    document.getElementById('productReviews').value = product.reviews || 0;
    
    // Show image preview - handle both single image (legacy) and images array
    productImagesArray = uniqueImages([...(Array.isArray(product.images) ? product.images : []), product.image]);
    renderImageGallery();
    updateImagesDataField();
    
    openModal('productModal');
}

function handleProductSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('productId').value;
    const title = document.getElementById('productTitle').value.trim();
    const category = document.getElementById('productCategory').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const originalPrice = parseFloat(document.getElementById('productOriginalPrice').value) || null;
    const description = document.getElementById('productDescription').value.trim();
    const badge = document.getElementById('productBadge').value;
    const inStock = document.getElementById('productInStock').value === 'true';
    const featuresText = document.getElementById('productFeatures').value;
    const features = featuresText ? featuresText.split(',').map(f => f.trim()).filter(f => f) : [];
    const rating = parseFloat(document.getElementById('productRating').value) || 4.5;
    const reviews = parseInt(document.getElementById('productReviews').value) || 0;
    
    const typedImages = parseImageUrls(document.getElementById('productImageUrl').value);
    const storedImages = (() => {
        try {
            return JSON.parse(document.getElementById('productImagesData').value || '[]');
        } catch (error) {
            return [];
        }
    })();

    // Handle multiple images (keep existing when editing if none changed)
    let images = uniqueImages([...productImagesArray, ...storedImages, ...typedImages]);
    images = images.length > 0 ? images : null;
    if (!images && currentEditingProduct) {
        images = uniqueImages([...(Array.isArray(currentEditingProduct.images) ? currentEditingProduct.images : []), currentEditingProduct.image]);
    }
    if (!images || images.length === 0) {
        images = ['images/products/placeholder.jpg'];
    }
    const image = images[0];

    const products = getProductsFromStorage();
    
    if (id) {
        // Update existing product
        const index = products.findIndex(p => sameId(p.id, id));
        if (index !== -1) {
            products[index] = {
                ...products[index],
                title,
                category,
                price,
                originalPrice,
                description,
                badge,
                inStock,
                features,
                images,
                image,
                rating,
                reviews,
                updatedAt: new Date().toISOString()
            };
            showToast('Product updated successfully!', 'success');
        }
    } else {
        // Create new product
        const newProduct = {
            id: Date.now(),
            title,
            category,
            price,
            originalPrice,
            description,
            badge,
            inStock,
            features,
            images,
            image,
            rating,
            reviews,
            popularity: 50,
            createdAt: new Date().toISOString()
        };
        products.push(newProduct);
        showToast('Product created successfully!', 'success');
    }
    
    saveProductsToStorage(products);
    closeProductModal();
    loadProducts();
    loadDashboardData();
}

let deleteCallback = null;

function deleteProduct(id) {
    deleteCallback = () => {
        const products = getProductsFromStorage();
        const filtered = products.filter(p => !sameId(p.id, id));
        saveProductsToStorage(filtered);
        loadProducts();
        loadDashboardData();
        showToast('Product deleted successfully!', 'success');
        closeDeleteModal();
    };
    document.getElementById('deleteMessage').textContent = 'Are you sure you want to delete this product? This action cannot be undone.';
    openModal('deleteModal');
}

// ==================== PROJECT CRUD ====================

function addProject() {
    currentEditingProject = null;
    document.getElementById('projectModalTitle').textContent = 'Add Project';
    document.getElementById('projectForm').reset();
    document.getElementById('projectId').value = '';
    openModal('projectModal');
}

function editProject(id) {
    const projects = getProjectsFromStorage();
    const project = projects.find(p => sameId(p.id, id));
    if (!project) {
        showToast('Project not found!', 'error');
        return;
    }
    
    currentEditingProject = project;
    document.getElementById('projectModalTitle').textContent = 'Edit Project';
    document.getElementById('projectId').value = project.id;
    document.getElementById('projectTitle').value = project.title || '';
    document.getElementById('projectClient').value = project.client || '';
    document.getElementById('projectStatus').value = project.status || 'pending';
    document.getElementById('projectProgress').value = project.progress || 0;
    
    openModal('projectModal');
}

function handleProjectSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('projectId').value;
    const title = document.getElementById('projectTitle').value.trim();
    const client = document.getElementById('projectClient').value.trim();
    const status = document.getElementById('projectStatus').value;
    const progress = parseInt(document.getElementById('projectProgress').value) || 0;
    
    const projects = getProjectsFromStorage();
    
    if (id) {
        // Update existing project
        const index = projects.findIndex(p => sameId(p.id, id));
        if (index !== -1) {
            projects[index] = {
                ...projects[index],
                title,
                client,
                status,
                progress,
                updatedAt: new Date().toISOString()
            };
            showToast('Project updated successfully!', 'success');
        }
    } else {
        // Create new project
        const newProject = {
            id: Date.now(),
            title,
            client,
            status,
            progress,
            createdAt: new Date().toISOString()
        };
        projects.push(newProject);
        showToast('Project created successfully!', 'success');
    }
    
    saveProjectsToStorage(projects);
    closeProjectModal();
    loadProjects();
    loadDashboardData();
}

function deleteProject(id) {
    deleteCallback = () => {
        const projects = getProjectsFromStorage();
        const filtered = projects.filter(p => !sameId(p.id, id));
        saveProjectsToStorage(filtered);
        loadProjects();
        loadDashboardData();
        showToast('Project deleted successfully!', 'success');
        closeDeleteModal();
    };
    document.getElementById('deleteMessage').textContent = 'Are you sure you want to delete this project? This action cannot be undone.';
    openModal('deleteModal');
}

function confirmDelete() {
    if (deleteCallback) {
        deleteCallback();
    }
}

// ==================== MODAL UTILITIES ====================

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    document.body.style.overflow = '';
    currentEditingProduct = null;
    productImagesArray = [];
}

function closeProjectModal() {
    document.getElementById('projectModal').classList.remove('active');
    document.body.style.overflow = '';
    currentEditingProject = null;
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    document.body.style.overflow = '';
    deleteCallback = null;
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('admin-modal')) {
        event.target.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function viewOrder(id) {
    const orders = getOrdersFromStorage();
    const order = orders.find(o => sameId(o.id, id));
    if (order) {
        const content = `
            <div style="text-align: left;">
                <p><strong>Order ID:</strong> #${order.id}</p>
                <p><strong>Customer:</strong> ${order.customerName || 'N/A'}</p>
                <p><strong>Email:</strong> ${order.customerEmail || 'N/A'}</p>
                <p><strong>Product:</strong> ${order.productName || 'N/A'}</p>
                <p><strong>Amount:</strong> Rs.${(order.total || 0).toLocaleString()}</p>
                <p><strong>Status:</strong> ${order.status || 'Pending'}</p>
                <p><strong>Date:</strong> ${new Date(order.date || Date.now()).toLocaleString()}</p>
            </div>
        `;
        showToastModal('Order Details', content);
    }
}

function viewUser(id) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => sameId(u.id, id));
    if (user) {
        const content = `
            <div style="text-align: left;">
                <p><strong>User ID:</strong> ${user.id}</p>
                <p><strong>Name:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Phone:</strong> ${user.phone || 'N/A'}</p>
                <p><strong>Role:</strong> ${user.role || 'user'}</p>
                <p><strong>Registered:</strong> ${new Date(user.created_at || user.createdAt).toLocaleString()}</p>
                <p><strong>Orders:</strong> ${user.orders ? user.orders.length : 0}</p>
            </div>
        `;
        showToastModal('User Details', content);
    }
}

function deleteUser(id) {
    deleteCallback = () => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const filtered = users.filter(u => !sameId(u.id, id));
        localStorage.setItem('users', JSON.stringify(filtered));
        loadUsers();
        loadDashboardData();
        showToast('User deleted successfully!', 'success');
        closeDeleteModal();
    };
    document.getElementById('deleteMessage').textContent = 'Are you sure you want to delete this user? This action cannot be undone.';
    openModal('deleteModal');
}

function showToastModal(title, content) {
    // Create a simple info modal
    const modal = document.createElement('div');
    modal.className = 'admin-modal active';
    modal.innerHTML = `
        <div class="modal-content modal-small">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="this.closest('.admin-modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-primary" onclick="this.closest('.admin-modal').remove()">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function updateOrderStatus(orderId, status) {
    let updated = false;
    const now = new Date().toISOString();

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.forEach(user => {
        if (user.orders) {
            user.orders.forEach(order => {
                if (sameId(order.id, orderId)) {
                    order.status = status;
                    order.updatedAt = now;
                    updated = true;
                }
            });
        }
    });
    if (updated) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    allOrders.forEach(order => {
        if (sameId(order.id, orderId)) {
            order.status = status;
            order.updatedAt = now;
            updated = true;
        }
    });
    if (updated) {
        localStorage.setItem('orders', JSON.stringify(allOrders));
    }

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('userOrders_')) {
            const userOrders = JSON.parse(localStorage.getItem(key) || '[]');
            let keyUpdated = false;
            userOrders.forEach(order => {
                if (sameId(order.id, orderId)) {
                    order.status = status;
                    order.updatedAt = now;
                    keyUpdated = true;
                    updated = true;
                }
            });
            if (keyUpdated) {
                localStorage.setItem(key, JSON.stringify(userOrders));
            }
        }
    }

    if (updated) {
        showToast(`Order status updated to ${status}!`, 'success');
        loadOrders();
        loadDashboardData();
    } else {
        showToast('Order not found', 'error');
    }
}

// Logout
function logout() {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Utility function for toast notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1'};
        color: white;
        border-radius: 8px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
    }
    
    .status-pending { background: #fef3c7; color: #92400e; }
    .status-confirmed { background: #dbeafe; color: #1e40af; }
    .status-processing { background: #e0e7ff; color: #3730a3; }
    .status-completed { background: #d1fae5; color: #065f46; }
    .status-cancelled { background: #fee2e2; color: #991b1b; }
    
    .progress-bar {
        width: 100px;
        height: 8px;
        background: #e2e8f0;
        border-radius: 4px;
        overflow: hidden;
    }
    
    .progress-fill {
        height: 100%;
        background: #48bb78;
        transition: width 0.3s ease;
    }
`;
document.head.appendChild(style);
