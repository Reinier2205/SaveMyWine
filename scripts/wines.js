// Wines collection functionality for SaveMyWines
// Handles displaying, filtering, and managing wine collection

document.addEventListener('DOMContentLoaded', function() {
    console.log('Wines page loaded');
    
    initializeWinesPage();
});

/**
 * Initialize the wines page functionality
 */
function initializeWinesPage() {
    loadWines();
    initializeFilters();
    initializeSearch();
    initializeWineActions();
}

/**
 * Load wines from storage and display them
 */
function loadWines() {
    try {
        const wines = JSON.parse(localStorage.getItem('savemywines_wines') || '[]');
        displayWines(wines);
        
        // Show/hide empty state
        const emptyState = document.querySelector('.empty-state');
        const winesGrid = document.querySelector('.wines-grid');
        
        if (wines.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            if (winesGrid) winesGrid.style.display = 'none';
        } else {
            if (emptyState) emptyState.style.display = 'none';
            if (winesGrid) winesGrid.style.display = 'grid';
        }
    } catch (error) {
        console.error('Error loading wines:', error);
        SaveMyWines.utils.showToast('Error loading wine collection', 'error');
    }
}

/**
 * Display wines in the grid
 * @param {Array} wines - Array of wine objects
 */
function displayWines(wines) {
    const winesGrid = document.querySelector('.wines-grid');
    if (!winesGrid) return;
    
    // Clear existing wines
    winesGrid.innerHTML = '';
    
    if (wines.length === 0) {
        winesGrid.innerHTML = '<p class="no-wines">No wines found</p>';
        return;
    }
    
    // Create wine cards
    wines.forEach(wine => {
        const wineCard = createWineCard(wine);
        winesGrid.appendChild(wineCard);
    });
}

/**
 * Create a wine card element
 * @param {Object} wine - Wine object
 * @returns {HTMLElement} Wine card element
 */
