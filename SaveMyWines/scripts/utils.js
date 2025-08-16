// Utility functions for SaveMyWines
// Common helper functions used across the application

// ID generation
function generateId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Formatting functions
function formatNumber(num) {
    if (typeof num !== 'number') return num;
    return new Intl.NumberFormat().format(num);
}

function formatCurrency(amount, currency = 'USD', locale = 'en-US') {
    if (typeof amount !== 'number') return amount;
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    }).format(amount);
}

function formatRelativeDate(date) {
    if (!date) return '';
    
    const now = new Date();
    const targetDate = new Date(date);
    const diffTime = Math.abs(now - targetDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// String manipulation
function capitalize(str) {
    if (typeof str !== 'string') return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function toTitleCase(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function kebabToTitleCase(str) {
    if (typeof str !== 'string') return str;
    return str.split('-').map(word => capitalize(word)).join(' ');
}

function snakeToTitleCase(str) {
    if (typeof str !== 'string') return str;
    return str.split('_').map(word => capitalize(word)).join(' ');
}

function truncate(str, length = 100, suffix = '...') {
    if (typeof str !== 'string') return str;
    if (str.length <= length) return str;
    return str.substring(0, length) + suffix;
}

function stripHtml(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/<[^>]*>/g, '');
}

function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function unescapeHtml(str) {
    if (typeof str !== 'string') return str;
    const div = document.createElement('div');
    div.innerHTML = str;
    return div.textContent || div.innerText || '';
}

// Color functions
function generateRandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

function generateColorPalette(count = 5) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        colors.push(generateRandomColor());
    }
    return colors;
}

// Validation functions
function isValidEmail(email) {
    if (typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidUrl(url) {
    if (typeof url !== 'string') return false;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function isValidPhone(phone) {
    if (typeof phone !== 'string') return false;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Object manipulation
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = deepClone(obj[key]);
            }
        }
        return cloned;
    }
    return obj;
}

function deepMerge(...objects) {
    const result = {};
    
    objects.forEach(obj => {
        if (obj && typeof obj === 'object') {
            Object.keys(obj).forEach(key => {
                if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                    result[key] = deepMerge(result[key] || {}, obj[key]);
                } else {
                    result[key] = obj[key];
                }
            });
        }
    });
    
    return result;
}

// Function utilities
function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(this, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(this, args);
    };
}

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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function retry(fn, maxRetries = 3, baseDelay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await sleep(baseDelay * Math.pow(2, i));
        }
    }
}

// Hash and encoding
function hashString(str) {
    if (typeof str !== 'string') return '';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
}

function getInitials(name) {
    if (typeof name !== 'string') return '';
    return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

// Device and browser detection
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isAndroid() {
    return /Android/.test(navigator.userAgent);
}

function isFeatureSupported(feature) {
    const features = {
        'localStorage': typeof Storage !== 'undefined',
        'serviceWorker': 'serviceWorker' in navigator,
        'camera': navigator.mediaDevices && navigator.mediaDevices.getUserMedia,
        'geolocation': 'geolocation' in navigator,
        'notifications': 'Notification' in window,
        'pushManager': 'PushManager' in window,
        'fetch': 'fetch' in window,
        'promises': 'Promise' in window
    };
    
    return features[feature] || false;
}

function getDevicePixelRatio() {
    return window.devicePixelRatio || 1;
}

function getViewportDimensions() {
    return {
        width: window.innerWidth || document.documentElement.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight
    };
}

// DOM utilities
function isInViewport(element) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function scrollIntoView(element, options = {}) {
    if (!element) return;
    
    const defaultOptions = {
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
    };
    
    element.scrollIntoView({ ...defaultOptions, ...options });
}

// Array utilities
function chunk(array, size) {
    if (!Array.isArray(array)) return [];
    
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

function shuffle(array) {
    if (!Array.isArray(array)) return array;
    
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function unique(array, key = null) {
    if (!Array.isArray(array)) return array;
    
    if (key) {
        const seen = new Set();
        return array.filter(item => {
            const value = item[key];
            if (seen.has(value)) {
                return false;
            }
            seen.add(value);
            return true;
        });
    }
    
    return [...new Set(array)];
}

// Date utilities
function isToday(date) {
    const today = new Date();
    const targetDate = new Date(date);
    return today.toDateString() === targetDate.toDateString();
}

function isThisWeek(date) {
    const today = new Date();
    const targetDate = new Date(date);
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return targetDate >= oneWeekAgo && targetDate <= today;
}

function isThisMonth(date) {
    const today = new Date();
    const targetDate = new Date(date);
    return today.getMonth() === targetDate.getMonth() && 
           today.getFullYear() === targetDate.getFullYear();
}

// Export utility functions to global scope
window.SaveMyWines = window.SaveMyWines || {};
window.SaveMyWines.utils = {
    // ID generation
    generateId,
    generateUUID,
    
    // Formatting
    formatNumber,
    formatCurrency,
    formatRelativeDate,
    formatFileSize,
    
    // String manipulation
    capitalize,
    toTitleCase,
    kebabToTitleCase,
    snakeToTitleCase,
    truncate,
    stripHtml,
    escapeHtml,
    unescapeHtml,
    
    // Color functions
    generateRandomColor,
    generateColorPalette,
    
    // Validation
    isValidEmail,
    isValidUrl,
    isValidPhone,
    
    // Object manipulation
    deepClone,
    deepMerge,
    
    // Function utilities
    debounce,
    throttle,
    sleep,
    retry,
    
    // Hash and encoding
    hashString,
    getInitials,
    
    // Device detection
    isMobile,
    isIOS,
    isAndroid,
    isFeatureSupported,
    getDevicePixelRatio,
    getViewportDimensions,
    
    // DOM utilities
    isInViewport,
    scrollIntoView,
    
    // Array utilities
    chunk,
    shuffle,
    unique,
    
    // Date utilities
    isToday,
    isThisWeek,
    isThisMonth
};
