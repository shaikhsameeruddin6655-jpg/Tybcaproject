-- Paints Works Database Schema
-- Complete database structure for painting service management system

-- Drop existing tables if they exist (for fresh setup)
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS saved_items;
DROP TABLE IF EXISTS testimonials;
DROP TABLE IF EXISTS estimates;
DROP TABLE IF EXISTS promo_codes;

-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'user', 'manager') DEFAULT 'user',
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Categories Table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
);

-- Products Table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category_id INT,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    image VARCHAR(255),
    images JSON,
    badge VARCHAR(50),
    rating DECIMAL(3,2) DEFAULT 0.0,
    reviews INT DEFAULT 0,
    features JSON,
    in_stock BOOLEAN DEFAULT TRUE,
    popularity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_slug (slug),
    INDEX idx_price (price),
    INDEX idx_popularity (popularity)
);

-- Orders Table
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT,
    status ENUM('pending', 'confirmed', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) NOT NULL,
    shipping DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    shipping_address JSON,
    billing_address JSON,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_order_number (order_number)
);

-- Order Items Table
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT,
    product_title VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    INDEX idx_order (order_id),
    INDEX idx_product (product_id)
);

-- Cart Table (for guest users and temporary storage)
CREATE TABLE cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    session_id VARCHAR(255),
    product_id INT,
    product_title VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_session (session_id),
    INDEX idx_product (product_id)
);

-- Saved Items Table (for "Save for Later" functionality)
CREATE TABLE saved_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT,
    product_title VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_product (product_id)
);

-- Testimonials Table
CREATE TABLE testimonials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    role VARCHAR(100),
    content TEXT NOT NULL,
    rating DECIMAL(3,2) DEFAULT 0.0,
    avatar VARCHAR(255),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_featured (is_featured),
    INDEX idx_active (is_active)
);

-- Estimates Table
CREATE TABLE estimates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    project_type ENUM('interior', 'exterior', 'commercial') NOT NULL,
    square_footage DECIMAL(10,2) NOT NULL,
    paint_quality ENUM('basic', 'standard', 'premium') NOT NULL,
    rooms_count INT DEFAULT 1,
    additional_features JSON,
    estimated_price DECIMAL(10,2) NOT NULL,
    status ENUM('draft', 'saved', 'converted', 'expired') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_status (status)
);

-- Promo Codes Table
CREATE TABLE promo_codes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type ENUM('percentage', 'fixed') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    min_amount DECIMAL(10,2) DEFAULT 0.00,
    max_discount DECIMAL(10,2),
    usage_limit INT DEFAULT 0,
    usage_count INT DEFAULT 0,
    starts_at TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_active (is_active),
    INDEX idx_expires (expires_at)
);

-- Insert Default Categories
INSERT INTO categories (name, description, slug) VALUES
('Interior', 'Interior painting services for residential spaces', 'interior'),
('Exterior', 'Exterior painting services for buildings', 'exterior'),
('Commercial', 'Commercial painting services for businesses', 'commercial');

-- Insert Default Admin User
INSERT INTO users (name, email, password, phone, role) VALUES 
('Admin User', 'admin@paintsworks.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+91 9876543210', 'admin');

