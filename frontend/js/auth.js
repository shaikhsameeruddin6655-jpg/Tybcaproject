// Authentication System

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

// Password toggle function
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.parentNode.querySelector('.password-toggle i');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggle.classList.remove('fa-eye');
        toggle.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        toggle.classList.remove('fa-eye-slash');
        toggle.classList.add('fa-eye');
    }
}

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check if user is already logged in
        const savedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUIForLoggedInUser();
        }
    }

    isLoggedIn() {
        if (this.currentUser) return true;
        const savedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            return true;
        }
        return false;
    }

    getCurrentUser() {
        if (this.currentUser) return this.currentUser;
        const savedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            return this.currentUser;
        }
        return null;
    }

    closeModal(modalId) {
        if (modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'none';
                modal.classList.remove('active');
                return;
            }
        }
        if (typeof window.closeModal === 'function') {
            window.closeModal();
        }
    }

    showLoginModal() {
        if (window.location.pathname.includes('login.html')) return;
        window.location.href = 'login.html';
    }

    showSignupModal() {
        if (window.location.pathname.includes('register.html')) return;
        window.location.href = 'register.html';
    }

    // Initialize login form
    initLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.removeEventListener('submit', this.handleLoginSubmit);
            loginForm.addEventListener('submit', this.handleLoginSubmit.bind(this));
        }
    }

    // Initialize signup form
    initSignupForm() {
        const signupForm = document.getElementById('signupForm') || document.getElementById('registerForm');
        if (signupForm) {
            signupForm.removeEventListener('submit', this.handleSignupSubmit);
            signupForm.addEventListener('submit', this.handleSignupSubmit.bind(this));
        }

        // Password strength checker
        const passwordInput = document.getElementById('signupPassword') || document.getElementById('registerPassword');
        if (passwordInput) {
            passwordInput.removeEventListener('input', this.checkPasswordStrength);
            passwordInput.addEventListener('input', this.checkPasswordStrength.bind(this));
        }
    }

    // Initialize forgot password form
    initForgotPasswordForm() {
        const forgotForm = document.getElementById('forgotPasswordForm');
        if (forgotForm) {
            forgotForm.removeEventListener('submit', this.handleForgotPasswordSubmit);
            forgotForm.addEventListener('submit', this.handleForgotPasswordSubmit.bind(this));
        }
    }

    // Handle login form submission
    handleLoginSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const email = formData.get('email').trim();
        const password = formData.get('password');
        const rememberMe = document.getElementById('rememberMe').checked;

        // Basic validation
        if (!email || !password) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        // Check if it's admin login
        const adminCredentials = JSON.parse(localStorage.getItem('adminCredentials') || '{}');
        const adminEmail = adminCredentials.email || 'admin@paintsworks.com';
        const adminPassword = adminCredentials.password || 'admin123';
        
        if (email === adminEmail && password === adminPassword) {
            // Create admin user object
            const adminUser = {
                id: 'admin',
                name: 'Admin User',
                email: adminEmail,
                role: 'admin',
                createdAt: new Date().toISOString()
            };
            
            // Store admin session
            if (rememberMe) {
                localStorage.setItem('currentUser', JSON.stringify(adminUser));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(adminUser));
            }

            this.currentUser = adminUser;
            this.updateUIForLoggedInUser();
            this.closeModal('loginModal');
            showToast(`Welcome back, ${adminUser.name}!`, 'success');
            
            // Redirect to admin panel if on login page
            if (window.location.pathname.includes('login.html')) {
                window.location.href = 'admin.html';
            }
            return;
        }

        // Check regular users in localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Store user session
            if (rememberMe) {
                localStorage.setItem('currentUser', JSON.stringify(user));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(user));
            }

            this.currentUser = user;
            this.updateUIForLoggedInUser();
            this.closeModal('loginModal');
            showToast(`Welcome back, ${user.name}!`, 'success');
        } else {
            showToast('Invalid email or password', 'error');
        }
    }

    // Handle signup form submission
    handleSignupSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const firstName = formData.get('firstName').trim();
        const lastName = formData.get('lastName').trim();
        const email = formData.get('email').trim();
        const phone = formData.get('phone')?.trim() || '';
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const agreeTerms = formData.get('agreeTerms');

        // Validation
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        if (!agreeTerms) {
            showToast('Please agree to the terms and conditions', 'error');
            return;
        }

        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.find(u => u.email === email)) {
            showToast('An account with this email already exists', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name: `${firstName} ${lastName}`,
            firstName,
            lastName,
            email: email.toLowerCase(),
            phone,
            password,
            createdAt: new Date().toISOString(),
            orders: []
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Auto-login
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        this.currentUser = newUser;
        this.updateUIForLoggedInUser();
        this.closeModal('signupModal');
        showToast(`Account created successfully! Welcome, ${newUser.name}!`, 'success');

        if (window.location.pathname.includes('register.html')) {
            setTimeout(() => { window.location.href = 'index.html'; }, 1500);
        }
    }

    // Handle forgot password form submission
    handleForgotPasswordSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const email = formData.get('email').trim();

        if (!email) {
            showToast('Please enter your email address', 'error');
            return;
        }

        // Check if user exists
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email);

        if (user) {
            // Generate reset token (in real app, this would be sent via email)
            const resetToken = Math.random().toString(36).substring(2, 15);
            localStorage.setItem('resetToken', JSON.stringify({
                token: resetToken,
                email: email,
                expires: Date.now() + 3600000 // 1 hour
            }));
        }

        this.closeModal('forgotPasswordModal');
        showToast('If an account exists with this email, a reset link has been sent', 'info');
    }

    // Check password strength
    checkPasswordStrength(e) {
        const password = e.target.value;
        const strengthBar = document.querySelector('#passwordStrength .strength-bar');
        const strengthText = document.querySelector('#passwordStrength .strength-text');
        
        if (!strengthBar || !strengthText) return;
        
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        
        // Character variety checks
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        
        // Update UI based on strength
        strengthBar.className = 'strength-bar';
        
        if (strength <= 2) {
            strengthBar.classList.add('weak');
            strengthText.textContent = 'Weak password';
        } else if (strength <= 4) {
            strengthBar.classList.add('medium');
            strengthText.textContent = 'Medium strength';
        } else {
            strengthBar.classList.add('strong');
            strengthText.textContent = 'Strong password';
        }
        
        // Set width percentage
        strengthBar.style.width = `${(strength / 6) * 100}%`;
    }

    // Handle social login
    handleSocialLogin(provider) {
        showToast(`Connecting to ${provider}...`, 'info');
        
        // Simulate social login process
        setTimeout(() => {
            const socialUser = {
                id: Date.now(),
                name: provider === 'google' ? 'Google User' : 'Facebook User',
                firstName: provider === 'google' ? 'Google' : 'Facebook',
                lastName: 'User',
                email: `user@${provider}.com`,
                avatar: provider === 'google' ? 'google-avatar.png' : 'facebook-avatar.png',
                provider: provider,
                createdAt: new Date().toISOString(),
                orders: []
            };

            // Store user
            const users = JSON.parse(localStorage.getItem('users')) || [];
            users.push(socialUser);
            localStorage.setItem('users', JSON.stringify(users));

            // Auto-login
            localStorage.setItem('currentUser', JSON.stringify(socialUser));
            this.currentUser = socialUser;
            this.updateUIForLoggedInUser();
            
            // Close any open modals
            this.closeModal('loginModal');
            this.closeModal('signupModal');
            
            showToast(`Welcome, ${socialUser.name}!`, 'success');
        }, 1500);
    }

    // Update UI for logged in user
    updateUIForLoggedInUser() {
        // Update navigation
        const loginBtn = document.querySelector('button[onclick="auth.showLoginModal()"]');
        const signupBtn = document.querySelector('button[onclick="auth.showSignupModal()"]');
        
        if (loginBtn && signupBtn && this.currentUser) {
            loginBtn.style.display = 'none';
            signupBtn.style.display = 'none';
            
            // Add user profile button
            const profileBtn = document.createElement('button');
            profileBtn.className = 'btn btn-primary';
            profileBtn.innerHTML = `<i class="fas fa-user"></i> ${this.currentUser.name}`;
            profileBtn.onclick = () => this.showProfileModal();
            
            const navActions = document.querySelector('.nav-actions');
            if (navActions) {
                navActions.appendChild(profileBtn);
            }
        }
    }

    // Show profile modal
    showProfileModal() {
        const profileContent = `
            <div class="profile-info">
                <h4>Welcome, ${this.currentUser.name}!</h4>
                <p><strong>Email:</strong> ${this.currentUser.email}</p>
                <p><strong>Member since:</strong> ${new Date(this.currentUser.createdAt).toLocaleDateString()}</p>
                <p><strong>Orders:</strong> ${this.currentUser.orders?.length || 0}</p>
            </div>
            <div class="profile-actions">
                <button class="btn btn-outline" onclick="auth.logout()">Logout</button>
            </div>
        `;
        openModal(profileContent, 'My Profile');
    }

    // Logout user
    logout() {
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        this.currentUser = null;
        
        // Reload page to reset UI
        window.location.reload();
    }
}

// Initialize auth system (global for all pages)
const auth = new AuthSystem();
if (typeof window !== 'undefined') {
    window.auth = auth;
}
