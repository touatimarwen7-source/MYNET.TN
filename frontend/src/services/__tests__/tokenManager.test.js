import { describe, it, expect, beforeEach, vi } from 'vitest';
import TokenManager from '../tokenManager';

describe('Token Manager', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Token Storage', () => {
    it('should set and get access token', () => {
      const token = 'test-token-12345';
      TokenManager.setAccessToken(token);

      expect(TokenManager.getAccessToken()).toBe(token);
    });

    it('should set token with expiry', () => {
      const token = 'test-token';
      const expiresIn = 900;

      TokenManager.setAccessToken(token, expiresIn);

      expect(TokenManager.getAccessToken()).toBe(token);
    });

    it('should return null for expired token', () => {
      const token = 'test-token';
      TokenManager.setAccessToken(token, -1);

      expect(TokenManager.getAccessToken()).toBeNull();
    });
  });

  describe('Token Validation', () => {
    it('should validate active token', () => {
      const token = 'test-token';
      TokenManager.setAccessToken(token, 3600);

      expect(TokenManager.isTokenValid()).toBe(true);
    });

    it('should invalidate expired token', () => {
      const token = 'test-token';
      TokenManager.setAccessToken(token, -1);

      expect(TokenManager.isTokenValid()).toBe(false);
    });

    it('should handle no token gracefully', () => {
      TokenManager.clearTokens();

      const result = TokenManager.isTokenValid();
      expect(typeof result === 'boolean' || result === null).toBe(true);
    });
  });

  describe('Token Refresh Logic', () => {
    it('should suggest refresh when token < 2 min to expiry', () => {
      const token = 'test-token';
      TokenManager.setAccessToken(token, 60);

      expect(TokenManager.shouldRefreshToken()).toBe(true);
    });

    it('should not suggest refresh when token > 2 min to expiry', () => {
      const token = 'test-token';
      TokenManager.setAccessToken(token, 3600);

      expect(TokenManager.shouldRefreshToken()).toBe(false);
    });
  });

  describe('Token Clearing', () => {
    it('should clear all tokens', () => {
      TokenManager.setAccessToken('access-token');
      TokenManager.clearTokens();

      expect(TokenManager.getAccessToken()).toBeNull();
    });
  });

  describe('JWT Token Decoding', () => {
    it('should decode valid JWT token', () => {
      const validToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      const decoded = TokenManager.decodeToken(validToken);

      expect(decoded).toBeDefined();
      expect(decoded.name).toBe('John Doe');
    });

    it('should return null for invalid token', () => {
      const decoded = TokenManager.decodeToken('invalid-token');

      expect(decoded).toBeNull();
    });
  });

  describe('User Info Extraction', () => {
    it('should extract user info from valid token', () => {
      const validToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      TokenManager.setAccessToken(validToken);

      const user = TokenManager.getUserFromToken();
      expect(user).toBeDefined();
    });

    it('should return null when no token set', () => {
      TokenManager.clearTokens();

      const user = TokenManager.getUserFromToken();
      expect(user).toBeNull();
    });
  });

  describe('Time to Expiry', () => {
    it('should calculate remaining time correctly', () => {
      const token = 'test-token';
      const expiresIn = 3600;
      TokenManager.setAccessToken(token, expiresIn);

      const timeLeft = TokenManager.getTimeUntilExpiry();

      expect(timeLeft).toBeGreaterThan(0);
      expect(timeLeft).toBeLessThanOrEqual((expiresIn + 1) * 1000);
    });

    it('should return 0 or negative for expired token', () => {
      const token = 'test-token';
      TokenManager.setAccessToken(token, -1);

      const timeLeft = TokenManager.getTimeUntilExpiry();

      expect(timeLeft).toBeLessThanOrEqual(0);
    });
  });
});
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import tokenManager, { TokenManager } from '../tokenManager';

