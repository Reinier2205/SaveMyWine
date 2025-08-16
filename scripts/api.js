// API functionality for SaveMyWines
// Handles external API calls and data fetching

/**
 * Base API configuration
 */
const API_CONFIG = {
    baseURL: 'https://api.example.com', // Replace with actual API endpoint
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

/**
 * Make an HTTP request
 * @param {string} url - Request URL
 * @param {Object} options - Request options
 * @returns {Promise} Response promise
 */
async function makeRequest(url, options = {}) {
    const config = {
        method: 'GET',
        headers: { ...API_CONFIG.headers, ...options.headers },
        timeout: API_CONFIG.timeout,
        ...options
    };

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout);

        const response = await fetch(url, {
            ...config,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timeout');
        }
        throw error;
    }
}

/**
 * Search for wine information
 * @param {string} query - Search query
 * @param {Object} filters - Search filters
 * @returns {Promise} Search results
 */
async function searchWines(query, filters = {}) {
    try {
        const params = new URLSearchParams({
            q: query,
            ...filters
        });

        const url = `${API_CONFIG.baseURL}/wines/search?${params}`;
        const results = await makeRequest(url);

        return {
            success: true,
            data: results,
            query,
            filters
        };
    } catch (error) {
        console.error('Error searching wines:', error);
        return {
            success: false,
            error: error.message,
            query,
            filters
        };
    }
}

/**
 * Get wine details by ID
 * @param {string} wineId - Wine ID
 * @returns {Promise} Wine details
 */
