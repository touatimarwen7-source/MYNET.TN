/**
 * Secure Token Manager Service
 * Handles storage and retrieval of authentication tokens
 * 
 * SECURITY RULES:
 * - Access tokens: Short-lived (15 min), stored in memory + sessionStorage
 * - Refresh tokens: Long-lived (7 days), stored securely via httpOnly cookies (backend)
 * - Never expose tokens in localStorage (vulnerable to XSS)
 * - Always validate token format before using
 */

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token_id';
const TOKEN_EXPIRY_KEY = 'token_expiry';

// Memory storage for access token (cleared on page refresh)
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
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(TOKEN_EXPIRY_KEY, tokenExpiryTime);
  }

  /**
   * Get access token from memory or session
   * @returns {string|null} Access token or null if expired/missing
   */
  static getAccessToken() {
    // Check memory first (fastest)
    if (memoryAccessToken && this.isTokenValid()) {
      return memoryAccessToken;
    }

    // Fall back to session storage
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (token && this.isTokenValid()) {
      memoryAccessToken = token;
      return token;
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
    if (!tokenExpiryTime && sessionStorage.getItem(TOKEN_EXPIRY_KEY)) {
      tokenExpiryTime = parseInt(sessionStorage.getItem(TOKEN_EXPIRY_KEY));
    }
    return tokenExpiryTime && Date.now() < tokenExpiryTime;
  }

  /**
   * Store refresh token ID (backend manages httpOnly cookie)
   * Frontend only stores the ID for reference
   * @param {string} refreshTokenId - Refresh token identifier
   */
  static setRefreshTokenId(refreshTokenId) {
    if (refreshTokenId) {
      sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshTokenId);
    }
  }

  /**
   * Get refresh token ID
   * @returns {string|null}
   */
  static getRefreshTokenId() {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }

  /**
   * Clear all tokens (logout)
   */
  static clearTokens() {
    memoryAccessToken = null;
    tokenExpiryTime = null;
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    
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
   * Verification happens on backend
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
}

export default TokenManager;
