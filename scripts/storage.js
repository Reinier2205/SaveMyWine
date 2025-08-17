// Storage functionality for SaveMyWines
// Handles wine data persistence and retrieval

import { CONFIG } from "./api.js";
import { yearsAndMonthsSince } from "./utils.js";

// Save wine from form data
window.saveWineFromForm = async (w) => {
  try {
    const device_id = localStorage.device_id;
    
    if (!device_id) {
      alert("Device ID not found. Please refresh the page.");
      return;
    }

    // Show loading state
    const saveBtn = document.getElementById('saveWine');
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';
    }

    // Send to add_wine Edge Function with proper authentication
    const res = await fetch(CONFIG.EDGE_ADD_URL, {
      method: "POST", 
      headers: { 
        "Content-Type": "application/json",
        'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
        'apikey': CONFIG.SUPABASE_ANON_KEY
      },
      body: JSON.stringify({ device_id, ...w })
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Authentication failed. Please check your Supabase configuration.');
      } else if (res.status === 403) {
        throw new Error('Access denied. You may not have permission to use this feature.');
      } else if (res.status === 500) {
        throw new Error('Server error. The service is temporarily unavailable.');
      } else {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
    }

    const json = await res.json();
    if (!json.ok) {
      throw new Error(json.error || 'Save failed');
    }

    // Success - redirect to wines list
    alert("Wine saved successfully!");
    location.href = "/wines.html";

  } catch (error) {
    console.error('Save wine error:', error);
    alert(`Save failed: ${error.message}`);
    
    // Reset button state
    const saveBtn = document.getElementById('saveWine');
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Wine to Collection';
    }
  }
};

// List wines for current device
export async function listWines() {
  try {
    const device_id = localStorage.device_id;
    
    if (!device_id) {
      console.error('Device ID not found');
      return [];
    }

    // Query list_wines Edge Function with proper authentication
    const url = `${CONFIG.EDGE_LIST_URL}?device_id=${encodeURIComponent(device_id)}`;
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
        'apikey': CONFIG.SUPABASE_ANON_KEY
      }
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Authentication failed. Please check your Supabase configuration.');
      } else if (res.status === 403) {
        throw new Error('Access denied. You may not have permission to use this feature.');
      } else if (res.status === 500) {
        throw new Error('Server error. The service is temporarily unavailable.');
      } else {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
    }

    const wines = await res.json();
    return Array.isArray(wines) ? wines : [];

  } catch (error) {
    console.error('List wines error:', error);
    return [];
  }
}

// Get wine by ID (for future use)
export async function getWineById(wineId) {
  try {
    const wines = await listWines();
    return wines.find(w => w.id === wineId) || null;
  } catch (error) {
    console.error('Get wine by ID error:', error);
    return null;
  }
}

// Delete wine (for future use)
export async function deleteWine(wineId) {
  try {
    const device_id = localStorage.device_id;
    
    if (!device_id) {
      throw new Error('Device ID not found');
    }

    // This would require a delete_wine Edge Function
    // For now, just return false
    console.log('Delete wine not implemented yet');
    return false;

  } catch (error) {
    console.error('Delete wine error:', error);
    return false;
  }
}

// Update wine (for future use)
export async function updateWine(wineId, updates) {
  try {
    const device_id = localStorage.device_id;
    
    if (!device_id) {
      throw new Error('Device ID not found');
    }

    // This would require an update_wine Edge Function
    // For now, just return false
    console.log('Update wine not implemented yet');
    return false;

  } catch (error) {
    console.error('Update wine error:', error);
    return false;
  }
}

console.log('Storage functionality loaded');
