/**
 * Network utility functions for the application
 */

/**
 * Checks if the device has internet connectivity by attempting to fetch a resource
 * @returns Promise<boolean> - True if network is available, false otherwise
 */
export const checkNetworkConnectivity = async (): Promise<boolean> => {
  try {
    // Try to fetch a small resource from a reliable service
    // We use a timeout to prevent hanging for too long
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('https://www.google.com', {
      method: 'HEAD',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('Network connectivity check failed:', error);
    return false;
  }
};

/**
 * Tests the Supabase connection specifically
 * @returns Promise<boolean> - True if Supabase is reachable, false otherwise
 */
export const testSupabaseConnectivity = async (supabaseUrl: string): Promise<boolean> => {
  try {
    // Try to fetch the Supabase health check endpoint
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${supabaseUrl}/healthz`, {
      method: 'HEAD',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('Supabase connectivity check failed:', error);
    return false;
  }
}; 