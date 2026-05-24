// Login Page Specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initLoginPage();
});

function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');

    if (typeof auth !== 'undefined') {
        auth.initLoginForm();
        auth.initForgotPasswordForm();
    } else if (loginForm) {
        loginForm.addEventListener('submit', handleLoginFallback);
    }

    if (loginForm) {
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

        loginForm.addEventListener('submit', function(e) {
            if (!validateLoginForm(loginForm)) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        }, true);
    }

    if (forgotPasswordForm && typeof auth === 'undefined') {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    }

    checkExistingLogin();
}

function handleLoginFallback(e) {
    e.preventDefault();
    if (!validateLoginForm(e.target)) return;
    if (typeof auth !== 'undefined') {
        auth.handleLoginSubmit(e);
    }
}

function handleForgotPassword(e) {
    e.preventDefault();
    if (typeof auth !== 'undefined') {
        auth.handleForgotPasswordSubmit(e);
    }
}

function validateLoginForm(form) {
    let isValid = true;
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');

    if (!validateField(emailInput)) isValid = false;
    if (!validateField(passwordInput)) isValid = false;
    return isValid;
}

function validateField(field) {
    if (!field) return true;
    const value = field.value.trim();
    const fieldName = field.name || field.id;
    let error = '';

    if (field.hasAttribute('required') && !value) {
        error = `${getFieldLabel(fieldName)} is required`;
    }

    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            error = 'Please enter a valid email address';
        }
    }

    if (field.type === 'password' && value && value.length < 8) {
        error = 'Password must be at least 8 characters long';
    }

    if (error) {
        showFieldError(field, error);
        return false;
    }

    clearFieldError(field);
    return true;
}

function getFieldLabel(fieldName) {
    const labels = {
        email: 'Email Address',
        password: 'Password'
    };
    return labels[fieldName] || fieldName;
}

function showFieldError(field, error) {
    clearFieldError(field);
    const errorElement = field.parentNode.querySelector('.form-error') ||
        field.closest('.form-group')?.querySelector('.form-error');
    if (errorElement) {
        errorElement.textContent = error;
        errorElement.style.display = 'block';
    }
    field.classList.add('error');
}

function clearFieldError(field) {
    const errorElement = field.parentNode.querySelector('.form-error') ||
        field.closest('.form-group')?.querySelector('.form-error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    field.classList.remove('error');
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
        setTimeout(() => { modal.style.display = 'none'; }, 300);
    }
}

function handleSocialLogin(provider) {
    if (typeof auth !== 'undefined' && auth.handleSocialLogin) {
        auth.handleSocialLogin(provider);
        setTimeout(() => { window.location.href = 'index.html'; }, 1600);
    }
}

function checkExistingLogin() {
    const currentUser = window.PaintsData
        ? window.PaintsData.getCurrentUser()
        : (() => {
            try {
                const raw = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
                return raw ? JSON.parse(raw) : null;
            } catch (error) {
                return null;
            }
        })();

    if (!currentUser) return;

    if (window.PaintsData?.isAdminUser(currentUser)) {
        window.location.href = 'admin.html';
    } else {
        window.location.href = 'index.html';
    }
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeForgotPassword();
});

document.getElementById('forgotPasswordModal')?.addEventListener('click', function(e) {
    if (e.target === this) closeForgotPassword();
});
