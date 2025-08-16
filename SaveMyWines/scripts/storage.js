// Storage functionality for SaveMyWines
// Handles local storage and data persistence

const STORAGE_KEYS = {
    WINES: 'savemywines_wines',
    SETTINGS: 'savemywines_settings',
    USER_PREFERENCES: 'savemywines_user_preferences',
    TASTING_NOTES: 'savemywines_tasting_notes',
    FAVORITES: 'savemywines_favorites',
    SCAN_HISTORY: 'savemywines_scan_history'
};

const DEFAULT_SETTINGS = {
    theme: 'light',
    language: 'en',
    notifications: true,
    autoBackup: true,
    backupFrequency: 'weekly'
};

const DEFAULT_USER_PREFERENCES = {
    preferredVarietals: [],
    preferredRegions: [],
    priceRange: { min: 0, max: 1000 },
    ratingThreshold: 4.0,
    showTastingNotes: true,
    showFoodPairings: true
};

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

// Generic storage functions
function getStorageItem(key, defaultValue = null) {
    if (!isStorageAvailable()) {
        console.warn('Local storage not available');
        return defaultValue;
    }
    
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading from storage (${key}):`, error);
        return defaultValue;
    }
}

function setStorageItem(key, value) {
    if (!isStorageAvailable()) {
        console.warn('Local storage not available');
        return false;
    }
    
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error writing to storage (${key}):`, error);
        return false;
    }
}

function removeStorageItem(key) {
    if (!isStorageAvailable()) return false;
    
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing from storage (${key}):`, error);
        return false;
    }
}

function clearStorage() {
    if (!isStorageAvailable()) return false;
    
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing storage:', error);
        return false;
    }
}

function getStorageUsage() {
    if (!isStorageAvailable()) return null;
    
    try {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        return {
            used: total,
            available: 5 * 1024 * 1024, // 5MB typical limit
            percentage: (total / (5 * 1024 * 1024)) * 100
        };
    } catch (error) {
        console.error('Error calculating storage usage:', error);
        return null;
    }
}

// Wine storage functions
function getWines() {
    return getStorageItem(STORAGE_KEYS.WINES, []);
}

function saveWines(wines) {
    return setStorageItem(STORAGE_KEYS.WINES, wines);
}

function addWine(wine) {
    const wines = getWines();
    wine.id = wine.id || generateId();
    wine.dateAdded = wine.dateAdded || new Date().toISOString();
    wines.push(wine);
    return saveWines(wines);
}

function updateWine(wineId, updates) {
    const wines = getWines();
    const index = wines.findIndex(w => w.id === wineId);
    
    if (index !== -1) {
        wines[index] = { ...wines[index], ...updates };
        return saveWines(wines);
    }
    
    return false;
}

function deleteWine(wineId) {
    const wines = getWines();
    const filteredWines = wines.filter(w => w.id !== wineId);
    return saveWines(filteredWines);
}

function getWineById(wineId) {
    const wines = getWines();
    return wines.find(w => w.id === wineId) || null;
}

function searchWines(query, filters = {}) {
    const wines = getWines();
    let results = wines;
    
    // Text search
    if (query) {
        const lowerQuery = query.toLowerCase();
        results = results.filter(wine => 
            wine.name.toLowerCase().includes(lowerQuery) ||
            wine.varietal.toLowerCase().includes(lowerQuery) ||
            wine.region.toLowerCase().includes(lowerQuery) ||
            wine.vintage.toString().includes(lowerQuery)
        );
    }
    
    // Apply filters
    if (filters.varietal) {
        results = results.filter(wine => 
            wine.varietal.toLowerCase() === filters.varietal.toLowerCase()
        );
    }
    
    if (filters.region) {
        results = results.filter(wine => 
            wine.region.toLowerCase().includes(filters.region.toLowerCase())
        );
    }
    
    if (filters.vintage) {
        results = results.filter(wine => 
            wine.vintage.toString() === filters.vintage.toString()
        );
    }
    
    if (filters.minRating) {
        results = results.filter(wine => 
            (wine.rating || 0) >= filters.minRating
        );
    }
    
    return results;
}

// Settings functions
function getSettings() {
    return getStorageItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
}

function updateSettings(updates) {
    const currentSettings = getSettings();
    const newSettings = { ...currentSettings, ...updates };
    return setStorageItem(STORAGE_KEYS.SETTINGS, newSettings);
}

function resetSettings() {
    return setStorageItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
}

// User preferences functions
function getUserPreferences() {
    return getStorageItem(STORAGE_KEYS.USER_PREFERENCES, DEFAULT_USER_PREFERENCES);
}

function updateUserPreferences(updates) {
    const currentPrefs = getUserPreferences();
    const newPrefs = { ...currentPrefs, ...updates };
    return setStorageItem(STORAGE_KEYS.USER_PREFERENCES, newPrefs);
}

// Tasting notes functions
function getTastingNotes(wineId = null) {
    const notes = getStorageItem(STORAGE_KEYS.TASTING_NOTES, {});
    
    if (wineId) {
        return notes[wineId] || [];
    }
    
    return notes;
}

function addTastingNote(wineId, note) {
    const notes = getTastingNotes();
    
    if (!notes[wineId]) {
        notes[wineId] = [];
    }
    
    note.id = generateId();
    note.dateAdded = new Date().toISOString();
    notes[wineId].push(note);
    
    return setStorageItem(STORAGE_KEYS.TASTING_NOTES, notes);
}

// Favorites functions
function getFavorites() {
    return getStorageItem(STORAGE_KEYS.FAVORITES, []);
}

function addToFavorites(wineId) {
    const favorites = getFavorites();
    
    if (!favorites.includes(wineId)) {
        favorites.push(wineId);
        return setStorageItem(STORAGE_KEYS.FAVORITES, favorites);
    }
    
    return true;
}

function removeFromFavorites(wineId) {
    const favorites = getFavorites();
    const filteredFavorites = favorites.filter(id => id !== wineId);
    return setStorageItem(STORAGE_KEYS.FAVORITES, filteredFavorites);
}

function isFavorite(wineId) {
    const favorites = getFavorites();
    return favorites.includes(wineId);
}

// Data import/export functions
function exportData() {
    try {
        const data = {
            wines: getWines(),
            settings: getSettings(),
            userPreferences: getUserPreferences(),
            tastingNotes: getTastingNotes(),
            favorites: getFavorites(),
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `savemywines-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return true;
    } catch (error) {
        console.error('Error exporting data:', error);
        return false;
    }
}

