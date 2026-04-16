// ===================================
// UI.JS - UI Utilities and Helpers
// ===================================

/**
 * Format price as currency
 */
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

/**
 * Format date to readable string
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Format time to readable string
 */
function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Show loading spinner
 */
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div style="text-align: center; padding: 2rem;"><p>Loading...</p></div>';
    }
}

/**
 * Show error message
 */
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--danger-color);"><p>❌ ${message}</p></div>`;
    }
}

/**
 * Show success message
 */
function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--success-color);"><p>✓ ${message}</p></div>`;
    }
}

/**
 * Create toast notification
 */
function createToast(message, type = 'success', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--danger-color)' : 'var(--warning-color)'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        animation: slideIn 0.3s ease;
        z-index: 10000;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, duration);
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate password strength
 */
function isStrongPassword(password) {
    return password.length >= 6;
}

/**
 * Debounce function for search
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Get query parameter from URL
 */
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * Set query parameter in URL
 */
function setQueryParam(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.replaceState({}, '', url);
}

/**
 * Format order status with badge color
 */
function getStatusBadge(status) {
    const statusMap = {
        'pending': { class: 'status-pending', icon: '⏳' },
        'confirmed': { class: 'status-progress', icon: '✓' },
        'preparing': { class: 'status-progress', icon: '👨‍🍳' },
        'ready': { class: 'status-progress', icon: '📦' },
        'out_for_delivery': { class: 'status-progress', icon: '🚗' },
        'delivered': { class: 'status-delivered', icon: '✓' },
        'cancelled': { class: 'status-pending', icon: '✗' }
    };

    const info = statusMap[status] || { class: 'status-pending', icon: '?' };
    return `<span class="status-badge ${info.class}">${info.icon} ${status}</span>`;
}

/**
 * Calculate estimated delivery time
 */
function getEstimatedDelivery(minutes = 30) {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minutes);
    return formatTime(date.toISOString());
}

/**
 * Calculate order total
 */
function calculateTotal(items) {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Generate unique ID
 */
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

/**
 * Copy text to clipboard
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        createToast('Copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

/**
 * Smooth scroll to element
 */
function smoothScroll(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Check if user is online
 */
function isOnline() {
    return navigator.onLine;
}

/**
 * Get local storage item with fallback
 */
function getStorageItem(key, fallback = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        console.error('Failed to get storage item:', e);
        return fallback;
    }
}

/**
 * Set local storage item safely
 */
function setStorageItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error('Failed to set storage item:', e);
        return false;
    }
}

/**
 * Remove local storage item
 */
function removeStorageItem(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        console.error('Failed to remove storage item:', e);
        return false;
    }
}

/**
 * Format card number
 */
function formatCardNumber(number) {
    return number.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
}

/**
 * Validate card expiry date
 */
function isValidExpiry(expiry) {
    const [month, year] = expiry.split('/');
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    return parseInt(year) > currentYear || 
           (parseInt(year) === currentYear && parseInt(month) >= currentMonth);
}

/**
 * Get browser info
 */
function getBrowserInfo() {
    return {
        userAgent: navigator.userAgent,
        language: navigator.language,
        onLine: navigator.onLine
    };
}

/**
 * Request notification permission (if available)
 */
async function requestNotificationPermission() {
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            return true;
        } else if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
    }
    return false;
}

/**
 * Send notification
 */
function sendNotification(title, options = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            icon: '🍔',
            ...options
        });
    }
}

/**
 * Retry failed operation
 */
async function retryOperation(operation, maxAttempts = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await operation();
        } catch (error) {
            if (attempt === maxAttempts) throw error;
            await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
    }
}
