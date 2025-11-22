/**
 * Secure Token Manager Service
 * Handles storage and retrieval of authentication tokens
 * Uses localStorage for reliable persistence in Replit
 */

const TOKEN_KEY = 'access_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';

// Memory storage for access token (faster access)
let memoryAccessToken = null;
let tokenExpiryTime = null;

class TokenManager {
  /**
   * Store access token with expiry time
   * @param {string} token - Access token
   * @param {number} expiresIn - Token expiry in seconds (default: 900 = 15 min)
   */
  static setAccessToken(token, expiresIn = 900) {
    if (!token || typeof token !== 'string') {
      return;
    }

    memoryAccessToken = token;
    tokenExpiryTime = Date.now() + expiresIn * 1000;
    
    // Also persist to localStorage for page refreshes
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(TOKEN_EXPIRY_KEY, String(tokenExpiryTime));
    } catch (e) {
      console.warn('localStorage unavailable:', e);
    }
    
    console.log('Token stored, expires in:', expiresIn, 'seconds');
  }

  /**
   * Get access token from memory or localStorage
   * @returns {string|null} Access token or null if expired/missing
   */
  static getAccessToken() {
    // Check memory first (fastest)
    if (memoryAccessToken && this.isTokenValid()) {
      return memoryAccessToken;
    }

    // Fall back to localStorage
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const expiryStr = localStorage.getItem(TOKEN_EXPIRY_KEY);
      
      if (token && expiryStr) {
        const expiryTime = parseInt(expiryStr, 10);
        if (!isNaN(expiryTime) && Date.now() < expiryTime) {
          memoryAccessToken = token;
          tokenExpiryTime = expiryTime;
          return token;
        }
      }
    } catch (e) {
      console.warn('Error retrieving token:', e);
    }

    // Token expired or missing
    this.clearTokens();
    return null;
  }

  /**
   * Check if token is valid (not expired)
   * @returns {boolean}
   */
  static isTokenValid() {
    if (!tokenExpiryTime) {
      try {
        const storedExpiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
        if (storedExpiry) {
          tokenExpiryTime = parseInt(storedExpiry, 10);
        }
      } catch (e) {
        // localStorage unavailable
      }
    }
    return tokenExpiryTime && !isNaN(tokenExpiryTime) && Date.now() < tokenExpiryTime;
  }

  /**
   * Clear all tokens (logout)
   */
  static clearTokens() {
    memoryAccessToken = null;
    tokenExpiryTime = null;
    
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
    } catch (e) {
      console.warn('Error clearing tokens:', e);
    }
    
    // Also clear CSRF token
    try {
      const CSRFProtection = require('../utils/csrfProtection').default;
      CSRFProtection.clearToken();
    } catch (err) {
      // CSRFProtection may not be loaded yet
    }
  }

  /**
   * Get time until token expiry
   * @returns {number} Milliseconds until expiry
   */
  static getTimeUntilExpiry() {
    if (!tokenExpiryTime) return 0;
    return Math.max(0, tokenExpiryTime - Date.now());
  }

  /**
   * Check if token needs refresh (expires in less than 2 minutes)
   * @returns {boolean}
   */
  static shouldRefreshToken() {
    return this.getTimeUntilExpiry() < 2 * 60 * 1000;
  }

  /**
   * Decode JWT token (basic decode without verification)
   * @param {string} token - JWT token
   * @returns {object|null} Decoded payload or null if invalid
   */
  static decodeToken(token) {
    try {
      if (!token) return null;
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const decoded = JSON.parse(atob(parts[1]));
      return decoded;
    } catch (err) {
      return null;
    }
  }

  /**
   * Get user info from token
   * @returns {object|null} User info { userId, email, role, etc }
   */
  static getUserFromToken() {
    const token = this.getAccessToken();
    if (!token) return null;
    
    const decoded = this.decodeToken(token);
    return decoded || null;
  }

  /**
   * Store refresh token ID (not used in this implementation as backend uses httpOnly cookies)
   */
  static setRefreshTokenId(refreshTokenId) {
    // Backend handles refresh tokens via httpOnly cookies
  }

  /**
   * Get refresh token ID
   */
  static getRefreshTokenId() {
    return null;
  }
}

export default TokenManager;
