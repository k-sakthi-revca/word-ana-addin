import tokenManager from '../utils/tokenManager';
import authStateManager from '../utils/authStateManager';
import { CSRFManager, SecurityManager, InputSanitizer } from '../utils/security';
import { encryptData, decryptData } from '../utils/crypto';
import axios from 'axios';

// API endpoints
const PROXY_API_ENDPOINT = 'https://localhost:5173';
// For local development, the API paths might be different
const LOGIN_API_BASE_URL = `${PROXY_API_ENDPOINT}/api`;

/**
 * Authentication Service for the Excel Add-in
 */
class AuthService {
  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Promise with login result
   */
  static async login(email, password) {
    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Sanitize email
      const sanitizedEmail = InputSanitizer.sanitizeEmail(email);
      
      // Encrypt password (if needed)
      const encryptedPassword = SecurityManager.encryptPassword(password);
      
      // Generate CSRF token
      const csrfToken = CSRFManager.getToken() || CSRFManager.generateToken();

      // Prepare form data
      const formData = new URLSearchParams();
      formData.append('username', sanitizedEmail);
      formData.append('password', encryptedPassword);

      // Call the login API using fetch directly (like the working frontend)
      const response = await fetch(`${LOGIN_API_BASE_URL}/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-CSRF-Token': csrfToken,
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Login failed');
      }

      console.log("data",data)

      if (data.access_token) {
        // Store tokens
        tokenManager.setAccessToken(data.access_token);
        
        // Store refresh token
        if (data.refresh_token) {
          tokenManager.setRefreshToken(data.refresh_token);
        }

        const userResponse = await axios.get(`${LOGIN_API_BASE_URL}/v1/auth/me`, {
          headers: {
            'Authorization': `Bearer ${data.access_token}`
          }
        });
        const userData = userResponse.data;
        
        // Store middleware tokens if needed
        // if (data.middleware_tokens) {
        //   localStorage.setItem('accessToken', data.middleware_tokens.accessToken);
        //   localStorage.setItem('refreshToken', data.middleware_tokens.refreshToken);
        // }
        
        // Use user data directly from the response
        tokenManager.setUserData(userData);
        
        // Store authentication state in localStorage and broadcast to other tabs
        localStorage.setItem('anaUserAuthenticated', 'true');
        localStorage.setItem('anaUserEmail', sanitizedEmail);
        
        // Store encrypted user data for persistence
        localStorage.setItem('anaUserData', encryptData(userData));
        
        // Broadcast authentication state to all tabs
        authStateManager.broadcastAuthState(true);
        
        // Set user_id cookie like the working frontend
        document.cookie = `user_id=${userData.user_id}; path=/; secure; samesite=strict`;
        
        return {
          success: true,
          user: userData
        };
      } else {
        throw new Error('Login failed: No access token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific error cases
      if (error.response) {
        if (error.response.status === 401) {
          throw new Error('Invalid email or password. Please try again.');
        } else if (error.response.status === 429) {
          throw new Error('Too many login attempts. Please wait a moment and try again.');
        } else if (error.response.status === 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(`Login failed: ${error.response.status} ${error.response.statusText}`);
        }
      } else if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      } else {
        throw error;
      }
    }
  }

  /**
   * Logout the current user
   */
  static async logout() {
    try {
      // Call the logout API
      await fetch(`${LOGIN_API_BASE_URL}/v2/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenManager.getAccessToken()}`
        },
        credentials: 'include' // Ensures cookies are sent
      });
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local data, even if API call fails
      this.handleLogoutClientSide();
    }
  }
  
  /**
   * Handle client-side logout cleanup
   */
  static handleLogoutClientSide() {
    // Clear tokens and user data
    tokenManager.clearAll();
    
    // Clear CSRF token
    CSRFManager.clearToken();
    
    // Clear localStorage
    localStorage.removeItem('anaUserAuthenticated');
    localStorage.removeItem('anaUserEmail');
    localStorage.removeItem('anaUserData');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Clear cookies
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // Broadcast logout to all tabs
    authStateManager.broadcastAuthState(false);
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if authenticated
   */
  static isAuthenticated() {
    return tokenManager.isAuthenticated() || authStateManager.isAuthenticated();
  }

  /**
   * Get current user data
   * @returns {Object|null} - User data or null
   */
  static getCurrentUser() {
    // First try to get from runtime memory
    const userData = tokenManager.getUserData();
    
    if (userData) {
      return userData;
    }
    
    // If not in memory, try to get from localStorage
    const encryptedData = localStorage.getItem('anaUserData');
    if (encryptedData) {
      const decryptedData = decryptData(encryptedData);
      if (decryptedData) {
        // Restore to runtime memory
        tokenManager.setUserData(decryptedData);
        return decryptedData;
      }
    }
    
    return null;
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} - True if valid
   */
  static validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  }
}

export default AuthService;
