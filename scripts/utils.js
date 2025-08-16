// Utility functions for SaveMyWines
// Common helper functions used across the application

/**
 * Generate a unique ID
 * @param {number} length - Length of the ID
 * @returns {string} Unique ID
 */
function generateId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Generate a UUID v4
 * @returns {string} UUID v4 string
 */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Format a number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
function formatNumber(num) {
    if (typeof num !== 'number') return num;
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @param {string} locale - Locale for formatting
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount, currency = 'USD', locale = 'en-US') {
    if (typeof amount !== 'number') return amount;
    
    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
        }).format(amount);
    } catch (error) {
        // Fallback formatting
        return `${currency} ${amount.toFixed(2)}`;
    }
}

/**
 * Format date relative to now
 * @param {Date|string} date - Date to format
 * @returns {string} Relative date string
 */
function formatRelativeDate(date) {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const now = new Date();
    const diffInSeconds = Math.floor((now - d) / 1000);
    
    if (diffInSeconds < 60) {
        return 'just now';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 31536000) {
        const months = Math.floor(diffInSeconds / 2592000);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
        const years = Math.floor(diffInSeconds / 31536000);
        return `${years} year${years > 1 ? 's' : ''} ago`;
    }
}

/**
 * Format file size in human readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalize(str) {
    if (typeof str !== 'string') return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert string to title case
 * @param {string} str - String to convert
 * @returns {string} Title case string
 */
function toTitleCase(str) {
    if (typeof str !== 'string') return str;
    
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

/**
 * Convert kebab-case to Title Case
 * @param {string} str - Kebab case string
 * @returns {string} Title case string
 */
function kebabToTitleCase(str) {
    if (typeof str !== 'string') return str;
    
    return str
        .split('-')
        .map(word => capitalize(word))
        .join(' ');
}

/**
 * Convert snake_case to Title Case
 * @param {string} str - Snake case string
 * @returns {string} Title case string
 */
function snakeToTitleCase(str) {
    if (typeof str !== 'string') return str;
    
    return str
        .split('_')
        .map(word => capitalize(word))
        .join(' ');
}

/**
 * Truncate string to specified length
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add if truncated
 * @returns {string} Truncated string
 */
function truncate(str, length = 100, suffix = '...') {
    if (typeof str !== 'string') return str;
    if (str.length <= length) return str;
    
    return str.substring(0, length - suffix.length) + suffix;
}

/**
 * Remove HTML tags from string
 * @param {string} str - String with HTML tags
 * @returns {string} Clean string
 */
function stripHtml(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/<[^>]*>/g, '');
}

/**
 * Escape HTML special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    
    const htmlEscapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
    };
    
    return str.replace(/[&<>"'/]/g, function(match) {
        return htmlEscapes[match];
    });
}

/**
 * Unescape HTML entities
 * @param {string} str - String to unescape
 * @returns {string} Unescaped string
 */
function unescapeHtml(str) {
    if (typeof str !== 'string') return str;
    
    const htmlUnescapes = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#x27;': "'",
        '&#x2F;': '/'
    };
    
    return str.replace(/&amp;|&lt;|&gt;|&quot;|&#x27;|&#x2F;/g, function(match) {
        return htmlUnescapes[match];
    });
}

/**
 * Generate a random color
 * @returns {string} Hex color string
 */
function generateRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

/**
 * Generate a random color palette
 * @param {number} count - Number of colors to generate
 * @returns {Array} Array of hex color strings
 */
function generateColorPalette(count = 5) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        colors.push(generateRandomColor());
    }
    return colors;
}

/**
 * Check if string is a valid email
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
function isValidEmail(email) {
    if (typeof email !== 'string') return false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Check if string is a valid URL
 * @param {string} url - URL to validate
 * @returns {boolean} Whether URL is valid
 */
function isValidUrl(url) {
    if (typeof url !== 'string') return false;
    
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Check if string is a valid phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Whether phone number is valid
 */
function isValidPhone(phone) {
    if (typeof phone !== 'string') return false;
    
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Check if it's a valid length (7-15 digits)
    return digits.length >= 7 && digits.length <= 15;
}

/**
 * Deep clone an object
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
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

/**
 * Merge objects deeply
 * @param {...Object} objects - Objects to merge
 * @returns {Object} Merged object
 */
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

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Whether to execute immediately
 * @returns {Function} Debounced function
 */
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

/**
 * Throttle function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after sleep
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} Function result
 */
async function retry(fn, maxRetries = 3, baseDelay = 1000) {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            
            if (i < maxRetries - 1) {
                const delay = baseDelay * Math.pow(2, i);
                await sleep(delay);
            }
        }
    }
    
    throw lastError;
}

/**
 * Generate a hash from string
 * @param {string} str - String to hash
 * @returns {string} Hash string
 */
function hashString(str) {
    if (typeof str !== 'string') return '';
    
    let hash = 0;
    if (str.length === 0) return hash.toString();
    
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    
    return hash.toString();
}

/**
 * Generate initials from name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
function getInitials(name) {
    if (typeof name !== 'string') return '';
    
    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .substring(0, 2);
}

/**
 * Check if device is mobile
 * @returns {boolean} Whether device is mobile
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Check if device is iOS
 * @returns {boolean} Whether device is iOS
 */
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

/**
 * Check if device is Android
 * @returns {boolean} Whether device is Android
 */
function isAndroid() {
    return /Android/.test(navigator.userAgent);
}

/**
 * Check if browser supports specific feature
 * @param {string} feature - Feature to check
 * @returns {boolean} Whether feature is supported
 */
function isFeatureSupported(feature) {
    const features = {
        'localStorage': typeof Storage !== 'undefined',
        'sessionStorage': typeof sessionStorage !== 'undefined',
        'geolocation': 'geolocation' in navigator,
        'camera': 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
        'serviceWorker': 'serviceWorker' in navigator,
        'pushNotifications': 'PushManager' in window,
        'webGL': 'WebGLRenderingContext' in window,
        'webAudio': 'AudioContext' in window || 'webkitAudioContext' in window
    };
    
    return features[feature] || false;
}

/**
 * Get device pixel ratio
 * @returns {number} Device pixel ratio
 */
function getDevicePixelRatio() {
    return window.devicePixelRatio || 1;
}

/**
 * Get viewport dimensions
 * @returns {Object} Viewport dimensions
 */
function getViewportDimensions() {
    return {
        width: window.innerWidth || document.documentElement.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight
    };
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} Whether element is in viewport
 */
function isInViewport(element) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const viewport = getViewportDimensions();
    
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= viewport.height &&
        rect.right <= viewport.width
    );
}

/**
 * Scroll element into view smoothly
 * @param {HTMLElement} element - Element to scroll to
 * @param {Object} options - Scroll options
 */
function scrollIntoView(element, options = {}) {
    if (!element) return;
    
    const defaultOptions = {
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
    };
    
    element.scrollIntoView({ ...defaultOptions, ...options });
}

// Export functions for use in other modules
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
    capitalize,
    toTitleCase,
    kebabToTitleCase,
    snakeToTitleCase,
    truncate,
    
    // HTML utilities
    stripHtml,
    escapeHtml,
    unescapeHtml,
    
    // Color utilities
    generateRandomColor,
    generateColorPalette,
    
    // Validation
    isValidEmail,
    isValidUrl,
    isValidPhone,
    
    // Object utilities
    deepClone,
    deepMerge,
    
    // Function utilities
    debounce,
    throttle,
    sleep,
    retry,
    
    // String utilities
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
    scrollIntoView
};