function importData(jsonData) {
    try {
        const data = JSON.parse(jsonData);
        
        // Validate data structure
        if (!data.wines || !Array.isArray(data.wines)) {
            throw new Error('Invalid data format: wines array missing');
        }
        
        // Import data
        if (data.wines) setStorageItem(STORAGE_KEYS.WINES, data.wines);
        if (data.settings) setStorageItem(STORAGE_KEYS.SETTINGS, data.settings);
        if (data.userPreferences) setStorageItem(STORAGE_KEYS.USER_PREFERENCES, data.userPreferences);
        if (data.tastingNotes) setStorageItem(STORAGE_KEYS.TASTING_NOTES, data.tastingNotes);
        if (data.favorites) setStorageItem(STORAGE_KEYS.FAVORITES, data.favorites);
        
        return true;
    } catch (error) {
        console.error('Error importing data:', error);
        throw error;
    }
}

function createBackup() {
    try {
        const data = {
            wines: getWines(),
            settings: getSettings(),
            userPreferences: getUserPreferences(),
            tastingNotes: getTastingNotes(),
            favorites: getFavorites(),
            backupDate: new Date().toISOString(),
            version: '1.0.0'
        };
        
        // Store backup in localStorage with timestamp
        const backupKey = `savemywines_backup_${Date.now()}`;
        setStorageItem(backupKey, data);
        
        // Keep only last 5 backups
        const backupKeys = Object.keys(localStorage).filter(key => 
            key.startsWith('savemywines_backup_')
        ).sort();
        
        if (backupKeys.length > 5) {
            const keysToRemove = backupKeys.slice(0, backupKeys.length - 5);
            keysToRemove.forEach(key => removeStorageItem(key));
        }
        
        return backupKey;
    } catch (error) {
        console.error('Error creating backup:', error);
        return null;
    }
}

function restoreBackup(backupKey) {
    try {
        const backup = getStorageItem(backupKey);
        
        if (!backup) {
            throw new Error('Backup not found');
        }
        
        return importData(JSON.stringify(backup));
    } catch (error) {
        console.error('Error restoring backup:', error);
        throw error;
    }
}

function listBackups() {
    try {
        const backupKeys = Object.keys(localStorage).filter(key => 
            key.startsWith('savemywines_backup_')
        ).sort().reverse();
        
        return backupKeys.map(key => {
            const backup = getStorageItem(key);
            return {
                key,
                date: backup?.backupDate || key.split('_').pop(),
                wineCount: backup?.wines?.length || 0,
                size: JSON.stringify(backup).length
            };
        });
    } catch (error) {
        console.error('Error listing backups:', error);
        return [];
    }
}

// Utility function
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Export storage functions to global scope
window.SaveMyWines = window.SaveMyWines || {};
window.SaveMyWines.storage = {
    isStorageAvailable,
    getStorageItem,
    setStorageItem,
    removeStorageItem,
    clearStorage,
    getStorageUsage,
    
    // Wine storage
    getWines,
    saveWines,
    addWine,
    updateWine,
    deleteWine,
    getWineById,
    searchWines,
    
    // Settings
    getSettings,
    updateSettings,
    resetSettings,
    
    // User preferences
    getUserPreferences,
    updateUserPreferences,
    
    // Tasting notes
    getTastingNotes,
    addTastingNote,
    
    // Favorites
    getFavorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    
    // Data management
    exportData,
    importData,
    createBackup,
    restoreBackup,
    listBackups
};
