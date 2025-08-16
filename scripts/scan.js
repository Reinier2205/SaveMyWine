// Scan functionality for SaveMyWines
// Handles camera access and wine label scanning

document.addEventListener('DOMContentLoaded', function() {
    console.log('Scan page loaded');
    
    initializeScanPage();
});

/**
 * Initialize the scan page functionality
 */
function initializeScanPage() {
    const scanButton = document.querySelector('.scan-button');
    const wineForm = document.querySelector('.wine-form');
    
    if (scanButton) {
        scanButton.addEventListener('click', handleScanClick);
    }
    
    if (wineForm) {
        wineForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Check if camera is available
    checkCameraAvailability();
}

/**
 * Check if camera access is available on this device
 */
function checkCameraAvailability() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log('Camera not available on this device');
        const scanButton = document.querySelector('.scan-button');
        if (scanButton) {
            scanButton.textContent = 'Camera Not Available';
            scanButton.disabled = true;
            scanButton.style.opacity = '0.5';
        }
        return false;
    }
    return true;
}

/**
 * Handle scan button click
 */
function handleScanClick() {
    if (!checkCameraAvailability()) {
        SaveMyWines.utils.showToast('Camera not available on this device', 'error');
        return;
    }
    
    const scanButton = document.querySelector('.scan-button');
    const cameraPlaceholder = document.querySelector('.camera-placeholder');
    
    if (scanButton.textContent === 'Start Camera') {
        startCamera();
        scanButton.textContent = 'Stop Camera';
        scanButton.classList.add('scanning');
    } else {
        stopCamera();
        scanButton.textContent = 'Start Camera';
        scanButton.classList.remove('scanning');
    }
}

/**
 * Start the camera for scanning
 */
function startCamera() {
    const constraints = {
        video: {
            facingMode: 'environment', // Use back camera on mobile
            width: { ideal: 1280 },
            height: { ideal: 720 }
        }
    };
    
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
            const cameraPlaceholder = document.querySelector('.camera-placeholder');
            const video = document.createElement('video');
            video.srcObject = stream;
            video.autoplay = true;
            video.playsInline = true;
            video.style.cssText = `
                width: 100%;
                height: 300px;
                border-radius: var(--radius-card);
                object-fit: cover;
            `;
            
            // Clear placeholder and add video
            cameraPlaceholder.innerHTML = '';
            cameraPlaceholder.appendChild(video);
            
            // Store stream for later cleanup
            window.currentStream = stream;
            
            // Start scanning for wine labels
            startLabelDetection(video);
        })
        .catch(function(error) {
            console.error('Error accessing camera:', error);
            SaveMyWines.utils.showToast('Unable to access camera', 'error');
        });
}

/**
 * Stop the camera
 */
function stopCamera() {
    if (window.currentStream) {
        window.currentStream.getTracks().forEach(track => track.stop());
        window.currentStream = null;
    }
    
    // Restore placeholder
    const cameraPlaceholder = document.querySelector('.camera-placeholder');
    cameraPlaceholder.innerHTML = `
        <div class="camera-icon">📷</div>
        <p>Camera will activate here</p>
    `;
}

/**
 * Start detecting wine labels in the video stream
 * This is a simplified implementation - in a real app, you'd use ML/AI
 */
function startLabelDetection(video) {
    // Simulate label detection
    // In a real implementation, you'd use TensorFlow.js or similar
    setTimeout(() => {
        // Simulate finding a wine label
        if (Math.random() > 0.7) {
            simulateLabelDetection();
        }
    }, 3000);
}

/**
 * Simulate wine label detection
 */
function simulateLabelDetection() {
    SaveMyWines.utils.showToast('Wine label detected!', 'success');
    
    // Populate form with detected data (simulated)
    const wineNameInput = document.getElementById('wine-name');
    const varietalSelect = document.getElementById('wine-varietal');
    const regionInput = document.getElementById('wine-region');
    const yearInput = document.getElementById('wine-year');
    
    if (wineNameInput) wineNameInput.value = 'Detected Wine Label';
    if (varietalSelect) varietalSelect.value = 'cabernet-sauvignon';
    if (regionInput) regionInput.value = 'Bordeaux, France';
    if (yearInput) yearInput.value = '2020';
    
    // Scroll to form
    const manualEntry = document.querySelector('.manual-entry');
    if (manualEntry) {
        manualEntry.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Handle manual form submission
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const wineData = {
        name: formData.get('wine-name') || document.getElementById('wine-name').value,
        varietal: formData.get('wine-varietal') || document.getElementById('wine-varietal').value,
        region: formData.get('wine-region') || document.getElementById('wine-region').value,
        year: formData.get('wine-year') || document.getElementById('wine-year').value,
        addedDate: new Date().toISOString()
    };
    
    // Validate required fields
    if (!wineData.name || !wineData.varietal || !wineData.region || !wineData.year) {
        SaveMyWines.utils.showToast('Please fill in all required fields', 'error');
        return;
    }
    
    // Save wine to storage
    saveWine(wineData);
    
    // Show success message
    SaveMyWines.utils.showToast('Wine added successfully!', 'success');
    
    // Reset form
    event.target.reset();
    
    // Redirect to wines page after a short delay
    setTimeout(() => {
        window.location.href = 'wines.html';
    }, 1500);
}

/**
 * Save wine data to local storage
 */
function saveWine(wineData) {
    try {
        // Get existing wines
        const existingWines = JSON.parse(localStorage.getItem('savemywines_wines') || '[]');
        
        // Add new wine with unique ID
        const newWine = {
            id: Date.now().toString(),
            ...wineData
        };
        
        existingWines.push(newWine);
        
        // Save back to localStorage
        localStorage.setItem('savemywines_wines', JSON.stringify(existingWines));
        
        console.log('Wine saved:', newWine);
    } catch (error) {
        console.error('Error saving wine:', error);
        SaveMyWines.utils.showToast('Error saving wine data', 'error');
    }
}

/**
 * Handle page visibility change (pause camera when tab is hidden)
 */
document.addEventListener('visibilitychange', function() {
    if (document.hidden && window.currentStream) {
        stopCamera();
        const scanButton = document.querySelector('.scan-button');
        if (scanButton) {
            scanButton.textContent = 'Start Camera';
            scanButton.classList.remove('scanning');
        }
    }
});

/**
 * Handle page unload (cleanup camera)
 */
window.addEventListener('beforeunload', function() {
    if (window.currentStream) {
        stopCamera();
    }
});