async function getWineDetails(wineId) {
    try {
        const url = `${API_CONFIG.baseURL}/wines/${wineId}`;
        const wine = await makeRequest(url);

        return {
            success: true,
            data: wine
        };
    } catch (error) {
        console.error('Error getting wine details:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Get wine recommendations
 * @param {Object} preferences - User preferences
 * @returns {Promise} Wine recommendations
 */
async function getWineRecommendations(preferences = {}) {
    try {
        const url = `${API_CONFIG.baseURL}/wines/recommendations`;
        const recommendations = await makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(preferences)
        });

        return {
            success: true,
            data: recommendations
        };
    } catch (error) {
        console.error('Error getting wine recommendations:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Get wine regions
 * @returns {Promise} List of wine regions
 */
async function getWineRegions() {
    try {
        const url = `${API_CONFIG.baseURL}/wines/regions`;
        const regions = await makeRequest(url);

        return {
            success: true,
            data: regions
        };
    } catch (error) {
        console.error('Error getting wine regions:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Get wine varietals
 * @returns {Promise} List of wine varietals
 */
async function getWineVarietals() {
    try {
        const url = `${API_CONFIG.baseURL}/wines/varietals`;
        const varietals = await makeRequest(url);

        return {
            success: true,
            data: varietals
        };
    } catch (error) {
        console.error('Error getting wine varietals:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Analyze wine label image
 * @param {File|Blob} imageFile - Wine label image
 * @returns {Promise} Analysis results
 */
async function analyzeWineLabel(imageFile) {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const url = `${API_CONFIG.baseURL}/wines/analyze`;
        const analysis = await makeRequest(url, {
            method: 'POST',
            body: formData,
            headers: {} // Let browser set Content-Type for FormData
        });

        return {
            success: true,
            data: analysis
        };
    } catch (error) {
        console.error('Error analyzing wine label:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Get wine ratings and reviews
 * @param {string} wineId - Wine ID
 * @returns {Promise} Ratings and reviews
 */
async function getWineRatings(wineId) {
    try {
        const url = `${API_CONFIG.baseURL}/wines/${wineId}/ratings`;
        const ratings = await makeRequest(url);

        return {
            success: true,
            data: ratings
        };
    } catch (error) {
        console.error('Error getting wine ratings:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Submit wine rating
 * @param {string} wineId - Wine ID
 * @param {Object} rating - Rating data
 * @returns {Promise} Submission result
 */
async function submitWineRating(wineId, rating) {
    try {
        const url = `${API_CONFIG.baseURL}/wines/${wineId}/ratings`;
        const result = await makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(rating)
        });

        return {
            success: true,
            data: result
        };
    } catch (error) {
        console.error('Error submitting wine rating:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Get wine price information
 * @param {string} wineId - Wine ID
 * @returns {Promise} Price information
 */
async function getWinePrice(wineId) {
    try {
        const url = `${API_CONFIG.baseURL}/wines/${wineId}/price`;
        const price = await makeRequest(url);

        return {
            success: true,
            data: price
        };
    } catch (error) {
        console.error('Error getting wine price:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Get wine food pairings
 * @param {string} wineId - Wine ID
 * @returns {Promise} Food pairings
 */
async function getWineFoodPairings(wineId) {
    try {
        const url = `${API_CONFIG.baseURL}/wines/${wineId}/pairings`;
        const pairings = await makeRequest(url);

        return {
            success: true,
            data: pairings
        };
    } catch (error) {
        console.error('Error getting wine food pairings:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Get wine tasting notes
 * @param {string} wineId - Wine ID
 * @returns {Promise} Tasting notes
 */
async function getWineTastingNotes(wineId) {
    try {
        const url = `${API_CONFIG.baseURL}/wines/${wineId}/tasting-notes`;
        const notes = await makeRequest(url);

        return {
            success: true,
            data: notes
        };
    } catch (error) {
        console.error('Error getting wine tasting notes:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Mock API responses for development/testing
 */
const MOCK_DATA = {
    wines: [
        {
            id: '1',
            name: 'Château Margaux 2015',
            varietal: 'cabernet-sauvignon',
            region: 'Bordeaux, France',
            year: 2015,
            rating: 4.8,
            price: '$850',
            description: 'A legendary Bordeaux with exceptional complexity and aging potential.'
        },
        {
            id: '2',
            name: 'Domaine de la Romanée-Conti 2018',
            varietal: 'pinot-noir',
            region: 'Burgundy, France',
            year: 2018,
            rating: 4.9,
            price: '$15,000',
            description: 'One of the most prestigious and expensive wines in the world.'
        }
    ],
    regions: [
        'Bordeaux, France',
        'Burgundy, France',
        'Tuscany, Italy',
        'Napa Valley, California',
        'Barossa Valley, Australia'
    ],
    varietals: [
        'Cabernet Sauvignon',
        'Merlot',
        'Pinot Noir',
        'Chardonnay',
        'Sauvignon Blanc',
        'Syrah',
        'Malbec'
    ]
};

/**
 * Get mock data for development
 * @param {string} type - Data type
 * @returns {Promise} Mock data
 */
async function getMockData(type) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
        success: true,
        data: MOCK_DATA[type] || [],
        isMock: true
    };
}

/**
 * Check if API is available
 * @returns {Promise} API availability status
 */
async function checkApiAvailability() {
    try {
        const response = await fetch(`${API_CONFIG.baseURL}/health`, {
            method: 'GET',
            signal: AbortSignal.timeout(5000)
        });
        
        return {
            available: response.ok,
            status: response.status
        };
    } catch (error) {
        return {
            available: false,
            error: error.message
        };
    }
}

/**
 * Retry failed requests
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} delay - Delay between retries
 * @returns {Promise} Function result
 */
async function retryRequest(fn, maxRetries = 3, delay = 1000) {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            
            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
            }
        }
    }
    
    throw lastError;
}

// Export functions for use in other modules
window.SaveMyWines = window.SaveMyWines || {};
window.SaveMyWines.api = {
    makeRequest,
    searchWines,
    getWineDetails,
    getWineRecommendations,
    getWineRegions,
    getWineVarietals,
    analyzeWineLabel,
    getWineRatings,
    submitWineRating,
    getWinePrice,
    getWineFoodPairings,
    getWineTastingNotes,
    getMockData,
    checkApiAvailability,
    retryRequest
};
