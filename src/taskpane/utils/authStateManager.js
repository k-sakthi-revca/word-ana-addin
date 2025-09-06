/**
 * AuthStateManager - Manages authentication state across multiple tabs
 * Uses localStorage and the Storage event to synchronize auth state
 */

import tokenManager from './tokenManager';
import { decryptData } from './crypto';

const AUTH_STATE_KEY = 'anaUserAuthenticated';
const AUTH_STATE_CHANGE_EVENT = 'anaAuthStateChange';
const USER_DATA_KEY = 'anaUserData';

class AuthStateManager {
  constructor() {
    this.listeners = [];
    
    // Listen for storage events from other tabs
    window.addEventListener('storage', this.handleStorageChange);
    
    // Listen for custom events from this tab
    window.addEventListener(AUTH_STATE_CHANGE_EVENT, this.handleAuthEvent);
    
    // Initialize from localStorage on startup
    this.initializeFromStorage();
  }
  
  /**
   * Initialize auth state from localStorage
   */
  initializeFromStorage() {
    const isAuthenticated = localStorage.getItem(AUTH_STATE_KEY) === 'true';
    if (isAuthenticated) {
      // If authenticated according to localStorage, ensure tokenManager is updated
      const encryptedData = localStorage.getItem(USER_DATA_KEY);
      if (encryptedData) {
        try {
          const userData = decryptData(encryptedData);
          if (userData) {
            tokenManager.setUserData(userData);
          }
        } catch (error) {
          console.error('Error decrypting user data:', error);
        }
      }
    }
  }
  
  /**
   * Handle storage events from other tabs
   */
  handleStorageChange = (event) => {
    // Only react to changes in our auth state key
    if (event.key === AUTH_STATE_KEY) {
      const isAuthenticated = event.newValue === 'true';
      
      // Update local state based on the change
      if (isAuthenticated) {
        // Another tab logged in, get user data
        const encryptedData = localStorage.getItem(USER_DATA_KEY);
        if (encryptedData) {
          try {
            const userData = decryptData(encryptedData);
            if (userData) {
              tokenManager.setUserData(userData);
            }
          } catch (error) {
            console.error('Error decrypting user data:', error);
          }
        }
      } else {
        // Another tab logged out, clear local tokens
        tokenManager.clearAll();
      }
      
      // Notify all listeners
      this.notifyListeners(isAuthenticated);
    }
  };
  
  /**
   * Handle custom auth events from this tab
   */
  handleAuthEvent = (event) => {
    const { isAuthenticated } = event.detail;
    this.notifyListeners(isAuthenticated);
  };
  
  /**
   * Broadcast auth state change to all tabs
   * @param {boolean} isAuthenticated - New auth state
   */
  broadcastAuthState(isAuthenticated) {
    // Update localStorage (this will trigger storage events in other tabs)
    localStorage.setItem(AUTH_STATE_KEY, isAuthenticated.toString());
    
    // Dispatch custom event for this tab
    window.dispatchEvent(
      new CustomEvent(AUTH_STATE_CHANGE_EVENT, { 
        detail: { isAuthenticated } 
      })
    );
  }
  
  /**
   * Add a listener for auth state changes
   * @param {Function} listener - Callback function(isAuthenticated)
   * @returns {Function} - Function to remove the listener
   */
  addListener(listener) {
    this.listeners.push(listener);
    
    // Return function to remove this listener
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  /**
   * Notify all listeners of auth state change
   * @param {boolean} isAuthenticated - New auth state
   */
  notifyListeners(isAuthenticated) {
    this.listeners.forEach(listener => {
      try {
        listener(isAuthenticated);
      } catch (error) {
        console.error('Error in auth state listener:', error);
      }
    });
  }
  
  /**
   * Check if user is authenticated
   * @returns {boolean} - True if authenticated
   */
  isAuthenticated() {
    return localStorage.getItem(AUTH_STATE_KEY) === 'true';
  }
}

// Create a singleton instance
const authStateManager = new AuthStateManager();

export default authStateManager;
