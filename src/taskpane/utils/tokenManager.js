/**
 * Token Manager for storing authentication tokens in runtime memory
 * This approach avoids storing sensitive tokens in localStorage
 */
class TokenManager {
  constructor() {
    this.tokens = {
      accessToken: null,
      refreshToken: null,
    };
    this.userData = null;
  }

  /**
   * Set access token
   * @param {string} token - The access token
   */
  setAccessToken(token) {
    this.tokens.accessToken = token;
  }

  /**
   * Get access token
   * @returns {string|null} - The access token or null
   */
  getAccessToken() {
    return this.tokens.accessToken;
  }

  /**
   * Set refresh token
   * @param {string} token - The refresh token
   */
  setRefreshToken(token) {
    this.tokens.refreshToken = token;
  }

  /**
   * Get refresh token
   * @returns {string|null} - The refresh token or null
   */
  getRefreshToken() {
    return this.tokens.refreshToken;
  }

  /**
   * Set user data
   * @param {Object} data - User data
   */
  setUserData(data) {
    this.userData = data;
  }

  /**
   * Get user data
   * @returns {Object|null} - User data or null
   */
  getUserData() {
    return this.userData;
  }

  /**
   * Clear all tokens and user data
   */
  clearAll() {
    this.tokens = {
      accessToken: null,
      refreshToken: null,
    };
    this.userData = null;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if authenticated
   */
  isAuthenticated() {
    return !!this.tokens.accessToken;
  }
}

// Create a singleton instance
const tokenManager = new TokenManager();

export default tokenManager;
