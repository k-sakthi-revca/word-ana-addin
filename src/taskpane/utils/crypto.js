/**
 * Simple encryption/decryption utilities for the Excel Add-in
 * Note: This is a simplified version for demo purposes
 * In a real app, you would use a proper encryption library like CryptoJS
 */

const secretKey = 'ana-excel-addin-secret-key'; // Use a more secure key in a real application

/**
 * Encrypt data using a simple algorithm
 * @param {Object} data - Data to encrypt
 * @returns {string} - Encrypted data as string
 */
export const encryptData = (data) => {
  try {
    // Convert data to JSON string
    const jsonString = JSON.stringify(data);
    
    // Convert to base64
    const base64 = btoa(jsonString);
    
    // Simple XOR encryption with the key
    let result = '';
    for (let i = 0; i < base64.length; i++) {
      const charCode = base64.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length);
      result += String.fromCharCode(charCode);
    }
    
    // Convert to base64 again for safe storage
    return btoa(result);
  } catch (error) {
    console.error('Encryption failed:', error);
    return null;
  }
};

/**
 * Decrypt data
 * @param {string} ciphertext - Encrypted data string
 * @returns {Object|null} - Decrypted data or null if decryption fails
 */
export const decryptData = (ciphertext) => {
  if (!ciphertext) return null;
  
  try {
    // Decode from base64
    const encryptedData = atob(ciphertext);
    
    // Reverse the XOR encryption
    let result = '';
    for (let i = 0; i < encryptedData.length; i++) {
      const charCode = encryptedData.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length);
      result += String.fromCharCode(charCode);
    }
    
    // Decode from base64 and parse JSON
    const jsonString = atob(result);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};
