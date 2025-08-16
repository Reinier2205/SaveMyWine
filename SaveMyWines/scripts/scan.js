// Scan functionality for SaveMyWines
// Handles camera access and wine label scanning

document.addEventListener('DOMContentLoaded', function() {
    console.log('Scan page loaded');
    initializeScanPage();
});

function initializeScanPage() {
    const scanButton = document.querySelector('.scan-button');
    const wineForm = document.querySelector('.wine-form');
    
    if (scanButton) {
        scanButton.addEventListener('click', handleScanClick);
    }
    
    if (wineForm) {
        wineForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Check camera availability on page load
    checkCameraAvailability();
}

function checkCameraAvailability() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log('Camera not supported in this browser');
        const scanButton = document.querySelector('.scan-button');
        if (scanButton) {
            scanButton.textContent = 'Camera Not Supported';
            scanButton.disabled = true;
        }
        return false;
    }
    return true;
}

function handleScanClick() {
    const scanButton = document.querySelector('.scan-button');
    const cameraPlaceholder = document.querySelector('.camera-placeholder');
    
    if (scanButton.textContent === 'Start Camera') {
        startCamera();
        scanButton.textContent = 'Stop Camera';
    } else {
        stopCamera();
        scanButton.textContent = 'Start Camera';
    }
}

let videoStream = null;

function startCamera() {
    if (!checkCameraAvailability()) return;
    
    const cameraPlaceholder = document.querySelector('.camera-placeholder');
    
    navigator.mediaDevices.getUserMedia({ 
        video: { 
            facingMode: 'environment', // Use back camera on mobile
            width: { ideal: 1280 },
            height: { ideal: 720 }
        } 
    })
    .then(stream => {
        videoStream = stream;
        
        // Create video element
        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.playsInline = true;
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.borderRadius = '8px';
        
        // Clear placeholder and add video
        cameraPlaceholder.innerHTML = '';
        cameraPlaceholder.appendChild(video);
        
        // Start label detection
        startLabelDetection(video);
    })
    .catch(error => {
        console.error('Error accessing camera:', error);
        if (window.SaveMyWines && window.SaveMyWines.utils) {
            window.SaveMyWines.utils.showToast('Camera access denied. Please check permissions.', 'error');
        }
    });
}

function stopCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
        
        // Reset camera placeholder
        const cameraPlaceholder = document.querySelector('.camera-placeholder');
        cameraPlaceholder.innerHTML = `
            <div class="camera-icon">📷</div>
            <p>Camera will activate here</p>
        `;
    }
}

function startLabelDetection(video) {
    // Simulate label detection (in a real app, this would use ML/AI)
    setTimeout(() => {
        simulateLabelDetection();
    }, 3000);
}

function simulateLabelDetection() {
    // Simulate successful wine label detection
    if (window.SaveMyWines && window.SaveMyWines.utils) {
        window.SaveMyWines.utils.showToast('Wine label detected! Processing...', 'success');
    }
    
    // Simulate processing time
    setTimeout(() => {
        if (window.SaveMyWines && window.SaveMyWines.utils) {
            window.SaveMyWines.utils.showToast('Wine added to collection!', 'success');
        }
        
        // Stop camera after successful detection
        stopCamera();
        const scanButton = document.querySelector('.scan-button');
        if (scanButton) {
            scanButton.textContent = 'Start Camera';
        }
    }, 2000);
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const wineData = {
        id: generateId(),
        name: formData.get('wine-name') || document.getElementById('wine-name').value,
        varietal: formData.get('wine-varietal') || document.getElementById('wine-varietal').value,
        region: formData.get('wine-region') || document.getElementById('wine-region').value,
        vintage: formData.get('wine-year') || document.getElementById('wine-year').value,
        dateAdded: new Date().toISOString()
    };
    
    // Validate required fields
    if (!wineData.name || !wineData.varietal || !wineData.region || !wineData.vintage) {
        if (window.SaveMyWines && window.SaveMyWines.utils) {
            window.SaveMyWines.utils.showToast('Please fill in all required fields.', 'error');
        }
        return;
    }
    
    // Save wine to storage
    saveWine(wineData);
    
    // Show success message
    if (window.SaveMyWines && window.SaveMyWines.utils) {
        window.SaveMyWines.utils.showToast('Wine added successfully!', 'success');
    }
    
    // Reset form
    event.target.reset();
}

function saveWine(wineData) {
    try {
        // Get existing wines from localStorage
        const existingWines = JSON.parse(localStorage.getItem('savemywines_wines') || '[]');
        
        // Add new wine
        existingWines.push(wineData);
        
        // Save back to localStorage
        localStorage.setItem('savemywines_wines', JSON.stringify(existingWines));
        
        console.log('Wine saved:', wineData);
    } catch (error) {
        console.error('Error saving wine:', error);
        if (window.SaveMyWines && window.SaveMyWines.utils) {
            window.SaveMyWines.utils.showToast('Error saving wine. Please try again.', 'error');
        }
    }
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
