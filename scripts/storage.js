// Storage functionality for SaveMyWines
// Handles local storage and data persistence

/**
 * Storage keys
 */
const STORAGE_KEYS = {
    WINES: 'savemywines_wines',
    SETTINGS: 'savemywines_settings',
    USER_PREFERENCES: 'savemywines_user_preferences',
    SCAN_HISTORY: 'savemywines_scan_history',
    FAVORITES: 'savemywines_favorites',
    TASTING_NOTES: 'savemywines_tasting_notes',
    RATINGS: 'savemywines_ratings'
};

/**
 * Default settings
 */
const DEFAULT_SETTINGS = {
    theme: 'light',
    language: 'en',
    currency: 'USD',
    units: 'metric',
    notifications: true,
    autoBackup: true,
    scanQuality: 'high',
    maxWines: 1000
};

/**
 * Default user preferences
 */
const DEFAULT_USER_PREFERENCES = {
    preferredVarietals: [],
    preferredRegions: [],
    priceRange: { min: 0, max: 1000 },
    ratingThreshold: 3.5,
    excludeVarietals: [],
    excludeRegions: []
};

/**
 * Check if localStorage is available
 * @returns {boolean} Whether localStorage is available
 */
function isStorageAvailable() {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Get item from storage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} Stored value or default
 */
function getStorageItem(key, defaultValue = null) {
    if (!isStorageAvailable()) {
        console.warn('localStorage is not available');
        return defaultValue;
    }
    
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading from storage key "${key}":`, error);
        return defaultValue;
    }
}

/**
 * Set item in storage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Whether storage was successful
 */
function setStorageItem(key, value) {
    if (!isStorageAvailable()) {
        console.warn('localStorage is not available');
        return false;
    }
    
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error writing to storage key "${key}":`, error);
        return false;
    }
}

/**
 * Remove item from storage
 * @param {string} key - Storage key
 * @returns {boolean} Whether removal was successful
 */
