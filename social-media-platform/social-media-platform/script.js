// SocialSphere - Complete Social Media Platform Script

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    // Check authentication status
    checkAuthStatus();
    
    // Initialize all functionality
    initializeAuthModal();
    initializeLikeButtons();
    initializePostButton();
    initializeFollowButtons();
    initializeSearchFunctionality();
    initializeNavigation();
}

// Authentication Functions
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('socialSphereLoggedIn');
    const userData = localStorage.getItem('socialSphereUserData');
    
    if (isLoggedIn && userData) {
        // User is logged in
        showLoggedInState(userData);
    } else {
        // User is not logged in
        showLoggedOutState();
    }
}

function showLoggedInState(userData) {
    try {
        const user = JSON.parse(userData);
        
        // Show logged in user interface
        document.getElementById('authButtons').style.display = 'none';
        document.getElementById('loggedInUser').style.display = 'flex';
        document.getElementById('createPost').style.display = 'block';
        document.getElementById('guestMessage').style.display = 'none';
        
        // Update user information
        document.getElementById('userName').textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById('userAvatar').src = user.avatar;
        document.getElementById('postUserAvatar').src = user.avatar;
        
        // Update post placeholder with user's name
        const postTextarea = document.getElementById('postContent');
        if (postTextarea) {
            postTextarea.placeholder = `What's on your mind, ${user.firstName}?`;
        }
        
    } catch (e) {
        console.error('Error parsing user data:', e);
        showLoggedOutState();
    }
}

function showLoggedOutState() {
    // Show logged out user interface
    document.getElementById('authButtons').style.display = 'flex';
    document.getElementById('loggedInUser').style.display = 'none';
    document.getElementById('createPost').style.display = 'none';
    document.getElementById('guestMessage').style.display = 'block';
}

// Auth Modal Functions
function initializeAuthModal() {
    const authModal = document.getElementById('authModal');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const authClose = document.querySelector('.auth-close');
    const authTabs = document.querySelectorAll('.auth-tab');
    const guestLoginBtn = document.getElementById('guestLoginBtn');
    const guestSignupBtn = document.getElementById('guestSignupBtn');
    
    // Open modal for login
    if (loginBtn) {
        loginBtn.addEventListener('click', () => openAuthModal('login'));
    }
    
    // Open modal for signup
    if (signupBtn) {
        signupBtn.addEventListener('click', () => openAuthModal('signup'));
    }
    
    // Guest buttons
    if (guestLoginBtn) {
        guestLoginBtn.addEventListener('click', () => openAuthModal('login'));
    }
    
    if (guestSignupBtn) {
        guestSignupBtn.addEventListener('click', () => openAuthModal('signup'));
    }
    
    // Close modal
    if (authClose) {
        authClose.addEventListener('click', closeAuthModal);
    }
    
    // Tab switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            switchAuthTab(tabName);
        });
    });
    
    // Close modal when clicking outside
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            closeAuthModal();
        }
    });
    
    // Initialize form functionality
    initializeAuthForms();
}

function openAuthModal(tab = 'login') {
    const authModal = document.getElementById('authModal');
    authModal.classList.add('active');
    switchAuthTab(tab);
}

function closeAuthModal() {
    const authModal = document.getElementById('authModal');
    authModal.classList.remove('active');
}

function switchAuthTab(tabName) {
    // Update tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('data-tab') === tabName);
    });
    
    // Update forms
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.toggle('active', form.id === `${tabName}Form`);
    });
}

function initializeAuthForms() {
    // Toggle password visibility
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });
    
    // Password strength indicator
    const passwordInput = document.getElementById('signupPassword');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (passwordInput && strengthFill && strengthText) {
        passwordInput.addEventListener('input', function() {
            updatePasswordStrength(this.value, strengthFill, strengthText);
        });
    }
    
    // Form submissions
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Social login buttons
    const socialButtons = document.querySelectorAll('.social-btn');
    
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.classList.contains('google') ? 'Google' : 'Facebook';
            simulateSocialLogin(platform);
        });
    });
}

function updatePasswordStrength(password, strengthFill, strengthText) {
    let strength = 0;
    let text = 'Password strength';
    let color = '#eee';
    
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    strengthFill.style.width = `${strength}%`;
    
    if (strength < 50) {
        color = '#e74c3c';
        text = 'Weak password';
    } else if (strength < 75) {
        color = '#f39c12';
        text = 'Medium password';
    } else {
        color = '#2ecc71';
        text = 'Strong password';
    }
    
    strengthFill.style.background = color;
    strengthText.textContent = text;
    strengthText.style.color = color;
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('remember')?.checked || false;
    
    // Simple validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('.auth-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Signing in...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // For demo purposes - in real app, verify credentials with server
        const userData = {
            firstName: 'Alex',
            lastName: 'Morgan',
            email: email,
            username: email.split('@')[0],
            avatar: `https://i.pravatar.cc/150?u=${email}`
        };
        
        // Store login state
        localStorage.setItem('socialSphereLoggedIn', 'true');
        localStorage.setItem('socialSphereUserData', JSON.stringify(userData));
        
        if (rememberMe) {
            localStorage.setItem('socialSphereRememberMe', 'true');
        }
        
        showNotification('Login successful!', 'success');
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Close modal and update UI
        closeAuthModal();
        showLoggedInState(JSON.stringify(userData));
        
    }, 1500);
}

