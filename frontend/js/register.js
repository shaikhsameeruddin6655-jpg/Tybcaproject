// Registration Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initRegisterPage();
});

function initRegisterPage() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;

    if (typeof auth !== 'undefined') {
        auth.initSignupForm();
    } else {
        registerForm.addEventListener('submit', handleRegisterFallback);
    }

    const passwordInput = document.getElementById('registerPassword');
    if (passwordInput) {
        passwordInput.addEventListener('input', checkRegisterPasswordStrength);
    }

    const currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (currentUser) {
        window.location.href = 'index.html';
    }
}

function handleRegisterFallback(e) {
    e.preventDefault();
    if (typeof auth !== 'undefined' && auth.handleSignupSubmit) {
        auth.handleSignupSubmit(e);
    }
}

function checkRegisterPasswordStrength(e) {
    const password = e.target.value;
    const strengthBar = document.querySelector('#passwordStrength .strength-bar');
    const strengthText = document.querySelector('#passwordStrength .strength-text');

    if (!strengthBar || !strengthText) return;

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

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
    strengthBar.style.width = `${(strength / 6) * 100}%`;
}

function showTerms() {
    const modal = document.getElementById('termsModal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
    }
}

function showPrivacy() {
    const modal = document.getElementById('privacyModal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
    }
}

function closePageModal(modalId) {
    if (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => { modal.style.display = 'none'; }, 300);
            return;
        }
    }
    document.querySelectorAll('#termsModal, #privacyModal').forEach(modal => {
        modal.classList.remove('active');
        modal.style.display = 'none';
    });
}

function handleSocialLogin(provider) {
    if (typeof auth !== 'undefined' && auth.handleSocialLogin) {
        auth.handleSocialLogin(provider);
    }
}