function removeStorageItem(key) {
    if (!isStorageAvailable()) {
        return false;
    }
    
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing storage key "${key}":`, error);
        return false;
    }
}

/**
 * Clear all storage
 * @returns {boolean} Whether clearing was successful
 */
function clearStorage() {
    if (!isStorageAvailable()) {
        return false;
    }
    
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing storage:', error);
        return false;
    }
}

/**
 * Get storage usage information
 * @returns {Object} Storage usage stats
 */
function getStorageUsage() {
    if (!isStorageAvailable()) {
        return { available: false };
    }
    
    try {
        let totalSize = 0;
        let itemCount = 0;
        
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                const item = localStorage.getItem(key);
                totalSize += item ? item.length : 0;
                itemCount++;
            }
        }
        
        return {
            available: true,
            totalSize: totalSize,
            totalSizeKB: (totalSize / 1024).toFixed(2),
            itemCount: itemCount,
            maxSize: '5MB' // Approximate localStorage limit
        };
    } catch (error) {
        console.error('Error getting storage usage:', error);
        return { available: false, error: error.message };
    }
}

// Wine storage functions

/**
 * Get all wines from storage
 * @returns {Array} Array of wine objects
 */
function getWines() {
    return getStorageItem(STORAGE_KEYS.WINES, []);
}

/**
 * Save wines to storage
 * @param {Array} wines - Array of wine objects
 * @returns {boolean} Whether save was successful
 */
function saveWines(wines) {
    return setStorageItem(STORAGE_KEYS.WINES, wines);
}

/**
 * Add a wine to storage
 * @param {Object} wine - Wine object to add
 * @returns {boolean} Whether add was successful
 */
function addWine(wine) {
    try {
        const wines = getWines();
        
        // Generate unique ID if not provided
        if (!wine.id) {
            wine.id = Date.now().toString();
        }
        
        // Add timestamp if not provided
        if (!wine.addedDate) {
            wine.addedDate = new Date().toISOString();
        }
        
        wines.push(wine);
        return saveWines(wines);
    } catch (error) {
        console.error('Error adding wine:', error);
        return false;
    }
}

/**
 * Update a wine in storage
 * @param {string} wineId - Wine ID to update
 * @param {Object} updates - Wine updates
 * @returns {boolean} Whether update was successful
 */
function updateWine(wineId, updates) {
    try {
        const wines = getWines();
        const wineIndex = wines.findIndex(w => w.id === wineId);
        
        if (wineIndex === -1) {
            return false;
        }
        
        wines[wineIndex] = { ...wines[wineIndex], ...updates };
        return saveWines(wines);
    } catch (error) {
        console.error('Error updating wine:', error);
        return false;
    }
}

/**
 * Delete a wine from storage
 * @param {string} wineId - Wine ID to delete
 * @returns {boolean} Whether deletion was successful
 */
function deleteWine(wineId) {
    try {
        const wines = getWines();
        const filteredWines = wines.filter(w => w.id !== wineId);
        
        if (filteredWines.length === wines.length) {
            return false; // Wine not found
        }
        
        return saveWines(filteredWines);
    } catch (error) {
        console.error('Error deleting wine:', error);
        return false;
    }
}

/**
 * Get wine by ID
 * @param {string} wineId - Wine ID
 * @returns {Object|null} Wine object or null if not found
 */
function getWineById(wineId) {
    const wines = getWines();
    return wines.find(w => w.id === wineId) || null;
}

/**
 * Search wines in storage
 * @param {string} query - Search query
 * @param {Object} filters - Search filters
 * @returns {Array} Filtered wine array
 */
function searchWines(query, filters = {}) {
    try {
        let wines = getWines();
        
        // Text search
        if (query) {
            const searchTerm = query.toLowerCase();
            wines = wines.filter(wine => 
                wine.name.toLowerCase().includes(searchTerm) ||
                wine.varietal.toLowerCase().includes(searchTerm) ||
                wine.region.toLowerCase().includes(searchTerm) ||
                wine.year.toString().includes(searchTerm)
            );
        }
        
        // Apply filters
        if (filters.varietal) {
            wines = wines.filter(wine => 
                wine.varietal.toLowerCase() === filters.varietal.toLowerCase()
            );
        }
        
        if (filters.region) {
            wines = wines.filter(wine => 
                wine.region.toLowerCase().includes(filters.region.toLowerCase())
            );
        }
        
        if (filters.year) {
            wines = wines.filter(wine => wine.year === filters.year);
        }
        
        if (filters.minYear) {
            wines = wines.filter(wine => wine.year >= filters.minYear);
        }
        
        if (filters.maxYear) {
            wines = wines.filter(wine => wine.year <= filters.maxYear);
        }
        
        if (filters.rating) {
            wines = wines.filter(wine => wine.rating >= filters.rating);
        }
        
        return wines;
    } catch (error) {
        console.error('Error searching wines:', error);
        return [];
    }
}

// Settings storage functions

/**
 * Get user settings
 * @returns {Object} User settings
 */
function getSettings() {
    return getStorageItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
}

/**
 * Update user settings
 * @param {Object} updates - Settings updates
 * @returns {boolean} Whether update was successful
 */
function updateSettings(updates) {
    try {
        const currentSettings = getSettings();
        const newSettings = { ...currentSettings, ...updates };
        return setStorageItem(STORAGE_KEYS.SETTINGS, newSettings);
    } catch (error) {
        console.error('Error updating settings:', error);
        return false;
    }
}

/**
 * Reset settings to defaults
 * @returns {boolean} Whether reset was successful
 */
function resetSettings() {
    return setStorageItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
}

// User preferences storage functions

/**
 * Get user preferences
 * @returns {Object} User preferences
 */
function getUserPreferences() {
    return getStorageItem(STORAGE_KEYS.USER_PREFERENCES, DEFAULT_USER_PREFERENCES);
}

/**
 * Update user preferences
 * @param {Object} updates - Preference updates
 * @returns {boolean} Whether update was successful
 */
function updateUserPreferences(updates) {
    try {
        const currentPreferences = getUserPreferences();
        const newPreferences = { ...currentPreferences, ...updates };
        return setStorageItem(STORAGE_KEYS.USER_PREFERENCES, newPreferences);
    } catch (error) {
        console.error('Error updating user preferences:', error);
        return false;
    }
}

// Tasting notes storage functions

/**
 * Get tasting notes for a wine
 * @param {string} wineId - Wine ID
 * @returns {Array} Array of tasting notes
 */
function getTastingNotes(wineId) {
    const allNotes = getStorageItem(STORAGE_KEYS.TASTING_NOTES, {});
    return allNotes[wineId] || [];
}

/**
 * Add tasting note to a wine
 * @param {string} wineId - Wine ID
 * @param {Object} note - Tasting note object
 * @returns {boolean} Whether add was successful
 */
function addTastingNote(wineId, note) {
    try {
        const allNotes = getStorageItem(STORAGE_KEYS.TASTING_NOTES, {});
        
        if (!allNotes[wineId]) {
            allNotes[wineId] = [];
        }
        
        // Add timestamp if not provided
        if (!note.timestamp) {
            note.timestamp = new Date().toISOString();
        }
        
        // Generate ID if not provided
        if (!note.id) {
            note.id = Date.now().toString();
        }
        
        allNotes[wineId].push(note);
        return setStorageItem(STORAGE_KEYS.TASTING_NOTES, allNotes);
    } catch (error) {
        console.error('Error adding tasting note:', error);
        return false;
    }
}

// Favorites storage functions

/**
 * Get favorite wines
 * @returns {Array} Array of favorite wine IDs
 */
function getFavorites() {
    return getStorageItem(STORAGE_KEYS.FAVORITES, []);
}

/**
 * Add wine to favorites
 * @param {string} wineId - Wine ID to add
 * @returns {boolean} Whether add was successful
 */
function addToFavorites(wineId) {
    try {
        const favorites = getFavorites();
        
        if (!favorites.includes(wineId)) {
            favorites.push(wineId);
            return setStorageItem(STORAGE_KEYS.FAVORITES, favorites);
        }
        
        return true; // Already in favorites
    } catch (error) {
        console.error('Error adding to favorites:', error);
        return false;
    }
}

/**
 * Remove wine from favorites
 * @param {string} wineId - Wine ID to remove
 * @returns {boolean} Whether removal was successful
 */
function removeFromFavorites(wineId) {
    try {
        const favorites = getFavorites();
        const filteredFavorites = favorites.filter(id => id !== wineId);
        
        if (filteredFavorites.length === favorites.length) {
            return false; // Not in favorites
        }
        
        return setStorageItem(STORAGE_KEYS.FAVORITES, filteredFavorites);
    } catch (error) {
        console.error('Error removing from favorites:', error);
        return false;
    }
}

/**
 * Check if wine is in favorites
 * @param {string} wineId - Wine ID to check
 * @returns {boolean} Whether wine is in favorites
 */
function isFavorite(wineId) {
    const favorites = getFavorites();
    return favorites.includes(wineId);
}

// Backup and export functions

/**
 * Export all data as JSON
 * @returns {string} JSON string of all data
 */
function exportData() {
    try {
        const data = {
            wines: getWines(),
            settings: getSettings(),
            userPreferences: getUserPreferences(),
            favorites: getFavorites(),
            tastingNotes: getStorageItem(STORAGE_KEYS.TASTING_NOTES, {}),
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };
        
        return JSON.stringify(data, null, 2);
    } catch (error) {
        console.error('Error exporting data:', error);
        return null;
    }
}

/**
 * Import data from JSON
 * @param {string} jsonData - JSON string to import
 * @returns {boolean} Whether import was successful
 */
function importData(jsonData) {
    try {
        const data = JSON.parse(jsonData);
        
        // Validate data structure
        if (!data.wines || !Array.isArray(data.wines)) {
            throw new Error('Invalid data format: wines array required');
        }
        
        // Import data
        if (data.wines) setStorageItem(STORAGE_KEYS.WINES, data.wines);
        if (data.settings) setStorageItem(STORAGE_KEYS.SETTINGS, data.settings);
        if (data.userPreferences) setStorageItem(STORAGE_KEYS.USER_PREFERENCES, data.userPreferences);
        if (data.favorites) setStorageItem(STORAGE_KEYS.FAVORITES, data.favorites);
        if (data.tastingNotes) setStorageItem(STORAGE_KEYS.TASTING_NOTES, data.tastingNotes);
        
        return true;
    } catch (error) {
        console.error('Error importing data:', error);
        return false;
    }
}

/**
 * Create backup of current data
 * @returns {string} Backup filename
 */
function createBackup() {
    try {
        const data = exportData();
        if (!data) return null;
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `savemywines-backup-${timestamp}.json`;
        
        // Create download link
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        
        URL.revokeObjectURL(url);
        return filename;
    } catch (error) {
        console.error('Error creating backup:', error);
        return null;
    }
}

// Export functions for use in other modules
window.SaveMyWines = window.SaveMyWines || {};
window.SaveMyWines.storage = {
    // Core storage functions
    isStorageAvailable,
    getStorageItem,
    setStorageItem,
    removeStorageItem,
    clearStorage,
    getStorageUsage,
    
    // Wine storage functions
    getWines,
    saveWines,
    addWine,
    updateWine,
    deleteWine,
    getWineById,
    searchWines,
    
    // Settings functions
    getSettings,
    updateSettings,
    resetSettings,
    
    // User preferences functions
    getUserPreferences,
    updateUserPreferences,
    
    // Tasting notes functions
    getTastingNotes,
    addTastingNote,
    
    // Favorites functions
    getFavorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    
    // Backup functions
    exportData,
    importData,
    createBackup
};