function handleSignup(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('signupEmail').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;
    
    // Validation
    if (!firstName || !lastName || !email || !username || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (!terms) {
        showNotification('Please agree to the Terms and Privacy Policy', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('.auth-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating account...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        const userData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            username: username,
            avatar: `https://i.pravatar.cc/150?u=${email}`
        };
        
        // Store login state
        localStorage.setItem('socialSphereLoggedIn', 'true');
        localStorage.setItem('socialSphereUserData', JSON.stringify(userData));
        
        showNotification('Account created successfully!', 'success');
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Close modal and update UI
        closeAuthModal();
        showLoggedInState(JSON.stringify(userData));
        
    }, 1500);
}

function simulateSocialLogin(platform) {
    showNotification(`Connecting with ${platform}...`, 'info');
    
    setTimeout(() => {
        const userData = {
            firstName: platform === 'Google' ? 'Google' : 'Facebook',
            lastName: 'User',
            email: `user@${platform.toLowerCase()}.com`,
            username: `${platform.toLowerCase()}_user`,
            avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
        };
        
        // Store login state
        localStorage.setItem('socialSphereLoggedIn', 'true');
        localStorage.setItem('socialSphereUserData', JSON.stringify(userData));
        
        showNotification(`${platform} login successful!`, 'success');
        
        // Close modal and update UI
        closeAuthModal();
        showLoggedInState(JSON.stringify(userData));
        
    }, 1500);
}

// Logout functionality
function initializeLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('socialSphereLoggedIn');
            localStorage.removeItem('socialSphereUserData');
            showNotification('You have been logged out', 'info');
            showLoggedOutState();
        });
    }
}

// Original functionality from your script
function initializeLikeButtons() {
    const likeButtons = document.querySelectorAll('.action-btn');
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.querySelector('i').classList.contains('fa-heart')) {
                if (this.querySelector('i').classList.contains('far')) {
                    this.querySelector('i').classList.replace('far', 'fas');
                    this.classList.add('active');
                    updateLikeCount(this, 1);
                } else {
                    this.querySelector('i').classList.replace('fas', 'far');
                    this.classList.remove('active');
                    updateLikeCount(this, -1);
                }
            }
        });
    });
}

function updateLikeCount(button, change) {
    const post = button.closest('.post');
    const stats = post.querySelector('.post-stats span:first-child');
    if (stats) {
        const currentText = stats.textContent;
        const currentCount = parseInt(currentText.match(/\d+/)) || 0;
        const newCount = Math.max(0, currentCount + change);
        stats.innerHTML = `<i class="fas fa-heart"></i> ${newCount}`;
    }
}

function initializePostButton() {
    const postBtn = document.getElementById('publishPost');
    const postTextarea = document.getElementById('postContent');
    
    if (postBtn && postTextarea) {
        postBtn.addEventListener('click', function() {
            if (postTextarea.value.trim() !== '') {
                createNewPost(postTextarea.value);
                postTextarea.value = '';
                showNotification('Your post has been published!', 'success');
            } else {
                showNotification('Please write something before posting.', 'error');
            }
        });
    }
}

function createNewPost(content) {
    const mainContent = document.querySelector('.main-content');
    const createPost = document.querySelector('.create-post');
    
    // Get user data
    const userData = localStorage.getItem('socialSphereUserData');
    let user = {
        firstName: 'Alex',
        lastName: 'Morgan',
        avatar: 'https://i.pravatar.cc/150?img=12'
    };
    
    if (userData) {
        try {
            user = JSON.parse(userData);
        } catch (e) {
            console.log('Error parsing user data');
        }
    }
    
    const newPost = document.createElement('div');
    newPost.className = 'post';
    newPost.innerHTML = `
        <div class="post-header">
            <img src="${user.avatar}" alt="Profile">
            <div class="user-info">
                <h4>${user.firstName} ${user.lastName}</h4>
                <span>Just now · <i class="fas fa-globe-americas"></i></span>
            </div>
        </div>
        <div class="post-content">
            <p>${content}</p>
        </div>
        <div class="post-stats">
            <span><i class="fas fa-heart"></i> 0</span>
            <span>0 comments · 0 shares</span>
        </div>
        <div class="post-actions-buttons">
            <div class="action-btn">
                <i class="far fa-heart"></i>
                <span>Like</span>
            </div>
            <div class="action-btn">
                <i class="far fa-comment"></i>
                <span>Comment</span>
            </div>
            <div class="action-btn">
                <i class="fas fa-share"></i>
                <span>Share</span>
            </div>
        </div>
    `;
    
    // Insert after the create post section
    mainContent.insertBefore(newPost, createPost.nextSibling);
    
    // Re-initialize like buttons for the new post
    initializeLikeButtons();
}

function initializeFollowButtons() {
    const followButtons = document.querySelectorAll('.follow-btn');
    followButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.textContent === 'Follow') {
                this.textContent = 'Following';
                this.style.background = 'var(--gray)';
                showNotification('You are now following this user', 'success');
            } else {
                this.textContent = 'Follow';
                this.style.background = 'var(--primary)';
                showNotification('You have unfollowed this user', 'info');
            }
        });
    });
}

function initializeSearchFunctionality() {
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    showNotification(`Searching for: ${query}`, 'info');
                    // In a real app, you would perform search here
                }
            }
        });
    }
}

function initializeNavigation() {
    // Add active state to navigation items
    const navItems = document.querySelectorAll('.sidebar-menu a, .nav-icons a');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                
                // Remove active class from all items
                navItems.forEach(navItem => navItem.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Show notification for demo
                const icon = this.querySelector('i');
                if (icon) {
                    const pageName = icon.classList[1].replace('fa-', '');
                    showNotification(`Navigating to ${pageName} page`, 'info');
                }
            }
        });
    });
    
    // Initialize logout
    initializeLogout();
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}