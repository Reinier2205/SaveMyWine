// Test script for scan_wine Edge Function
// Run this after deploying the function to test it

const SUPABASE_URL = "https://ssgraiwyiknqtlhjxvpc.supabase.co";
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/scan_wine`;

async function testScanWine() {
    console.log("🧪 Testing scan_wine Edge Function...");
    console.log(`📍 Function URL: ${FUNCTION_URL}`);
    
    try {
        // Create a test image (1x1 pixel PNG)
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 1, 1);
        
        canvas.toBlob(async (blob) => {
            const file = new File([blob], 'test-wine-label.png', { type: 'image/png' });
            
            // Create form data
            const formData = new FormData();
            formData.append('file', file);
            formData.append('device_id', 'test-device-123');
            
            console.log("📤 Sending test request...");
            
            // Send request to function
            const response = await fetch(FUNCTION_URL, {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log("✅ Function response:", result);
                
                if (result.ok) {
                    console.log("🎉 Function is working correctly!");
                    console.log("📊 Extracted data:");
                    console.log(`   Name: ${result.name}`);
                    console.log(`   Producer: ${result.producer}`);
                    console.log(`   Varietal: ${result.varietal}`);
                    console.log(`   Vintage: ${result.vintage}`);
                    console.log(`   Image URL: ${result.label_image_url}`);
                } else {
                    console.log("⚠️ Function returned error:", result.error);
                }
            } else {
                console.log("❌ Function request failed:", response.status, response.statusText);
                const errorText = await response.text();
                console.log("Error details:", errorText);
            }
        });
        
    } catch (error) {
        console.error("❌ Test failed:", error);
    }
}

// Function to test with a real image file
async function testWithRealImage(imageFile) {
    console.log("🧪 Testing with real image:", imageFile.name);
    
    try {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('device_id', 'test-device-456');
        
        console.log("📤 Sending image to function...");
        
        const response = await fetch(FUNCTION_URL, {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log("✅ Function response:", result);
            
            if (result.ok) {
                console.log("🎉 Wine label scanned successfully!");
                console.log("📊 Extracted wine data:");
                console.log(`   Name: ${result.name}`);
                console.log(`   Producer: ${result.producer}`);
                console.log(`   Varietal: ${result.varietal}`);
                console.log(`   Vintage: ${result.vintage}`);
                console.log(`   Region: ${result.region}`);
                console.log(`   Image URL: ${result.label_image_url}`);
            } else {
                console.log("⚠️ Function error:", result.error);
            }
        } else {
            console.log("❌ Request failed:", response.status, response.statusText);
            const errorText = await response.text();
            console.log("Error details:", errorText);
        }
        
    } catch (error) {
        console.error("❌ Test failed:", error);
    }
}

// Export functions for use in browser console
window.testScanWine = testScanWine;
window.testWithRealImage = testWithRealImage;

console.log("🧪 scan_wine test functions loaded!");
console.log("Use testScanWine() to test with a dummy image");
console.log("Use testWithRealImage(imageFile) to test with a real wine label image");
