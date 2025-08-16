// API functionality for SaveMyWines
// Handles external API calls and data fetching

// Supabase Configuration
export const CONFIG = {
    SUPABASE_URL: "<YOUR_SUPABASE_URL>",
    SUPABASE_ANON_KEY: "<YOUR_SUPABASE_ANON_KEY>",
    EDGE_SCAN_URL: "<YOUR_SUPABASE_FUNCTION_URL>/scan_wine",
};

const API_CONFIG = {
    baseURL: 'https://api.example.com', // Replace with actual API endpoint
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

async function makeRequest(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...API_CONFIG.headers,
                ...options.headers
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout');
        }
        throw error;
    }
}

async function searchWines(query, filters = {}) {
    const params = new URLSearchParams({
        q: query,
        ...filters
    });
    
    try {
        return await makeRequest(`${API_CONFIG.baseURL}/wines/search?${params}`);
    } catch (error) {
        console.error('Error searching wines:', error);
        // Fallback to mock data
        return getMockData('search');
    }
}

async function getWineDetails(wineId) {
    try {
        return await makeRequest(`${API_CONFIG.baseURL}/wines/${wineId}`);
    } catch (error) {
        console.error('Error getting wine details:', error);
        // Fallback to mock data
        return getMockData('details');
    }
}

async function getWineRecommendations(wineId, limit = 5) {
    try {
        return await makeRequest(`${API_CONFIG.baseURL}/wines/${wineId}/recommendations?limit=${limit}`);
    } catch (error) {
        console.error('Error getting wine recommendations:', error);
        // Fallback to mock data
        return getMockData('recommendations');
    }
}

async function getWineRegions() {
    try {
        return await makeRequest(`${API_CONFIG.baseURL}/regions`);
    } catch (error) {
        console.error('Error getting wine regions:', error);
        // Fallback to mock data
        return getMockData('regions');
    }
}

async function getWineVarietals() {
    try {
        return await makeRequest(`${API_CONFIG.baseURL}/varietals`);
    } catch (error) {
        console.error('Error getting wine varietals:', error);
        // Fallback to mock data
        return getMockData('varietals');
    }
}

async function analyzeWineLabel(imageData) {
    try {
        const response = await fetch(`${API_CONFIG.baseURL}/analyze-label`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: imageData })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error analyzing wine label:', error);
        // Fallback to mock data
        return getMockData('label-analysis');
    }
}

async function getWineRatings(wineId) {
    try {
        return await makeRequest(`${API_CONFIG.baseURL}/wines/${wineId}/ratings`);
    } catch (error) {
        console.error('Error getting wine ratings:', error);
        // Fallback to mock data
        return getMockData('ratings');
    }
}

async function submitWineRating(wineId, rating, review = '') {
    try {
        const response = await fetch(`${API_CONFIG.baseURL}/wines/${wineId}/ratings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rating, review })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error submitting wine rating:', error);
        throw error;
    }
}

async function getWinePrice(wineId) {
    try {
        return await makeRequest(`${API_CONFIG.baseURL}/wines/${wineId}/price`);
    } catch (error) {
        console.error('Error getting wine price:', error);
        // Fallback to mock data
        return getMockData('price');
    }
}

async function getWineFoodPairings(wineId) {
    try {
        return await makeRequest(`${API_CONFIG.baseURL}/wines/${wineId}/food-pairings`);
    } catch (error) {
        console.error('Error getting food pairings:', error);
        // Fallback to mock data
        return getMockData('food-pairings');
    }
}

async function getWineTastingNotes(wineId) {
    try {
        return await makeRequest(`${API_CONFIG.baseURL}/wines/${wineId}/tasting-notes`);
    } catch (error) {
        console.error('Error getting tasting notes:', error);
        // Fallback to mock data
        return getMockData('tasting-notes');
    }
}

// Mock data for development and fallback
const MOCK_DATA = {
    search: {
        wines: [
            {
                id: 'mock-1',
                name: 'Château Margaux 2015',
                varietal: 'Cabernet Sauvignon',
                region: 'Bordeaux, France',
                vintage: '2015',
                rating: 4.8
            },
            {
                id: 'mock-2',
                name: 'Domaine de la Romanée-Conti 2018',
                varietal: 'Pinot Noir',
                region: 'Burgundy, France',
                vintage: '2018',
                rating: 4.9
            }
        ],
        total: 2
    },
    details: {
        id: 'mock-1',
        name: 'Château Margaux 2015',
        varietal: 'Cabernet Sauvignon',
        region: 'Bordeaux, France',
        vintage: '2015',
        rating: 4.8,
        description: 'A classic Bordeaux with complex aromas of black fruit, tobacco, and cedar.',
        price: '$850',
        alcohol: '13.5%'
    },
    recommendations: [
        {
            id: 'rec-1',
            name: 'Château Lafite Rothschild 2015',
            varietal: 'Cabernet Sauvignon',
            region: 'Bordeaux, France',
            vintage: '2015',
            rating: 4.9
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
    ],
    'label-analysis': {
        wineName: 'Château Margaux',
        varietal: 'Cabernet Sauvignon',
        region: 'Bordeaux, France',
        vintage: '2015',
        confidence: 0.95
    },
    ratings: {
        average: 4.8,
        count: 1250,
        distribution: {
            '5': 45,
            '4': 35,
            '3': 15,
            '2': 3,
            '1': 2
        }
    },
    price: {
        current: 850,
        currency: 'USD',
        historical: [
            { date: '2020-01-01', price: 800 },
            { date: '2021-01-01', price: 820 },
            { date: '2022-01-01', price: 850 }
        ]
    },
    'food-pairings': [
        'Beef tenderloin',
        'Lamb chops',
        'Aged cheese',
        'Dark chocolate'
    ],
    'tasting-notes': {
        nose: 'Black cherry, blackberry, tobacco, cedar',
        palate: 'Full-bodied, rich tannins, long finish',
        finish: 'Long and complex with notes of dark fruit and spice'
    }
};

async function getMockData(type) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_DATA[type] || null;
}

async function checkApiAvailability() {
    try {
        const response = await fetch(`${API_CONFIG.baseURL}/health`, {
            method: 'GET',
            signal: AbortSignal.timeout(5000)
        });
        return response.ok;
    } catch (error) {
        console.log('API not available, using mock data');
        return false;
    }
}

async function retryRequest(fn, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
    }
}

// Export API functions to global scope
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
