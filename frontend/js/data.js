// Shared data and utilities for Paints Works
(function () {
    const PRODUCT_IMAGE_SEEDS = {
        'bedroom-elegant': ['bedroom-elegant', 'bedroom-elegant-1', 'bedroom-elegant-2', 'bedroom-elegant-3'],
        'kitchen-modern': ['kitchen-modern', 'kitchen-modern-1', 'kitchen-modern-2'],
        'house-exterior': ['house-exterior', 'house-exterior-1', 'house-exterior-2', 'house-exterior-3'],
        'office-commercial': ['office-commercial', 'office-commercial-1', 'office-commercial-2'],
        'kids-room': ['kids-room', 'kids-room-1', 'kids-room-2', 'kids-room-3'],
        'restaurant-interior': ['restaurant-interior', 'restaurant-interior-1', 'restaurant-interior-2'],
        'living-luxury': ['living-luxury', 'living-luxury-1', 'living-luxury-2'],
        'industrial-exterior': ['industrial-exterior', 'industrial-exterior-1', 'industrial-exterior-2']
    };

    function productImages(slug) {
        const names = PRODUCT_IMAGE_SEEDS[slug] || [slug];
        return names.map(name => `images/products/${name}.jpg`);
    }

    const DEFAULT_PRODUCTS = [
        {
            id: 1,
            title: 'Elegant Bedroom Interior',
            category: 'interior',
            description: 'Sophisticated color palette for master bedrooms with accent walls featuring warm neutrals and soft pastels.',
            price: 25000,
            originalPrice: 35000,
            image: 'images/products/bedroom-elegant.jpg',
            images: productImages('bedroom-elegant'),
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
            images: productImages('kitchen-modern'),
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
            images: productImages('house-exterior'),
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
            images: productImages('office-commercial'),
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
            description: "Colorful and creative designs for children's spaces with safe, non-toxic paints.",
            price: 20000,
            originalPrice: 28000,
            image: 'images/products/kids-room.jpg',
            images: productImages('kids-room'),
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
            images: productImages('restaurant-interior'),
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
            images: productImages('living-luxury'),
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
            images: productImages('industrial-exterior'),
            badge: 'Heavy Duty',
            rating: 4.6,
            reviews: 45,
            features: ['Industrial Grade', 'Chemical Resistant', '15-Year Warranty'],
            inStock: true,
            popularity: 70,
            createdAt: new Date().toISOString()
        }
    ];

    function sameId(a, b) {
        return String(a) === String(b);
    }

    function uniqueImages(images) {
        return [...new Set((images || []).map(img => String(img).trim()).filter(Boolean))];
    }

    function normalizeProduct(product) {
        if (!product) return product;
        const images = uniqueImages([
            ...(Array.isArray(product.images) ? product.images : []),
            product.image
        ]);
        const image = images[0] || 'images/placeholder.jpg';
        return {
            ...product,
            image,
            images: images.length ? images : [image],
            originalPrice: product.originalPrice ?? product.original_price ?? null,
            inStock: product.inStock !== undefined ? product.inStock : true
        };
    }

    function getCurrentUser() {
        try {
            const raw = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
            return raw ? JSON.parse(raw) : null;
        } catch (error) {
            console.error('Failed to parse current user:', error);
            return null;
        }
    }

    function getAdminCredentials() {
        if (!localStorage.getItem('adminCredentials')) {
            localStorage.setItem('adminCredentials', JSON.stringify({
                email: 'admin@paintsworks.com',
                password: 'admin123',
                createdAt: new Date().toISOString()
            }));
        }
        return JSON.parse(localStorage.getItem('adminCredentials') || '{}');
    }

    function isAdminUser(user) {
        if (!user) return false;
        const adminCredentials = getAdminCredentials();
        const adminEmail = (adminCredentials.email || 'admin@paintsworks.com').toLowerCase();
        return user.role === 'admin' || String(user.email || '').toLowerCase() === adminEmail;
    }

    function getProductsFromStorage() {
        try {
            const raw = localStorage.getItem('adminProducts') || localStorage.getItem('products');
            const products = raw ? JSON.parse(raw) : [];
            return Array.isArray(products) ? products.map(normalizeProduct) : [];
        } catch (error) {
            console.error('Failed to load products:', error);
            return [];
        }
    }

    function sanitizeImagesForStorage(images) {
        return uniqueImages(images).filter(img => {
            const value = String(img).trim();
            if (!value) return false;
            // Avoid localStorage quota errors from large base64 uploads
            if (value.startsWith('data:') && value.length > 120000) return false;
            return true;
        });
    }

    function saveProductsToStorage(products) {
        const normalized = products.map(product => {
            const p = normalizeProduct(product);
            const images = sanitizeImagesForStorage(p.images);
            return {
                ...p,
                images: images.length ? images : [p.image || 'images/placeholder.jpg'],
                image: images[0] || p.image || 'images/placeholder.jpg'
            };
        });
        localStorage.setItem('adminProducts', JSON.stringify(normalized));
        localStorage.setItem('products', JSON.stringify(normalized));
    }

    const PRODUCT_STORAGE_VERSION = '3-paint-images';

    function initProductStorage(forceReset) {
        if (forceReset || localStorage.getItem('productStorageVersion') !== PRODUCT_STORAGE_VERSION) {
            localStorage.removeItem('adminProducts');
            localStorage.removeItem('products');
            localStorage.setItem('productStorageVersion', PRODUCT_STORAGE_VERSION);
        }

        const existing = localStorage.getItem('adminProducts');
        if (!existing) {
            saveProductsToStorage(DEFAULT_PRODUCTS);
            localStorage.setItem('productStorageVersion', PRODUCT_STORAGE_VERSION);
            return DEFAULT_PRODUCTS.map(normalizeProduct);
        }

        try {
            const parsed = JSON.parse(existing);
            if (!Array.isArray(parsed) || parsed.length === 0) {
                saveProductsToStorage(DEFAULT_PRODUCTS);
                localStorage.setItem('productStorageVersion', PRODUCT_STORAGE_VERSION);
                return DEFAULT_PRODUCTS.map(normalizeProduct);
            }

            let changed = false;
            const migrated = parsed.map(product => {
                const normalized = normalizeProduct(product);
                const needsImages = !Array.isArray(product.images) || product.images.filter(Boolean).length <= 1;
                if (needsImages) {
                    const match = DEFAULT_PRODUCTS.find(p => sameId(p.id, product.id));
                    if (match) {
                        normalized.images = match.images;
                        normalized.image = match.image;
                        changed = true;
                    }
                }
                return normalized;
            });
            if (changed) {
                saveProductsToStorage(migrated);
            }
            localStorage.setItem('productStorageVersion', PRODUCT_STORAGE_VERSION);
            return changed ? migrated.map(normalizeProduct) : parsed.map(normalizeProduct);
        } catch (error) {
            saveProductsToStorage(DEFAULT_PRODUCTS);
            localStorage.setItem('productStorageVersion', PRODUCT_STORAGE_VERSION);
            return DEFAULT_PRODUCTS.map(normalizeProduct);
        }
    }

    window.PaintsData = {
        DEFAULT_PRODUCTS,
        PRODUCT_IMAGE_SEEDS,
        sameId,
        uniqueImages,
        normalizeProduct,
        getCurrentUser,
        getAdminCredentials,
        isAdminUser,
        getProductsFromStorage,
        saveProductsToStorage,
        sanitizeImagesForStorage,
        initProductStorage
    };
})();
