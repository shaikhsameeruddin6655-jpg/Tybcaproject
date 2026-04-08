// Login Page Specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initLoginPage();
});

function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    
    // Initialize login form
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        
        // Add real-time validation
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');
        
        if (emailInput) {
            emailInput.addEventListener('blur', () => validateField(emailInput));
            emailInput.addEventListener('input', () => clearFieldError(emailInput));
        }
        
        if (passwordInput) {
            passwordInput.addEventListener('blur', () => validateField(passwordInput));
            passwordInput.addEventListener('input', () => clearFieldError(passwordInput));
        }
    }
    
    // Initialize forgot password form
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
        
        const resetEmailInput = document.getElementById('resetEmail');
        if (resetEmailInput) {
            resetEmailInput.addEventListener('blur', () => validateField(resetEmailInput));
            resetEmailInput.addEventListener('input', () => clearFieldError(resetEmailInput));
        }
    }
    
    // Check if user is already logged in
    checkExistingLogin();
}

function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const loginBtn = document.getElementById('loginBtn');
    
    // Clear previous errors
    clearAllErrors(form);
    
    // Validate form
    if (!validateLoginForm(form)) {
        return;
    }
    
    const loginData = {
        email: formData.get('email').trim(),
        password: formData.get('password'),
        rememberMe: document.getElementById('rememberMe').checked
    };
    
    // Show loading state
    const originalBtnText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    loginBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Find user
        const user = users.find(u => u.email === loginData.email && u.password === loginData.password);
        
        if (user) {
            // Store user session
            if (loginData.rememberMe) {
                localStorage.setItem('currentUser', JSON.stringify(user));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(user));
            }
            
            // Show success message
            showToast(`Welcome back, ${user.name}!`, 'success');
            
            // Redirect to dashboard or homepage
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            // Show error
            showFieldError(document.getElementById('loginEmail'), 'Invalid email or password');
            showFieldError(document.getElementById('loginPassword'), 'Invalid email or password');
            
            // Reset button
            loginBtn.innerHTML = originalBtnText;
            loginBtn.disabled = false;
        }
    }, 1500);
}

function handleForgotPassword(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const email = formData.get('email').trim();
    
    // Clear previous errors
    clearAllErrors(form);
    
    // Validate email
    const emailInput = document.getElementById('resetEmail');
    if (!validateField(emailInput)) {
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
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
            
            showToast(`Password reset link sent to ${email}`, 'success');
        } else {
            // Don't reveal if email exists or not for security
            showToast('If an account exists with this email, a reset link has been sent', 'info');
        }
        
        // Close modal and reset form
        closeForgotPassword();
        form.reset();
        
        // Reset button
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }, 1500);
}

function validateLoginForm(form) {
    let isValid = true;
    
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    
    // Validate email
    if (!validateField(emailInput)) {
        isValid = false;
    }
    
    // Validate password
    if (!validateField(passwordInput)) {
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name || field.id;
    let error = '';
    
    // Required validation
    if (field.hasAttribute('required') && !value) {
        error = `${getFieldLabel(fieldName)} is required`;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            error = 'Please enter a valid email address';
        }
    }
    
    // Password validation
    if (field.type === 'password' && value) {
        if (value.length < 8) {
            error = 'Password must be at least 8 characters long';
        }
    }
    
    if (error) {
        showFieldError(field, error);
        return false;
    } else {
        clearFieldError(field);
        return true;
    }
}

function getFieldLabel(fieldName) {
    const labels = {
        'email': 'Email Address',
        'password': 'Password',
        'firstName': 'First Name',
        'lastName': 'Last Name',
        'phone': 'Phone Number'
    };
    return labels[fieldName] || fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
}

function showFieldError(field, error) {
    clearFieldError(field);
    
    const errorElement = field.parentNode.querySelector('.form-error');
    if (errorElement) {
        errorElement.textContent = error;
        errorElement.style.display = 'block';
    }
    
    field.classList.add('error');
}

function clearFieldError(field) {
    const errorElement = field.parentNode.querySelector('.form-error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    
    field.classList.remove('error');
}

function clearAllErrors(form) {
    const fields = form.querySelectorAll('.form-input');
    fields.forEach(field => clearFieldError(field));
}

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

function showForgotPassword() {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
    }
}

function closeForgotPassword() {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
    }
}

function handleSocialLogin(provider) {
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
        localStorage.setItem('currentUser', JSON.stringify(socialUser));

        showToast(`Welcome, ${socialUser.name}!`, 'success');

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 1500);
}

function checkExistingLogin() {
    const currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    
    if (currentUser) {
        // User is already logged in, redirect to dashboard
        window.location.href = 'index.html';
    }
}

// Toast notification function
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

// Close modal on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeForgotPassword();
    }
});

// Close modal on background click
document.getElementById('forgotPasswordModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeForgotPassword();
    }
});
