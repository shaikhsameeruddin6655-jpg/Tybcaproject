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

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check if user is already logged in
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUIForLoggedInUser();
        }
    }

    // Login Modal
    showLoginModal() {
        const loginContent = `
            <form id="loginForm">
                <div class="form-group">
                    <label class="form-label" for="loginEmail">Email Address</label>
                    <input type="email" class="form-input" id="loginEmail" name="email" required placeholder="Enter your email">
                </div>
                <div class="form-group">
                    <label class="form-label" for="loginPassword">Password</label>
                    <input type="password" class="form-input" id="loginPassword" name="password" required placeholder="Enter your password">
                </div>
                <div class="form-group">
                    <div class="d-flex justify-between align-center">
                        <label class="form-checkbox">
                            <input type="checkbox" id="rememberMe">
                            <span>Remember me</span>
                        </label>
                        <a href="#" class="text-primary" onclick="auth.showForgotPasswordModal(); return false;">Forgot Password?</a>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Login</button>
                </div>
                
                <div class="social-divider">
                    <span>Or continue with</span>
                </div>
                
                <div class="social-buttons">
                    <button type="button" class="social-btn google" onclick="auth.handleSocialLogin('google')">
                        <i class="fab fa-google"></i>
                        Continue with Google
                    </button>
                    <button type="button" class="social-btn facebook" onclick="auth.handleSocialLogin('facebook')">
                        <i class="fab fa-facebook-f"></i>
                        Continue with Facebook
                    </button>
                </div>
                
                <div class="text-center mt-4">
                    <p>Don't have an account? <a href="#" class="text-primary" onclick="auth.showSignupModal(); closeModal(); return false;">Sign up</a></p>
                </div>
            </form>
        `;
        
        openModal(loginContent, 'Login to Your Account');
        
        // Handle form submission
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e.target);
        });
    }

    // Signup Modal
    showSignupModal() {
        const signupContent = `
            <form id="signupForm">
                <div class="form-group">
                    <label class="form-label" for="signupName">Full Name</label>
                    <input type="text" class="form-input" id="signupName" name="name" required placeholder="Enter your full name">
                </div>
                <div class="form-group">
                    <label class="form-label" for="signupEmail">Email Address</label>
                    <input type="email" class="form-input" id="signupEmail" name="email" required placeholder="Enter your email">
                </div>
                <div class="form-group">
                    <label class="form-label" for="signupPassword">Password</label>
                    <input type="password" class="form-input" id="signupPassword" name="password" required placeholder="Create a password (min 8 characters)">
                </div>
                <div class="form-group">
                    <label class="form-label" for="signupConfirmPassword">Confirm Password</label>
                    <input type="password" class="form-input" id="signupConfirmPassword" name="confirmPassword" required placeholder="Confirm your password">
                </div>
                <div class="form-group">
                    <label class="form-checkbox">
                        <input type="checkbox" id="agreeTerms" required>
                        <span>I agree to the <a href="#" class="text-primary">Terms of Service</a> and <a href="#" class="text-primary">Privacy Policy</a></span>
                    </label>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Create Account</button>
                </div>
                
                <div class="social-divider">
                    <span>Or sign up with</span>
                </div>
                
                <div class="social-buttons">
                    <button type="button" class="social-btn google" onclick="auth.handleSocialLogin('google')">
                        <i class="fab fa-google"></i>
                        Continue with Google
                    </button>
                    <button type="button" class="social-btn facebook" onclick="auth.handleSocialLogin('facebook')">
                        <i class="fab fa-facebook-f"></i>
                        Continue with Facebook
                    </button>
                </div>
                
                <div class="text-center mt-4">
                    <p>Already have an account? <a href="#" class="text-primary" onclick="auth.showLoginModal(); closeModal(); return false;">Login</a></p>
                </div>
            </form>
        `;
        
        openModal(signupContent, 'Create Your Account');
        
        // Handle form submission
        document.getElementById('signupForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup(e.target);
        });
    }

    // Forgot Password Modal
    showForgotPasswordModal() {
        const forgotContent = `
            <form id="forgotPasswordForm">
                <div class="text-center mb-4">
                    <i class="fas fa-lock fa-3x text-primary mb-3"></i>
                    <h4>Reset Your Password</h4>
                    <p class="text-secondary">Enter your email address and we'll send you a link to reset your password.</p>
                </div>
                <div class="form-group">
                    <label class="form-label" for="resetEmail">Email Address</label>
                    <input type="email" class="form-input" id="resetEmail" name="email" required placeholder="Enter your email address">
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Send Reset Link</button>
                </div>
                <div class="text-center mt-4">
                    <p><a href="#" class="text-primary" onclick="auth.showLoginModal(); closeModal(); return false;">Back to Login</a></p>
                </div>
            </form>
        `;
        
        openModal(forgotContent, 'Reset Password');
        
        // Handle form submission
        document.getElementById('forgotPasswordForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleForgotPassword(e.target);
        });
    }

    // Profile Modal
    showProfileModal() {
        if (!this.currentUser) {
            this.showLoginModal();
            return;
        }

        const profileContent = `
            <div class="profile-section">
                <div class="profile-header text-center mb-4">
                    <div class="profile-avatar">
                        <i class="fas fa-user fa-4x text-primary"></i>
                    </div>
                    <h3>${this.currentUser.name}</h3>
                    <p class="text-secondary">${this.currentUser.email}</p>
                </div>
                
                <form id="profileForm">
                    <div class="form-group">
                        <label class="form-label" for="profileName">Full Name</label>
                        <input type="text" class="form-input" id="profileName" name="name" value="${this.currentUser.name}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="profileEmail">Email Address</label>
                        <input type="email" class="form-input" id="profileEmail" name="email" value="${this.currentUser.email}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="profilePhone">Phone Number</label>
                        <input type="tel" class="form-input" id="profilePhone" name="phone" value="${this.currentUser.phone || ''}" placeholder="Enter your phone number">
                    </div>
                    
                    <hr class="my-4">
                    
                    <h4 class="mb-3">Change Password</h4>
                    <div class="form-group">
                        <label class="form-label" for="currentPassword">Current Password</label>
                        <input type="password" class="form-input" id="currentPassword" name="currentPassword" placeholder="Enter current password">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="newPassword">New Password</label>
                        <input type="password" class="form-input" id="newPassword" name="newPassword" placeholder="Enter new password">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="confirmNewPassword">Confirm New Password</label>
                        <input type="password" class="form-input" id="confirmNewPassword" name="confirmNewPassword" placeholder="Confirm new password">
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Update Profile</button>
                    </div>
                </form>
                
                <div class="text-center mt-4">
                    <button class="btn btn-danger" onclick="auth.handleLogout()">
                        <i class="fas fa-sign-out-alt"></i>
                        Logout
                    </button>
                </div>
            </div>
        `;
        
        openModal(profileContent, 'My Profile');
        
        // Handle form submission
        document.getElementById('profileForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProfileUpdate(e.target);
        });
    }

    // Handle Login
    handleLogin(form) {
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');
        const rememberMe = document.getElementById('rememberMe').checked;

        // Basic validation
        if (!email || !password) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Find user
            const user = users.find(u => u.email === email && u.password === password);
            
            // Reset loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            
            if (user) {
                this.currentUser = user;
                
                if (rememberMe) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                } else {
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                }
                
                this.updateUIForLoggedInUser();
                closeModal();
                showToast(`Welcome back, ${user.name}!`, 'success');
                
                // Redirect to dashboard or reload page
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                showToast('Invalid email or password', 'error');
            }
        }, 1000);
    }

    // Handle Signup
    handleSignup(form) {
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const agreeTerms = document.getElementById('agreeTerms').checked;

        // Enhanced validation
        if (!name || !email || !password || !confirmPassword) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        if (name.trim().length < 2) {
            showToast('Name must be at least 2 characters long', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        if (password.length < 8) {
            showToast('Password must be at least 8 characters long', 'error');
            return;
        }

        if (!this.validatePasswordStrength(password)) {
            showToast('Password must contain at least one uppercase letter, one lowercase letter, and one number', 'error');
            return;
        }

        if (!agreeTerms) {
            showToast('Please agree to the terms and conditions', 'error');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Get existing users
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Check if email already exists
            if (users.find(u => u.email === email)) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                showToast('An account with this email already exists', 'error');
                return;
            }

            // Create new user
            const newUser = {
                id: Date.now(),
                name: name.trim(),
                email: email.toLowerCase().trim(),
                password, // In production, this should be hashed
                phone: '',
                createdAt: new Date().toISOString(),
                orders: []
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // Auto-login
            this.currentUser = newUser;
            localStorage.setItem('currentUser', JSON.stringify(newUser));

            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;

            this.updateUIForLoggedInUser();
            closeModal();
            showToast(`Account created successfully! Welcome, ${name}!`, 'success');

            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }, 1000);
    }

    // Handle Forgot Password
    handleForgotPassword(form) {
        const formData = new FormData(form);
        const email = formData.get('email');

        // Get users
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email);

        if (user) {
            // In production, send actual email
            // For demo, show success message
            showToast(`Password reset link sent to ${email}`, 'success');
            closeModal();
            
            // Simulate sending reset token
            const resetToken = Math.random().toString(36).substring(2, 15);
            localStorage.setItem('resetToken', JSON.stringify({
                token: resetToken,
                email: email,
                expires: Date.now() + 3600000 // 1 hour
            }));
        } else {
            showToast('If an account exists with this email, a reset link has been sent', 'info');
        }
    }

    // Handle Profile Update
    handleProfileUpdate(form) {
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const currentPassword = formData.get('currentPassword');
        const newPassword = formData.get('newPassword');
        const confirmNewPassword = formData.get('confirmNewPassword');

        // Update basic info
        this.currentUser.name = name;
        this.currentUser.email = email;
        this.currentUser.phone = phone;

        // Handle password change
        if (newPassword) {
            if (!currentPassword) {
                showToast('Please enter current password', 'error');
                return;
            }

            if (currentPassword !== this.currentUser.password) {
                showToast('Current password is incorrect', 'error');
                return;
            }

            if (newPassword !== confirmNewPassword) {
                showToast('New passwords do not match', 'error');
                return;
            }

            if (newPassword.length < 8) {
                showToast('New password must be at least 8 characters long', 'error');
                return;
            }

            this.currentUser.password = newPassword;
        }

        // Update in users array
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = this.currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }

        // Update current user in storage
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        this.updateUIForLoggedInUser();
        closeModal();
        showToast('Profile updated successfully!', 'success');
    }

    // Handle Logout
    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        
        this.updateUIForLoggedOutUser();
        closeModal();
        showToast('Logged out successfully', 'success');

        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    // Update UI for logged in user
    updateUIForLoggedInUser() {
        // Update navigation buttons
        const loginBtn = document.querySelector('button[onclick="auth.showLoginModal()"]');
        const signupBtn = document.querySelector('button[onclick="auth.showSignupModal()"]');
        
        if (loginBtn && signupBtn) {
            loginBtn.style.display = 'none';
            signupBtn.textContent = this.currentUser.name;
            signupBtn.classList.remove('btn-primary');
            signupBtn.classList.add('btn-secondary');
            signupBtn.onclick = () => this.showProfileModal();
        }

        // Update mobile profile nav
        const mobileProfile = document.querySelector('a[onclick="auth.showProfileModal()"]');
        if (mobileProfile) {
            mobileProfile.classList.add('active');
        }
    }

    // Update UI for logged out user
    updateUIForLoggedOutUser() {
        // Update navigation buttons
        const loginBtn = document.querySelector('button[onclick="auth.showLoginModal()"]');
        const signupBtn = document.querySelector('button[onclick="auth.showSignupModal()"]');
        
        if (loginBtn && signupBtn) {
            loginBtn.style.display = 'block';
            signupBtn.textContent = 'Sign Up';
            signupBtn.classList.remove('btn-secondary');
            signupBtn.classList.add('btn-primary');
            signupBtn.onclick = () => this.showSignupModal();
        }

        // Update mobile profile nav
        const mobileProfile = document.querySelector('a[onclick="auth.showProfileModal()"]');
        if (mobileProfile) {
            mobileProfile.classList.remove('active');
        }
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Validation helpers
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePasswordStrength(password) {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        return hasUpperCase && hasLowerCase && hasNumbers;
    }

    // Handle Social Login
    handleSocialLogin(provider) {
        showToast(`Connecting to ${provider}...`, 'info');
        
        // Simulate social login process
        setTimeout(() => {
            // In a real application, this would integrate with OAuth providers
            const socialUser = {
                id: Date.now(),
                name: provider === 'google' ? 'Google User' : 'Facebook User',
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
            this.currentUser = socialUser;
            localStorage.setItem('currentUser', JSON.stringify(socialUser));

            this.updateUIForLoggedInUser();
            closeModal();
            showToast(`Welcome, ${socialUser.name}!`, 'success');

            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }, 1500);
    }
}

// Initialize auth system
const auth = new AuthSystem();

// Global functions for onclick handlers
window.openLoginModal = () => auth.showLoginModal();
window.openSignupModal = () => auth.showSignupModal();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthSystem;
}
