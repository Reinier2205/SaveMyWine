// Production Configuration for SaveMyWines
// This file contains the production URLs for all Edge Functions

export const CONFIG = {
    // Supabase Project Configuration
    SUPABASE_URL: "https://ssgraiwyiknqtlhjxvpc.supabase.co",
    SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzZ3JhaXd5aWtucXRsaGp4dnBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MDI0OTAsImV4cCI6MjA3MDk3ODQ5MH0.wWXk9DHID9WocuIoKHoHk3KFaJa5IbyCti3UPgjR3ik",
    
    // Edge Function URLs (Production)
    EDGE_SCAN_URL: "https://ssgraiwyiknqtlhjxvpc.supabase.co/functions/v1/scan_wine",
    EDGE_ADD_URL: "https://ssgraiwyiknqtlhjxvpc.supabase.co/functions/v1/add_wine",
    EDGE_LIST_URL: "https://ssgraiwyiknqtlhjxvpc.supabase.co/functions/v1/list_wines",
    
    // App Configuration
    APP_NAME: "SaveMyWines",
    APP_VERSION: "1.0.0",
    ENVIRONMENT: "production"
};

// Utility function to check if Edge Functions are accessible
export async function checkEdgeFunctions() {
    const functions = [
        { name: 'scan_wine', url: CONFIG.EDGE_SCAN_URL },
        { name: 'add_wine', url: CONFIG.EDGE_ADD_URL },
        { name: 'list_wines', url: CONFIG.EDGE_LIST_URL }
    ];
    
    const results = await Promise.allSettled(
        functions.map(async (func) => {
            try {
                const response = await fetch(func.url, { method: 'OPTIONS' });
                return { name: func.name, status: response.status, ok: response.ok };
            } catch (error) {
                return { name: func.name, error: error.message };
            }
        })
    );
    
    return results.map((result, index) => ({
        ...result.value,
        name: functions[index].name
    }));
}

// Export default config
export default CONFIG;
