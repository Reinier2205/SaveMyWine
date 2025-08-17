// Scan functionality for SaveMyWines
// Handles wine label scanning and form display

import { CONFIG } from "./api.js";
import { calcBestDrinkDate } from "./utils.js";

// DOM elements
const fileEl = document.getElementById('labelFile');
const btn = document.getElementById('scanBtn');
const out = document.getElementById('scanResult');

// Initialize device_id on first load
if (!localStorage.device_id) {
    localStorage.device_id = crypto.randomUUID();
    console.log('Generated new device_id:', localStorage.device_id);
}

// Scan button click handler
btn.onclick = async () => {
    const file = fileEl.files?.[0];
    if (!file) {
        alert("Please select a label photo");
        return;
    }

    // Show loading state
    btn.disabled = true;
    btn.textContent = 'Scanning...';

    try {
        // Create form data
        const fd = new FormData();
        fd.append("file", file);
        fd.append("device_id", localStorage.device_id);

        // Send to Edge Function
        const res = await fetch(CONFIG.EDGE_SCAN_URL, { 
            method: "POST", 
            body: fd 
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        if (!data.ok) {
            throw new Error(data.error || 'Scan failed');
        }

        // Calculate dates
        const today = new Date();
        const datePurchased = today.toISOString().slice(0, 10);
        const bestDrink = calcBestDrinkDate(data.vintage, data.varietal);

        // Display result form
        out.hidden = false;
        out.innerHTML = `
            <div class="mb-6">
                <img src="${data.label_image_url}" alt="Wine Label" class="w-full rounded-xl mb-4" style="max-height: 300px; object-fit: contain;" />
            </div>
            
            <form class="space-y-4">
                <div>
                    <label class="block text-base font-bold font-sans text-main mb-2">Wine Name</label>
                    <input class="bg-input border border-input-border text-main placeholder-muted text-base w-full p-3 rounded-lg" 
                           id="w_name" value="${data.name || ''}" placeholder="Enter wine name">
                </div>
                
                <div>
                    <label class="block text-base font-bold font-sans text-main mb-2">Producer</label>
                    <input class="bg-input border border-input-border text-main placeholder-muted text-base w-full p-3 rounded-lg" 
                           id="w_prod" value="${data.producer || ''}" placeholder="Enter producer">
                </div>
                
                <div>
                    <label class="block text-base font-bold font-sans text-main mb-2">Varietal</label>
                    <input class="bg-input border border-input-border text-main placeholder-muted text-base w-full p-3 rounded-lg" 
                           id="w_var" value="${data.varietal || ''}" placeholder="Enter varietal">
                </div>
                
                <div>
                    <label class="block text-base font-bold font-sans text-main mb-2">Vintage</label>
                    <input class="bg-input border border-input-border text-main placeholder-muted text-base w-full p-3 rounded-lg" 
                           id="w_vin" type="number" value="${data.vintage || ''}" placeholder="Enter vintage year">
                </div>
                
                <div>
                    <label class="block text-base font-bold font-sans text-main mb-2">Date Purchased</label>
                    <input class="bg-input border border-input-border text-main placeholder-muted text-base w-full p-3 rounded-lg" 
                           id="w_date" type="date" value="${datePurchased}">
                </div>
                
                <div>
                    <label class="block text-base font-bold font-sans text-main mb-2">Best Drink Date</label>
                    <input class="bg-input border border-input-border text-main placeholder-muted text-base w-full p-3 rounded-lg" 
                           id="w_best" type="date" value="${bestDrink}" readonly>
                    <p class="body-sm text-muted mt-1">Auto-calculated based on varietal and vintage</p>
                </div>
                
                <div>
                    <label class="block text-base font-bold font-sans text-main mb-2">Notes</label>
                    <textarea class="bg-input border border-input-border text-main placeholder-muted text-base w-full p-3 rounded-lg" 
                              id="w_notes" rows="3" placeholder="Add tasting notes, memories, or other details"></textarea>
                </div>
                
                <button type="button" class="btn btn-primary w-full" id="saveWine">
                    Save Wine to Collection
                </button>
            </form>
        `;

        // Add save functionality
        document.getElementById('saveWine').onclick = () => {
            const wineData = {
                name: document.getElementById('w_name').value,
                producer: document.getElementById('w_prod').value,
                varietal: document.getElementById('w_var').value,
                vintage: Number(document.getElementById('w_vin').value) || null,
                date_purchased: document.getElementById('w_date').value,
                best_drink_date: document.getElementById('w_best').value,
                notes: document.getElementById('w_notes').value,
                label_image_url: data.label_image_url
            };

            // Call save function (to be implemented)
            if (window.saveWineFromForm) {
                window.saveWineFromForm(wineData);
            } else {
                console.log('Wine data ready to save:', wineData);
                alert('Wine data captured! Save functionality will be implemented in the next step.');
            }
        };

    } catch (error) {
        console.error('Scan error:', error);
        alert(`Scan failed: ${error.message}`);
    } finally {
        // Reset button state
        btn.disabled = false;
        btn.textContent = 'Scan Label';
    }
};

// File input change handler for better UX
fileEl.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        // Show selected file info
        const fileInfo = document.createElement('div');
        fileInfo.className = 'body-sm text-main mb-4 p-3 bg-chip rounded-lg';
        fileInfo.innerHTML = `
            <strong>Selected:</strong> ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)
        `;
        
        // Remove previous file info if exists
        const existingInfo = out.parentNode.querySelector('.file-info');
        if (existingInfo) existingInfo.remove();
        
        fileInfo.classList.add('file-info');
        out.parentNode.insertBefore(fileInfo, out);
        
        // Enable scan button
        btn.disabled = false;
    }
});

console.log('Scan functionality loaded. Device ID:', localStorage.device_id);
