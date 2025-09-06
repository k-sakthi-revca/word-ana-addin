import CryptoJS from 'crypto-js';

/**
 * Enhanced Security Manager for password encryption and validation
 */
export class SecurityManager {
  static ENCRYPTION_KEY = 'neNBi@HxBSF5qQuFz4NP8kHpU*WZbpbm*pVMyAGpyVd8P@3qp5J8q6xZAxmE2i!MJo26KrD4tCtCCH2evDLcw8DCWQ8sfoQ4SF&u8ToW#hNv5FuRX8Lu8t9Tyv782BFs';

  /**
   * Get properly formatted encryption key (matching ana_devops implementation)
   */
  static getKey() {
    // Take first 32 chars and pad with zeros
    const keyStr = this.ENCRYPTION_KEY.slice(0, 32).padEnd(32, '0');
    // Convert to UTF-8 bytes
    return CryptoJS.enc.Utf8.parse(keyStr);
  }

  /**
   * Encrypt password using AES-256-CBC (matching ana_devops implementation)
   */
  static encryptPassword(password) {
    try {
      // Generate random 16-byte IV
      const iv = CryptoJS.lib.WordArray.random(16);

      // Get properly formatted key
      const key = this.getKey();

      // Encrypt with AES-256-CBC
      const encrypted = CryptoJS.AES.encrypt(password, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      // Combine IV and ciphertext and encode as base64
      const combined = CryptoJS.lib.WordArray.create([
        ...iv.words,
        ...encrypted.ciphertext.words
      ]);

      return CryptoJS.enc.Base64.stringify(combined);
    } catch (error) {
      console.error('Password encryption failed:', error);
      throw new Error('Failed to encrypt password');
    }
  }

  /**
   * Hash password using SHA256 for client-side validation
   */
  static hashPassword(password) {
    return CryptoJS.SHA256(password).toString();
  }

  /**
   * Generate secure random token
   */
  static generateSecureToken(length = 32) {
    return CryptoJS.lib.WordArray.random(length).toString();
  }
}

/**
 * CSRF Token Manager for request protection
 */
export class CSRFManager {
  static CSRF_TOKEN_KEY = 'ana_csrf_token';

  static generateToken() {
    const token = CryptoJS.lib.WordArray.random(32).toString();
    sessionStorage.setItem(this.CSRF_TOKEN_KEY, token);
    return token;
  }

  static getToken() {
    return sessionStorage.getItem(this.CSRF_TOKEN_KEY);
  }

  static validateToken(token) {
    const storedToken = this.getToken();
    return storedToken === token;
  }

  static clearToken() {
    sessionStorage.removeItem(this.CSRF_TOKEN_KEY);
  }
}

/**
 * Token Manager for secure token storage and validation
 */
export class TokenManager {
  static TOKEN_PREFIX = 'ana_secure_';

  static storeResetToken(token, expiresAt) {
    const tokenData = {
      token,
      expiresAt,
      timestamp: Date.now()
    };
    sessionStorage.setItem(`${this.TOKEN_PREFIX}reset_token`, JSON.stringify(tokenData));
  }

  static getResetToken() {
    const stored = sessionStorage.getItem(`${this.TOKEN_PREFIX}reset_token`);
    if (!stored) return null;

    try {
      const tokenData = JSON.parse(stored);
      if (Date.now() > new Date(tokenData.expiresAt).getTime()) {
        this.clearResetToken();
        return null;
      }
      return tokenData.token;
    } catch (error) {
      console.error('Token parsing error:', error);
      this.clearResetToken();
      return null;
    }
  }

  static clearResetToken() {
    sessionStorage.removeItem(`${this.TOKEN_PREFIX}reset_token`);
  }

  static isResetTokenValid() {
    return this.getResetToken() !== null;
  }
}

/**
 * Input Sanitizer for XSS protection
 */
export class InputSanitizer {
  static sanitizeEmail(email) {
    return email
      .trim()
      .toLowerCase()
      .replace(/[<>"'&]/g, ''); // Remove potential XSS characters
  }

  static escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  static validateInput(input, type) {
    const patterns = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    };

    return patterns[type] ? patterns[type].test(input) : false;
  }
}
