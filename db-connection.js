// Database Connection Configuration
// Paints Works - Database Management System

class DatabaseConnection {
    constructor() {
        this.connection = null;
        this.config = {
            host: 'localhost',
            database: 'paints_works',
            user: 'root',
            password: '',
            port: 3306,
            charset: 'utf8mb4'
        };
    }

    // Initialize database connection
    async connect() {
        try {
            // For production, use proper MySQL connection
            if (typeof mysql !== 'undefined') {
                this.connection = await mysql.createConnection(this.config);
                await this.connection.connect();
                console.log('Connected to MySQL database');
                return true;
            } 
            // For development/demo, use localStorage simulation
            else {
                this.initializeLocalStorage();
                console.log('Using localStorage for demo mode');
                return true;
            }
        } catch (error) {
            console.error('Database connection failed:', error);
            return false;
        }
    }

    // Initialize localStorage with sample data
    initializeLocalStorage() {
        // Initialize categories if not exists
        if (!localStorage.getItem('categories')) {
            const categories = [
                { id: 1, name: 'Interior', description: 'Interior painting services for residential spaces', slug: 'interior' },
                { id: 2, name: 'Exterior', description: 'Exterior painting services for buildings', slug: 'exterior' },
                { id: 3, name: 'Commercial', description: 'Commercial painting services for businesses', slug: 'commercial' }
            ];
            localStorage.setItem('categories', JSON.stringify(categories));
        }

        // Initialize products if not exists
        if (!localStorage.getItem('products')) {
            const products = [
                {
                    id: 1,
                    title: 'Elegant Bedroom Interior',
                    slug: 'elegant-bedroom-interior',
                    category_id: 1,
                    category: 'interior',
                    description: 'Sophisticated color palette for master bedrooms with accent walls featuring warm neutrals and soft pastels.',
                    price: 25000.00,
                    original_price: 35000.00,
                    image: 'images/products/bedroom-elegant.jpg',
                    badge: 'Bestseller',
                    rating: 4.8,
                    reviews: 124,
                    features: ['Premium Quality Paint', 'Color Consultation', '3-Year Warranty'],
                    in_stock: true,
                    popularity: 95
                },
                {
                    id: 2,
                    title: 'Modern Kitchen Design',
                    slug: 'modern-kitchen-design',
                    category_id: 1,
                    category: 'interior',
                    description: 'Fresh and clean look for modern kitchen spaces with contemporary color schemes and durable finishes.',
                    price: 30000.00,
                    original_price: 42000.00,
                    image: 'images/products/kitchen-modern.jpg',
                    badge: 'New',
                    rating: 4.6,
                    reviews: 89,
                    features: ['Moisture Resistant', 'Easy Clean Surface', 'Modern Color Palette'],
                    in_stock: true,
                    popularity: 88
                },
                {
                    id: 3,
                    title: 'Exterior House Makeover',
                    slug: 'exterior-house-makeover',
                    category_id: 2,
                    category: 'exterior',
                    description: 'Complete exterior transformation with weather-resistant paints and professional application.',
                    price: 75000.00,
                    original_price: 95000.00,
                    image: 'images/products/house-exterior.jpg',
                    badge: 'Premium',
                    rating: 4.9,
                    reviews: 203,
                    features: ['Weather Protection', '10-Year Warranty', 'Free Color Consultation'],
                    in_stock: true,
                    popularity: 92
                },
                {
                    id: 4,
                    title: 'Office Interior Professional',
                    slug: 'office-interior-professional',
                    category_id: 3,
                    category: 'commercial',
                    description: 'Professional color scheme for productive work environments with employee wellbeing in mind.',
                    price: 45000.00,
                    original_price: 60000.00,
                    image: 'images/products/office-commercial.jpg',
                    badge: 'Popular',
                    rating: 4.7,
                    reviews: 156,
                    features: ['Productivity Colors', 'Low VOC', 'Quick Drying'],
                    in_stock: true,
                    popularity: 85
                },
                {
                    id: 5,
                    title: 'Kids Room Fun Design',
                    slug: 'kids-room-fun-design',
                    category_id: 1,
                    category: 'interior',
                    description: 'Colorful and creative designs for children\'s spaces with safe, non-toxic paints.',
                    price: 20000.00,
                    original_price: 28000.00,
                    image: 'images/products/kids-room.jpg',
                    badge: 'Sale',
                    rating: 4.5,
                    reviews: 98,
                    features: ['Child-Safe Paints', 'Washable Finish', 'Fun Themes Available'],
                    in_stock: true,
                    popularity: 78
                },
                {
                    id: 6,
                    title: 'Restaurant Interior',
                    slug: 'restaurant-interior',
                    category_id: 3,
                    category: 'commercial',
                    description: 'Appetizing color schemes for dining establishments that enhance the dining experience.',
                    price: 55000.00,
                    original_price: 70000.00,
                    image: 'images/products/restaurant-interior.jpg',
                    badge: 'Featured',
                    rating: 4.8,
                    reviews: 67,
                    features: ['Appetite-Enhancing Colors', 'Durable Finish', 'Custom Branding'],
                    in_stock: true,
                    popularity: 82
                },
                {
                    id: 7,
                    title: 'Luxury Living Room',
                    slug: 'luxury-living-room',
                    category_id: 1,
                    category: 'interior',
                    description: 'High-end painting solutions for luxury living spaces with premium materials and finishes.',
                    price: 40000.00,
                    original_price: 52000.00,
                    image: 'images/products/living-luxury.jpg',
                    badge: 'Luxury',
                    rating: 4.9,
                    reviews: 143,
                    features: ['Premium Materials', 'Custom Finishes', 'Designer Consultation'],
                    in_stock: true,
                    popularity: 90
                },
                {
                    id: 8,
                    title: 'Industrial Exterior',
                    slug: 'industrial-exterior',
                    category_id: 2,
                    category: 'exterior',
                    description: 'Durable and rugged painting solutions for industrial buildings and warehouses.',
                    price: 85000.00,
                    original_price: 110000.00,
                    image: 'images/products/industrial-exterior.jpg',
                    badge: 'Heavy Duty',
                    rating: 4.6,
                    reviews: 45,
                    features: ['Industrial Grade', 'Chemical Resistant', '15-Year Warranty'],
                    in_stock: true,
                    popularity: 70
                }
            ];
            localStorage.setItem('products', JSON.stringify(products));
        }

        // Initialize testimonials if not exists
        if (!localStorage.getItem('testimonials')) {
            const testimonials = [
                {
                    id: 1,
                    name: 'Sarah Johnson',
                    email: 'sarah@example.com',
                    role: 'Homeowner',
                    content: 'Amazing painting service! The team was professional, punctual, and the quality exceeded our expectations. Our bedroom looks absolutely stunning!',
                    rating: 4.8,
                    avatar: 'images/avatar1.jpg',
                    is_featured: true,
                    is_active: true
                },
                {
                    id: 2,
                    name: 'Mike Chen',
                    email: 'mike@example.com',
                    role: 'Business Owner',
                    content: 'The digital management system made tracking our project so easy and transparent. Highly recommend their services!',
                    rating: 4.9,
                    avatar: 'images/avatar2.jpg',
                    is_featured: true,
                    is_active: true
                },
                {
                    id: 3,
                    name: 'Emily Davis',
                    email: 'emily@example.com',
                    role: 'Property Manager',
                    content: 'Professional, reliable, and affordable. They completed our office painting project on time with excellent results.',
                    rating: 4.7,
                    avatar: 'images/avatar3.jpg',
                    is_featured: false,
                    is_active: true
                }
            ];
            localStorage.setItem('testimonials', JSON.stringify(testimonials));
        }

        // Initialize promo codes if not exists
        if (!localStorage.getItem('promoCodes')) {
            const promoCodes = [
                {
                    id: 1,
                    code: 'SAVE10',
                    description: 'Save 10% on orders above ₹25,000',
                    discount_type: 'percentage',
                    discount_value: 10.00,
                    min_amount: 25000.00,
                    usage_limit: 100,
                    usage_count: 0,
                    starts_at: new Date().toISOString(),
                    expires_at: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
                    is_active: true
                },
                {
                    id: 2,
                    code: 'SAVE20',
                    description: 'Save 20% on orders above ₹35,000',
                    discount_type: 'percentage',
                    discount_value: 20.00,
                    min_amount: 35000.00,
                    usage_limit: 50,
                    usage_count: 0,
                    starts_at: new Date().toISOString(),
                    expires_at: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
                    is_active: true
                },
                {
                    id: 3,
                    code: 'WELCOME',
                    description: 'Welcome discount for new customers',
                    discount_type: 'percentage',
                    discount_value: 15.00,
                    min_amount: 15000.00,
                    usage_limit: 200,
                    usage_count: 0,
                    starts_at: new Date().toISOString(),
                    expires_at: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000).toISOString(),
                    is_active: true
                },
                {
                    id: 4,
                    code: 'FLAT50',
                    description: 'Flat ₹50 off any order',
                    discount_type: 'fixed',
                    discount_value: 50.00,
                    min_amount: 0.00,
                    usage_limit: 500,
                    usage_count: 0,
                    starts_at: new Date().toISOString(),
                    expires_at: new Date(Date.now() + 1 * 30 * 24 * 60 * 60 * 1000).toISOString(),
                    is_active: true
                }
            ];
            localStorage.setItem('promoCodes', JSON.stringify(promoCodes));
        }

