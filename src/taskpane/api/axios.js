import axios from 'axios';
import tokenManager from '../utils/tokenManager';
import authStateManager from '../utils/authStateManager';

// Use environment variables with fallback values
const MONITOR_API_ENDPOINT = 'https://monitor.openana.ai';
const MIDDLEWARE_API_ENDPOINT = 'https://middleware.openana.ai';
const LOCAL_PROXY_ENDPOINT = 'https://localhost:3000';

// Create axios instance for the monitor API
const monitorApi = axios.create({
  baseURL: LOCAL_PROXY_ENDPOINT, // Use our local proxy server
});

// Monitor API interceptor using runtime token manager
monitorApi.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling 401 errors
monitorApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If the error is not 401 or it's a retry, reject
    if (!error.response || error.response.status !== 401 || error.config._retry) {
      return Promise.reject(error);
    }

    // Mark as retry to prevent infinite loops
    error.config._retry = true;

    // Handle unauthorized error (e.g., token expired)
    // In a real implementation, you would refresh the token here
    // For now, we'll just log out the user
    tokenManager.clearAll();
    localStorage.removeItem('anaUserAuthenticated');
    localStorage.removeItem('anaUserEmail');
    
    // Broadcast logout to all tabs
    authStateManager.broadcastAuthState(false);
    
    // Reload the page to redirect to login
    window.location.reload();

    return Promise.reject(error);
  }
);

export { monitorApi };
