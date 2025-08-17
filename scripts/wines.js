// Wines collection functionality for SaveMyWines
// Handles displaying, filtering, and managing wine collection

document.addEventListener('DOMContentLoaded', function() {
    console.log('Wines page loaded');
    initializeWinesPage();
});

function initializeWinesPage() {
    loadWines();
    initializeFilters();
    initializeSearch();
    initializeWineActions();
}

function loadWines() {
    try {
        const wines = JSON.parse(localStorage.getItem('savemywines_wines') || '[]');
        displayWines(wines);
    } catch (error) {
        console.error('Error loading wines:', error);
        displayWines([]);
    }
}

function displayWines(wines) {
    const winesGrid = document.querySelector('.wines-grid');
    const emptyState = document.querySelector('.empty-state');
    
    if (!winesGrid) return;
    
    if (wines.length === 0) {
        winesGrid.style.display = 'none';
        if (emptyState) {
            emptyState.style.display = 'block';
        }
        return;
    }
    
    winesGrid.style.display = 'grid';
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    // Clear existing wines
    winesGrid.innerHTML = '';
    
    // Add each wine
    wines.forEach(wine => {
        const wineCard = createWineCard(wine);
        winesGrid.appendChild(wineCard);
    });
}

function createWineCard(wine) {
    const card = document.createElement('div');
    card.className = 'card wine-card';
    card.dataset.wineId = wine.id;
    
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
                <span class="tag">${wine.vintage}</span>
            </div>
            <div class="wine-actions">
                <button class="button button-secondary view-details-btn">View Details</button>
                <button class="button button-secondary edit-wine-btn">Edit</button>
                <button class="button button-secondary delete-wine-btn">Delete</button>
            </div>
        </div>
    `;
    
    // Add event listeners
    const viewBtn = card.querySelector('.view-details-btn');
    const editBtn = card.querySelector('.edit-wine-btn');
    const deleteBtn = card.querySelector('.delete-wine-btn');
    
    viewBtn.addEventListener('click', () => viewWineDetails(wine.id));
    editBtn.addEventListener('click', () => editWine(wine.id));
    deleteBtn.addEventListener('click', () => deleteWine(wine.id));
    
    return card;
}

function getWineType(varietal) {
    const redVarietals = ['cabernet sauvignon', 'merlot', 'pinot noir', 'syrah', 'malbec'];
    const whiteVarietals = ['chardonnay', 'sauvignon blanc', 'riesling', 'pinot grigio'];
    
    const lowerVarietal = varietal.toLowerCase();
    if (redVarietals.includes(lowerVarietal)) return 'Red';
    if (whiteVarietals.includes(lowerVarietal)) return 'White';
    return 'Other';
}

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

function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        const debouncedSearch = window.SaveMyWines?.utils?.debounce || debounce;
        searchInput.addEventListener('input', debouncedSearch(performSearch, 300));
    }
}

function initializeWineActions() {
    // Event delegation for wine actions
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-details-btn')) {
            const wineId = e.target.closest('.wine-card').dataset.wineId;
            viewWineDetails(wineId);
        } else if (e.target.classList.contains('edit-wine-btn')) {
            const wineId = e.target.closest('.wine-card').dataset.wineId;
            editWine(wineId);
        } else if (e.target.classList.contains('delete-wine-btn')) {
            const wineId = e.target.closest('.wine-card').dataset.wineId;
            deleteWine(wineId);
        }
    });
}

function applyFilters() {
    const varietalFilter = document.getElementById('filter-varietal');
    const regionFilter = document.getElementById('filter-region');
    
    try {
        let wines = JSON.parse(localStorage.getItem('savemywines_wines') || '[]');
        
        if (varietalFilter && varietalFilter.value) {
            wines = wines.filter(wine => 
                wine.varietal.toLowerCase() === varietalFilter.value.toLowerCase()
            );
        }
        
        if (regionFilter && regionFilter.value) {
            wines = wines.filter(wine => 
                wine.region.toLowerCase().includes(regionFilter.value.toLowerCase())
            );
        }
        
        displayWines(wines);
    } catch (error) {
        console.error('Error applying filters:', error);
    }
}

function performSearch(event) {
    const query = event.target.value.toLowerCase().trim();
    
    if (!query) {
        loadWines();
        return;
    }
    
    try {
        const wines = JSON.parse(localStorage.getItem('savemywines_wines') || '[]');
        const filteredWines = wines.filter(wine => 
            wine.name.toLowerCase().includes(query) ||
            wine.varietal.toLowerCase().includes(query) ||
            wine.region.toLowerCase().includes(query) ||
            wine.vintage.toString().includes(query)
        );
        
        displayWines(filteredWines);
    } catch (error) {
        console.error('Error performing search:', error);
    }
}

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

function deleteWine(wineId) {
    if (confirm('Are you sure you want to delete this wine?')) {
        try {
            const wines = JSON.parse(localStorage.getItem('savemywines_wines') || '[]');
            const updatedWines = wines.filter(w => w.id !== wineId);
            
            localStorage.setItem('savemywines_wines', JSON.stringify(updatedWines));
            
            if (window.SaveMyWines && window.SaveMyWines.utils) {
                window.SaveMyWines.utils.showToast('Wine deleted successfully', 'success');
            }
            
            loadWines();
        } catch (error) {
            console.error('Error deleting wine:', error);
            if (window.SaveMyWines && window.SaveMyWines.utils) {
                window.SaveMyWines.utils.showToast('Error deleting wine', 'error');
            }
        }
    }
}

function showWineModal(wine, mode) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.cssText = `
        background: white;
        padding: 24px;
        border-radius: 16px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    if (mode === 'view') {
        modalContent.innerHTML = `
            <h2>${escapeHtml(wine.name)}</h2>
            <p><strong>Varietal:</strong> ${escapeHtml(wine.varietal)}</p>
            <p><strong>Region:</strong> ${escapeHtml(wine.region)}</p>
            <p><strong>Vintage:</strong> ${escapeHtml(wine.vintage)}</p>
            <p><strong>Date Added:</strong> ${new Date(wine.dateAdded).toLocaleDateString()}</p>
            <div style="margin-top: 20px;">
                <button class="button button-secondary" onclick="this.closest('.modal-overlay').remove()">Close</button>
            </div>
        `;
    } else {
        modalContent.innerHTML = `
            <h2>Edit Wine</h2>
            <form id="edit-wine-form">
                <div class="form-group">
                    <label for="edit-name">Wine Name</label>
                    <input type="text" id="edit-name" class="input" value="${escapeHtml(wine.name)}" required>
                </div>
                <div class="form-group">
                    <label for="edit-varietal">Varietal</label>
                    <select id="edit-varietal" class="input" required>
                        <option value="cabernet-sauvignon" ${wine.varietal === 'cabernet-sauvignon' ? 'selected' : ''}>Cabernet Sauvignon</option>
                        <option value="merlot" ${wine.varietal === 'merlot' ? 'selected' : ''}>Merlot</option>
                        <option value="pinot-noir" ${wine.varietal === 'pinot-noir' ? 'selected' : ''}>Pinot Noir</option>
                        <option value="chardonnay" ${wine.varietal === 'chardonnay' ? 'selected' : ''}>Chardonnay</option>
                        <option value="sauvignon-blanc" ${wine.varietal === 'sauvignon-blanc' ? 'selected' : ''}>Sauvignon Blanc</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="edit-region">Region</label>
                    <input type="text" id="edit-region" class="input" value="${escapeHtml(wine.region)}" required>
                </div>
                <div class="form-group">
                    <label for="edit-vintage">Vintage</label>
                    <input type="number" id="edit-vintage" class="input" value="${wine.vintage}" min="1900" max="2030" required>
                </div>
                <div style="margin-top: 20px; display: flex; gap: 12px;">
                    <button type="submit" class="button">Save Changes</button>
                    <button type="button" class="button button-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                </div>
            </form>
        `;
        
        // Add form submit handler
        const form = modalContent.querySelector('#edit-wine-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            saveWineChanges(wine.id, modal);
        });
    }
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function saveWineChanges(wineId, modal) {
    try {
        const name = document.getElementById('edit-name').value;
        const varietal = document.getElementById('edit-varietal').value;
        const region = document.getElementById('edit-region').value;
        const vintage = document.getElementById('edit-vintage').value;
        
        if (!name || !varietal || !region || !vintage) {
            if (window.SaveMyWines && window.SaveMyWines.utils) {
                window.SaveMyWines.utils.showToast('Please fill in all fields', 'error');
            }
            return;
        }
        
        const wines = JSON.parse(localStorage.getItem('savemywines_wines') || '[]');
        const wineIndex = wines.findIndex(w => w.id === wineId);
        
        if (wineIndex !== -1) {
            wines[wineIndex] = {
                ...wines[wineIndex],
                name,
                varietal,
                region,
                vintage
            };
            
            localStorage.setItem('savemywines_wines', JSON.stringify(wines));
            
            if (window.SaveMyWines && window.SaveMyWines.utils) {
                window.SaveMyWines.utils.showToast('Wine updated successfully', 'success');
            }
            
            modal.remove();
            loadWines();
        }
    } catch (error) {
        console.error('Error saving wine changes:', error);
        if (window.SaveMyWines && window.SaveMyWines.utils) {
            window.SaveMyWines.utils.showToast('Error updating wine', 'error');
        }
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Fallback debounce function if not available from utils
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