        // Initialize users if not exists
        if (!localStorage.getItem('users')) {
            const users = [
                {
                    id: 1,
                    name: 'Admin User',
                    email: 'admin@paintsworks.com',
                    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
                    phone: '+91 9876543210',
                    role: 'admin',
                    address: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    is_active: true
                },
                {
                    id: 2,
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
                    phone: '+91 9876543211',
                    role: 'user',
                    address: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    is_active: true
                }
            ];
            localStorage.setItem('users', JSON.stringify(users));
        }
    }

    // Execute query (for production MySQL)
    async query(sql, params = []) {
        if (!this.connection) {
            throw new Error('Database not connected');
        }
        
        try {
            const [rows] = await this.connection.execute(sql, params);
            return rows;
        } catch (error) {
            console.error('Query execution failed:', error);
            throw error;
        }
    }

    // Get all products
    async getProducts() {
        if (typeof mysql !== 'undefined') {
            return await this.query('SELECT * FROM products ORDER BY popularity DESC');
        } else {
            return JSON.parse(localStorage.getItem('products') || '[]');
        }
    }

    // Get product by ID
    async getProductById(id) {
        if (typeof mysql !== 'undefined') {
            const result = await this.query('SELECT * FROM products WHERE id = ?', [id]);
            return result[0] || null;
        } else {
            const products = JSON.parse(localStorage.getItem('products') || '[]');
            return products.find(p => p.id == id) || null;
        }
    }

    // Get products by category
    async getProductsByCategory(categorySlug) {
        if (typeof mysql !== 'undefined') {
            const result = await this.query(`
                SELECT p.*, c.slug as category_slug 
                FROM products p 
                JOIN categories c ON p.category_id = c.id 
                WHERE c.slug = ? 
                ORDER BY p.popularity DESC
            `, [categorySlug]);
            return result;
        } else {
            const products = JSON.parse(localStorage.getItem('products') || '[]');
            return products.filter(p => p.category === categorySlug);
        }
    }

    // Get all categories
    async getCategories() {
        if (typeof mysql !== 'undefined') {
            return await this.query('SELECT * FROM categories ORDER BY name');
        } else {
            return JSON.parse(localStorage.getItem('categories') || '[]');
        }
    }

    // Get user by email
    async getUserByEmail(email) {
        if (typeof mysql !== 'undefined') {
            const result = await this.query('SELECT * FROM users WHERE email = ?', [email]);
            return result[0] || null;
        } else {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            return users.find(u => u.email === email) || null;
        }
    }

    // Get user by ID
    async getUserById(id) {
        if (typeof mysql !== 'undefined') {
            const result = await this.query('SELECT * FROM users WHERE id = ?', [id]);
            return result[0] || null;
        } else {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            return users.find(u => u.id == id) || null;
        }
    }

    // Create new user
    async createUser(userData) {
        if (typeof mysql !== 'undefined') {
            const result = await this.query(`
                INSERT INTO users (name, email, password, phone, role, address) 
                VALUES (?, ?, ?, ?, ?, ?)
            `, [userData.name, userData.email, userData.password, userData.phone, userData.role, userData.address]);
            return result.insertId;
        } else {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const newUser = {
                id: Date.now(),
                ...userData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                is_active: true
            };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            return newUser.id;
        }
    }

    // Save order
    async saveOrder(orderData) {
        if (typeof mysql !== 'undefined') {
            const result = await this.query(`
                INSERT INTO orders (order_number, user_id, status, subtotal, tax, shipping, discount, total, payment_method, payment_status, shipping_address, billing_address, notes) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                orderData.orderNumber,
                orderData.userId,
                orderData.status,
                orderData.subtotal,
                orderData.tax,
                orderData.shipping,
                orderData.discount,
                orderData.total,
                orderData.paymentMethod,
                orderData.paymentStatus,
                JSON.stringify(orderData.shippingAddress),
                JSON.stringify(orderData.billingAddress),
                orderData.notes
            ]);
            
            // Save order items
            for (const item of orderData.items) {
                await this.query(`
                    INSERT INTO order_items (order_id, product_id, product_title, quantity, price, total) 
                    VALUES (?, ?, ?, ?, ?, ?)
                `, [result.insertId, item.productId, item.productTitle, item.quantity, item.price, item.total]);
            }
            
            return result.insertId;
        } else {
            // For localStorage demo
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const newOrder = {
                id: Date.now(),
                order_number: `PW${Date.now()}`,
                ...orderData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            orders.push(newOrder);
            localStorage.setItem('orders', JSON.stringify(orders));
            return newOrder.id;
        }
    }

    // Get user orders
    async getUserOrders(userId) {
        if (typeof mysql !== 'undefined') {
            return await this.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        } else {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            return orders.filter(o => o.userId === userId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
    }

    // Get testimonials
    async getTestimonials() {
        if (typeof mysql !== 'undefined') {
            return await this.query('SELECT * FROM testimonials WHERE is_active = 1 ORDER BY is_featured DESC, rating DESC');
        } else {
            return JSON.parse(localStorage.getItem('testimonials') || '[]');
        }
    }

    // Get promo codes
    async getPromoCodes() {
        if (typeof mysql !== 'undefined') {
            return await this.query('SELECT * FROM promo_codes WHERE is_active = 1 ORDER BY created_at DESC');
        } else {
            return JSON.parse(localStorage.getItem('promoCodes') || '[]');
        }
    }

    // Validate promo code
    async validatePromoCode(code) {
        if (typeof mysql !== 'undefined') {
            const result = await this.query(`
                SELECT * FROM promo_codes 
                WHERE code = ? AND is_active = 1 AND (expires_at IS NULL OR expires_at > NOW())
            `, [code]);
            
            if (result.length > 0) {
                return result[0];
            }
            return null;
        } else {
            const promoCodes = JSON.parse(localStorage.getItem('promoCodes') || '[]');
            const promo = promoCodes.find(p => p.code === code && p.is_active);
            
            if (promo) {
                const now = new Date();
                const expires = new Date(promo.expires_at);
                if (expires > now) {
                    return promo;
                }
            }
            return null;
        }
    }

    // Update promo code usage
    async updatePromoUsage(codeId) {
        if (typeof mysql !== 'undefined') {
            await this.query('UPDATE promo_codes SET usage_count = usage_count + 1 WHERE id = ?', [codeId]);
        } else {
            const promoCodes = JSON.parse(localStorage.getItem('promoCodes') || '[]');
            const promo = promoCodes.find(p => p.id === codeId);
            if (promo) {
                promo.usage_count = (promo.usage_count || 0) + 1;
                localStorage.setItem('promoCodes', JSON.stringify(promoCodes));
            }
        }
    }

    // Close connection
    async close() {
        if (this.connection) {
            await this.connection.end();
            this.connection = null;
            console.log('Database connection closed');
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DatabaseConnection;
} else {
    window.DatabaseConnection = DatabaseConnection;
}