-- Insert Sample Products
INSERT INTO products (title, slug, category_id, description, price, original_price, image, badge, rating, reviews, features, in_stock, popularity) VALUES
('Elegant Bedroom Interior', 'elegant-bedroom-interior', 1, 'Sophisticated color palette for master bedrooms with accent walls featuring warm neutrals and soft pastels.', 25000.00, 35000.00, 'images/products/bedroom-elegant.jpg', 'Bestseller', 4.8, 124, '["Premium Quality Paint", "Color Consultation", "3-Year Warranty"]', TRUE, 95),
('Modern Kitchen Design', 'modern-kitchen-design', 1, 'Fresh and clean look for modern kitchen spaces with contemporary color schemes and durable finishes.', 30000.00, 42000.00, 'images/products/kitchen-modern.jpg', 'New', 4.6, 89, '["Moisture Resistant", "Easy Clean Surface", "Modern Color Palette"]', TRUE, 88),
('Exterior House Makeover', 'exterior-house-makeover', 2, 'Complete exterior transformation with weather-resistant paints and professional application.', 75000.00, 95000.00, 'images/products/house-exterior.jpg', 'Premium', 4.9, 203, '["Weather Protection", "10-Year Warranty", "Free Color Consultation"]', TRUE, 92),
('Office Interior Professional', 'office-interior-professional', 3, 'Professional color scheme for productive work environments with employee wellbeing in mind.', 45000.00, 60000.00, 'images/products/office-commercial.jpg', 'Popular', 4.7, 156, '["Productivity Colors", "Low VOC", "Quick Drying"]', TRUE, 85),
('Kids Room Fun Design', 'kids-room-fun-design', 1, 'Colorful and creative designs for children\'s spaces with safe, non-toxic paints.', 20000.00, 28000.00, 'images/products/kids-room.jpg', 'Sale', 4.5, 98, '["Child-Safe Paints", "Washable Finish", "Fun Themes Available"]', TRUE, 78),
('Restaurant Interior', 'restaurant-interior', 3, 'Appetizing color schemes for dining establishments that enhance the dining experience.', 55000.00, 70000.00, 'images/products/restaurant-interior.jpg', 'Featured', 4.8, 67, '["Appetite-Enhancing Colors", "Durable Finish", "Custom Branding"]', TRUE, 82),
('Luxury Living Room', 'luxury-living-room', 1, 'High-end painting solutions for luxury living spaces with premium materials and finishes.', 40000.00, 52000.00, 'images/products/living-luxury.jpg', 'Luxury', 4.9, 143, '["Premium Materials", "Custom Finishes", "Designer Consultation"]', TRUE, 90),
('Industrial Exterior', 'industrial-exterior', 2, 'Durable and rugged painting solutions for industrial buildings and warehouses.', 85000.00, 110000.00, 'images/products/industrial-exterior.jpg', 'Heavy Duty', 4.6, 45, '["Industrial Grade", "Chemical Resistant", "15-Year Warranty"]', TRUE, 70);

-- Insert Sample Testimonials
INSERT INTO testimonials (name, email, role, content, rating, avatar, is_featured) VALUES
('Sarah Johnson', 'sarah@example.com', 'Homeowner', 'Amazing painting service! The team was professional, punctual, and the quality exceeded our expectations. Our bedroom looks absolutely stunning!', 4.8, 'images/avatar1.jpg', TRUE),
('Mike Chen', 'mike@example.com', 'Business Owner', 'The digital management system made tracking our project so easy and transparent. Highly recommend their services!', 4.9, 'images/avatar2.jpg', TRUE),
('Emily Davis', 'emily@example.com', 'Property Manager', 'Professional, reliable, and affordable. They completed our office painting project on time with excellent results.', 4.7, 'images/avatar3.jpg', FALSE);

-- Insert Sample Promo Codes
INSERT INTO promo_codes (code, description, discount_type, discount_value, min_amount, usage_limit, starts_at, expires_at) VALUES
('SAVE10', 'Save 10% on orders above ₹25,000', 'percentage', 10.00, 25000.00, 100, NOW(), DATE_ADD(NOW(), INTERVAL 6 MONTH)),
('SAVE20', 'Save 20% on orders above ₹35,000', 'percentage', 20.00, 35000.00, 50, NOW(), DATE_ADD(NOW(), INTERVAL 6 MONTH)),
('WELCOME', 'Welcome discount for new customers', 'percentage', 15.00, 15000.00, 200, NOW(), DATE_ADD(NOW(), INTERVAL 3 MONTH)),
('FLAT50', 'Flat ₹50 off any order', 'fixed', 50.00, 0.00, 500, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH));