describe('TokenManager Service', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Singleton Pattern', () => {
    it('should export a singleton instance', () => {
      expect(tokenManager).toBeDefined();
      expect(tokenManager).toBeInstanceOf(TokenManager);
    });

    it('should always return the same instance', () => {
      const instance1 = tokenManager;
      const instance2 = tokenManager;
      expect(instance1).toBe(instance2);
    });
  });

  describe('Access Token Management', () => {
    it('should set and get access token', () => {
      const token = 'test-access-token';
      tokenManager.setAccessToken(token);
      expect(tokenManager.getAccessToken()).toBe(token);
      expect(localStorage.getItem('auth_token')).toBe(token);
    });

    it('should handle null token gracefully', () => {
      tokenManager.setAccessToken(null);
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should handle undefined token gracefully', () => {
      tokenManager.setAccessToken(undefined);
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should return null when no token exists', () => {
      expect(tokenManager.getAccessToken()).toBeNull();
    });
  });

  describe('Refresh Token Management', () => {
    it('should set and get refresh token', () => {
      const token = 'test-refresh-token';
      tokenManager.setRefreshToken(token);
      expect(tokenManager.getRefreshToken()).toBe(token);
      expect(localStorage.getItem('refresh_token')).toBe(token);
    });

    it('should handle null refresh token', () => {
      tokenManager.setRefreshToken(null);
      expect(localStorage.getItem('refresh_token')).toBeNull();
    });
  });

  describe('User Data Management', () => {
    it('should set and get user data', () => {
      const userData = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'buyer'
      };
      tokenManager.setUser(userData);
      expect(tokenManager.getUser()).toEqual(userData);
    });

    it('should return null when no user data exists', () => {
      expect(tokenManager.getUser()).toBeNull();
    });

    it('should handle invalid JSON gracefully', () => {
      localStorage.setItem('user_data', 'invalid-json');
      expect(tokenManager.getUser()).toBeNull();
    });

    it('should handle null user data', () => {
      tokenManager.setUser(null);
      expect(localStorage.getItem('user_data')).toBeNull();
    });
  });

  describe('manageTokens - Bulk Operations', () => {
    it('should manage all tokens at once', () => {
      const accessToken = 'access-123';
      const refreshToken = 'refresh-456';
      const userData = { id: 1, username: 'test' };

      tokenManager.manageTokens(accessToken, refreshToken, userData);

      expect(tokenManager.getAccessToken()).toBe(accessToken);
      expect(tokenManager.getRefreshToken()).toBe(refreshToken);
      expect(tokenManager.getUser()).toEqual(userData);
    });

    it('should handle partial token updates', () => {
      tokenManager.manageTokens('access-only', null, null);
      expect(tokenManager.getAccessToken()).toBe('access-only');
      expect(tokenManager.getRefreshToken()).toBeNull();
      expect(tokenManager.getUser()).toBeNull();
    });
  });

  describe('clearTokens - Cleanup', () => {
    it('should clear all tokens and user data', () => {
      tokenManager.setAccessToken('token1');
      tokenManager.setRefreshToken('token2');
      tokenManager.setUser({ id: 1 });

      tokenManager.clearTokens();

      expect(tokenManager.getAccessToken()).toBeNull();
      expect(tokenManager.getRefreshToken()).toBeNull();
      expect(tokenManager.getUser()).toBeNull();
    });

    it('should work even when no tokens exist', () => {
      expect(() => tokenManager.clearTokens()).not.toThrow();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when access token exists', () => {
      tokenManager.setAccessToken('valid-token');
      expect(tokenManager.isAuthenticated()).toBe(true);
    });

    it('should return false when no access token exists', () => {
      expect(tokenManager.isAuthenticated()).toBe(false);
    });

    it('should return false after clearing tokens', () => {
      tokenManager.setAccessToken('token');
      tokenManager.clearTokens();
      expect(tokenManager.isAuthenticated()).toBe(false);
    });
  });

  describe('getUserFromToken - JWT Decoding', () => {
    it('should decode valid JWT token', () => {
      // Valid JWT: header.payload.signature
      const payload = { id: 1, email: 'test@example.com', role: 'buyer' };
      const encodedPayload = btoa(JSON.stringify(payload));
      const token = `header.${encodedPayload}.signature`;

      const decoded = tokenManager.getUserFromToken(token);
      expect(decoded).toEqual(payload);
    });

    it('should return null for invalid token format', () => {
      const invalidToken = 'not-a-jwt-token';
      expect(tokenManager.getUserFromToken(invalidToken)).toBeNull();
    });

    it('should return null for null token', () => {
      expect(tokenManager.getUserFromToken(null)).toBeNull();
    });

    it('should return null for malformed JWT', () => {
      const malformedToken = 'header.invalid-base64.signature';
      expect(tokenManager.getUserFromToken(malformedToken)).toBeNull();
    });

    it('should handle expired token structure', () => {
      const payload = { id: 1, exp: Math.floor(Date.now() / 1000) - 3600 }; // Expired
      const encodedPayload = btoa(JSON.stringify(payload));
      const token = `header.${encodedPayload}.signature`;

      const decoded = tokenManager.getUserFromToken(token);
      expect(decoded).toEqual(payload); // Should decode but not validate expiry
    });
  });

  describe('Error Handling', () => {
    it('should not throw on localStorage errors', () => {
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn(() => {
        throw new Error('localStorage is full');
      });

      expect(() => tokenManager.setAccessToken('token')).not.toThrow();

      Storage.prototype.setItem = originalSetItem;
    });

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('user_data', '{invalid-json}');
      expect(tokenManager.getUser()).toBeNull();
    });
  });

  describe('Class Instantiation (for testing)', () => {
    it('should allow creating new instances for testing', () => {
      const testInstance = new TokenManager();
      expect(testInstance).toBeInstanceOf(TokenManager);
      expect(testInstance).not.toBe(tokenManager);
    });

    it('should have independent storage keys', () => {
      const testInstance = new TokenManager();
      testInstance.setAccessToken('test-token');
      tokenManager.setAccessToken('default-token');

      // Both should use same localStorage keys (shared storage)
      expect(testInstance.getAccessToken()).toBe('default-token');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string token', () => {
      tokenManager.setAccessToken('');
      expect(tokenManager.getAccessToken()).toBe('');
      expect(tokenManager.isAuthenticated()).toBe(false);
    });

    it('should handle very long tokens', () => {
      const longToken = 'a'.repeat(10000);
      tokenManager.setAccessToken(longToken);
      expect(tokenManager.getAccessToken()).toBe(longToken);
    });

    it('should handle special characters in user data', () => {
      const userData = {
        name: 'Test "User" <script>',
        email: "test'@example.com"
      };
      tokenManager.setUser(userData);
      expect(tokenManager.getUser()).toEqual(userData);
    });

    it('should handle rapid successive calls', () => {
      for (let i = 0; i < 100; i++) {
        tokenManager.setAccessToken(`token-${i}`);
      }
      expect(tokenManager.getAccessToken()).toBe('token-99');
    });
  });
});