function createWineCard(wine) {
    const card = document.createElement('div');
    card.className = 'card wine-card';
    card.dataset.wineId = wine.id;
    
    // Determine wine type for tag
    const wineType = getWineType(wine.varietal);
    
    card.innerHTML = `
        <div class="wine-image">
            <div class="wine-placeholder">🍷</div>
        </div>
        <div class="wine-info">
            <h3 class="wine-name">${escapeHtml(wine.name)}</h3>
            <p class="wine-details">${escapeHtml(wine.region)} • ${escapeHtml(wine.varietal)}</p>
            <div class="wine-tags">
                <span class="tag">${wineType}</span>
                <span class="tag">${wine.year}</span>
            </div>
            <div class="wine-actions">
                <button class="button button-secondary view-details-btn">View Details</button>
                <button class="button button-secondary edit-wine-btn">Edit</button>
                <button class="button button-secondary delete-wine-btn">Delete</button>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Get wine type based on varietal
 * @param {string} varietal - Wine varietal
 * @returns {string} Wine type (Red, White, etc.)
 */
function getWineType(varietal) {
    const redVarietals = ['cabernet-sauvignon', 'merlot', 'pinot-noir', 'syrah', 'malbec'];
    const whiteVarietals = ['chardonnay', 'sauvignon-blanc', 'riesling', 'pinot-grigio'];
    
    if (redVarietals.includes(varietal.toLowerCase())) {
        return 'Red';
    } else if (whiteVarietals.includes(varietal.toLowerCase())) {
        return 'White';
    }
    return 'Other';
}

/**
 * Initialize filter functionality
 */
function initializeFilters() {
    const varietalFilter = document.getElementById('filter-varietal');
    const regionFilter = document.getElementById('filter-region');
    
    if (varietalFilter) {
        varietalFilter.addEventListener('change', applyFilters);
    }
    
    if (regionFilter) {
        regionFilter.addEventListener('change', applyFilters);
    }
}

/**
 * Initialize search functionality
 */
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        const debouncedSearch = SaveMyWines.utils.debounce(performSearch, 300);
        searchInput.addEventListener('input', debouncedSearch);
    }
}

/**
 * Initialize wine action buttons
 */
function initializeWineActions() {
    // Use event delegation for dynamic wine cards
    document.addEventListener('click', function(event) {
        const target = event.target;
        
        if (target.classList.contains('view-details-btn')) {
            const wineCard = target.closest('.wine-card');
            const wineId = wineCard.dataset.wineId;
            viewWineDetails(wineId);
        } else if (target.classList.contains('edit-wine-btn')) {
            const wineCard = target.closest('.wine-card');
            const wineId = wineCard.dataset.wineId;
            editWine(wineId);
        } else if (target.classList.contains('delete-wine-btn')) {
            const wineCard = target.closest('.wine-card');
            const wineId = wineCard.dataset.wineId;
            deleteWine(wineId);
        }
    });
}

/**
 * Apply filters to wine collection
 */
function applyFilters() {
    const varietalFilter = document.getElementById('filter-varietal');
    const regionFilter = document.getElementById('filter-region');
    
    const varietalValue = varietalFilter ? varietalFilter.value : '';
    const regionValue = regionFilter ? regionFilter.value : '';
    
    try {
        let wines = JSON.parse(localStorage.getItem('savemywines_wines') || '[]');
        
        // Apply filters
        if (varietalValue) {
            wines = wines.filter(wine => 
                wine.varietal.toLowerCase() === varietalValue.toLowerCase()
            );
        }
        
        if (regionValue) {
            wines = wines.filter(wine => 
                wine.region.toLowerCase().includes(regionValue.toLowerCase())
            );
        }
        
        displayWines(wines);
    } catch (error) {
        console.error('Error applying filters:', error);
    }
}

/**
 * Perform search on wine collection
 * @param {Event} event - Search input event
 */
function performSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    
    if (!searchTerm) {
        // If no search term, show all wines
        applyFilters();
        return;
    }
    
    try {
        let wines = JSON.parse(localStorage.getItem('savemywines_wines') || '[]');
        
        // Filter wines by search term
        const filteredWines = wines.filter(wine => 
            wine.name.toLowerCase().includes(searchTerm) ||
            wine.varietal.toLowerCase().includes(searchTerm) ||
            wine.region.toLowerCase().includes(searchTerm) ||
            wine.year.toString().includes(searchTerm)
        );
        
        displayWines(filteredWines);
    } catch (error) {
        console.error('Error performing search:', error);
    }
}

/**
 * View wine details
 * @param {string} wineId - Wine ID
 */
function viewWineDetails(wineId) {
    try {
        const wines = JSON.parse(localStorage.getItem('savemywines_wines') || '[]');
        const wine = wines.find(w => w.id === wineId);
        
        if (wine) {
            showWineModal(wine, 'view');
        }
    } catch (error) {
        console.error('Error viewing wine details:', error);
    }
}

/**
 * Edit wine
 * @param {string} wineId - Wine ID
 */
function editWine(wineId) {
    try {
        const wines = JSON.parse(localStorage.getItem('savemywines_wines') || '[]');
        const wine = wines.find(w => w.id === wineId);
        
        if (wine) {
            showWineModal(wine, 'edit');
        }
    } catch (error) {
        console.error('Error editing wine:', error);
    }
}

/**
 * Delete wine
 * @param {string} wineId - Wine ID
 */
function deleteWine(wineId) {
    if (!confirm('Are you sure you want to delete this wine?')) {
        return;
    }
    
    try {
        const wines = JSON.parse(localStorage.getItem('savemywines_wines') || '[]');
        const updatedWines = wines.filter(w => w.id !== wineId);
        
        localStorage.setItem('savemywines_wines', JSON.stringify(updatedWines));
        
        // Reload wines
        loadWines();
        
        SaveMyWines.utils.showToast('Wine deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting wine:', error);
        SaveMyWines.utils.showToast('Error deleting wine', 'error');
    }
}

/**
 * Show wine modal for viewing or editing
 * @param {Object} wine - Wine object
 * @param {string} mode - 'view' or 'edit'
 */
function showWineModal(wine, mode) {
    // Create modal HTML
    const modal = document.createElement('div');
    modal.className = 'wine-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content card">
                <div class="modal-header">
                    <h3>${mode === 'view' ? 'Wine Details' : 'Edit Wine'}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="wine-detail-row">
                        <label>Name:</label>
                        <input type="text" class="input" value="${escapeHtml(wine.name)}" ${mode === 'view' ? 'readonly' : ''}>
                    </div>
                    <div class="wine-detail-row">
                        <label>Varietal:</label>
                        <select class="input" ${mode === 'view' ? 'disabled' : ''}>
                            <option value="cabernet-sauvignon" ${wine.varietal === 'cabernet-sauvignon' ? 'selected' : ''}>Cabernet Sauvignon</option>
                            <option value="merlot" ${wine.varietal === 'merlot' ? 'selected' : ''}>Merlot</option>
                            <option value="pinot-noir" ${wine.varietal === 'pinot-noir' ? 'selected' : ''}>Pinot Noir</option>
                            <option value="chardonnay" ${wine.vine.varietal === 'chardonnay' ? 'selected' : ''}>Chardonnay</option>
                            <option value="sauvignon-blanc" ${wine.varietal === 'sauvignon-blanc' ? 'selected' : ''}>Sauvignon Blanc</option>
                        </select>
                    </div>
                    <div class="wine-detail-row">
                        <label>Region:</label>
                        <input type="text" class="input" value="${escapeHtml(wine.region)}" ${mode === 'view' ? 'readonly' : ''}>
                    </div>
                    <div class="wine-detail-row">
                        <label>Year:</label>
                        <input type="number" class="input" value="${wine.year}" ${mode === 'view' ? 'readonly' : ''}>
                    </div>
                    <div class="wine-detail-row">
                        <label>Added:</label>
                        <span>${SaveMyWines.utils.formatDate(wine.addedDate)}</span>
                    </div>
                </div>
                <div class="modal-footer">
                    ${mode === 'edit' ? `
                        <button class="button save-wine-btn">Save Changes</button>
                        <button class="button button-secondary cancel-edit-btn">Cancel</button>
                    ` : `
                        <button class="button button-secondary close-modal-btn">Close</button>
                    `}
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.appendChild(modal);
    
    // Add event listeners
    const closeBtn = modal.querySelector('.modal-close');
    const closeModalBtn = modal.querySelector('.close-modal-btn');
    const cancelBtn = modal.querySelector('.cancel-edit-btn');
    const saveBtn = modal.querySelector('.save-wine-btn');
    
    if (closeBtn) closeBtn.addEventListener('click', () => modal.remove());
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => modal.remove());
    if (cancelBtn) cancelBtn.addEventListener('click', () => modal.remove());
    
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            saveWineChanges(wine.id, modal);
        });
    }
    
    // Close modal on overlay click
    const overlay = modal.querySelector('.modal-overlay');
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            modal.remove();
        }
    });
}

/**
 * Save wine changes
 * @param {string} wineId - Wine ID
 * @param {HTMLElement} modal - Modal element
 */
function saveWineChanges(wineId, modal) {
    try {
        const wines = JSON.parse(localStorage.getItem('savemywines_wines') || '[]');
        const wineIndex = wines.findIndex(w => w.id === wineId);
        
        if (wineIndex === -1) {
            SaveMyWines.utils.showToast('Wine not found', 'error');
            return;
        }
        
        // Get updated values
        const inputs = modal.querySelectorAll('input, select');
        const updatedWine = { ...wines[wineIndex] };
        
        inputs.forEach(input => {
            if (input.type === 'number') {
                updatedWine[input.previousElementSibling.textContent.toLowerCase().replace(':', '')] = parseInt(input.value);
            } else {
                updatedWine[input.previousElementSibling.textContent.toLowerCase().replace(':', '')] = input.value;
            }
        });
        
        // Update wine
        wines[wineIndex] = updatedWine;
        localStorage.setItem('savemywines_wines', JSON.stringify(wines));
        
        // Close modal and reload
        modal.remove();
        loadWines();
        
        SaveMyWines.utils.showToast('Wine updated successfully', 'success');
    } catch (error) {
        console.error('Error saving wine changes:', error);
        SaveMyWines.utils.showToast('Error updating wine', 'error');
    }
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add modal styles to the page
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .wine-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
    }
    
    .modal-overlay {
        background: rgba(0, 0, 0, 0.5);
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }
    
    .modal-content {
        max-width: 500px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: var(--color-text);
    }
    
    .wine-detail-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        gap: 15px;
    }
    
    .wine-detail-row label {
        font-weight: 500;
        min-width: 80px;
    }
    
    .wine-detail-row input,
    .wine-detail-row select {
        flex: 1;
    }
    
    .modal-footer {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 20px;
    }
`;

document.head.appendChild(modalStyles);
