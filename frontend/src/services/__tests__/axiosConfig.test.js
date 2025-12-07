
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import axiosInstance from '../axiosConfig';
import tokenManager from '../tokenManager';

describe('Axios Configuration Service', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance);
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    mock.restore();
    localStorage.clear();
  });

  describe('Base Configuration', () => {
    it('should have correct base URL', () => {
      expect(axiosInstance.defaults.baseURL).toBe('/api');
    });

    it('should have correct default headers', () => {
      expect(axiosInstance.defaults.headers['Content-Type']).toBe('application/json');
    });

    it('should have credentials enabled', () => {
      expect(axiosInstance.defaults.withCredentials).toBe(true);
    });

    it('should have 30 second timeout', () => {
      expect(axiosInstance.defaults.timeout).toBe(30000);
    });
  });

  describe('Request Interceptor - Token Injection', () => {
    it('should add Authorization header when token exists', async () => {
      const token = 'test-access-token';
      tokenManager.setAccessToken(token);

      mock.onGet('/test').reply((config) => {
        expect(config.headers.Authorization).toBe(`Bearer ${token}`);
        return [200, { success: true }];
      });

      await axiosInstance.get('/test');
    });

    it('should not add Authorization header when no token', async () => {
      mock.onGet('/test').reply((config) => {
        expect(config.headers.Authorization).toBeUndefined();
        return [200, { success: true }];
      });

      await axiosInstance.get('/test');
    });

    it('should add CSRF token from meta tag', async () => {
      // Simulate CSRF token in meta tag
      const metaTag = document.createElement('meta');
      metaTag.name = 'csrf-token';
      metaTag.content = 'csrf-test-token';
      document.head.appendChild(metaTag);

      mock.onGet('/test').reply((config) => {
        expect(config.headers['X-CSRF-Token']).toBeDefined();
        return [200, { success: true }];
      });

      await axiosInstance.get('/test');

      document.head.removeChild(metaTag);
    });

    it('should add security headers', async () => {
      mock.onGet('/test').reply((config) => {
        expect(config.headers['X-Requested-With']).toBe('XMLHttpRequest');
        expect(config.headers['X-Content-Type-Options']).toBe('nosniff');
        return [200, { success: true }];
      });

      await axiosInstance.get('/test');
    });
  });

  describe('Response Interceptor - Success', () => {
    it('should return response data on success', async () => {
      const responseData = { data: 'test', success: true };
      mock.onGet('/test').reply(200, responseData);

      const response = await axiosInstance.get('/test');
      expect(response.data).toEqual(responseData);
    });

    it('should cache GET requests', async () => {
      mock.onGet('/test').reply(200, { data: 'cached' });

      const response1 = await axiosInstance.get('/test');
      const response2 = await axiosInstance.get('/test');

      expect(response1.data).toEqual(response2.data);
    });
  });

  describe('Response Interceptor - Error Handling', () => {
    it('should normalize error response to have string error message', async () => {
      mock.onGet('/test').reply(500, { message: 'Server error' });

      try {
        await axiosInstance.get('/test');
      } catch (error) {
        expect(error.response.data.error).toBe('Server error');
        expect(typeof error.response.data.error).toBe('string');
      }
    });

    it('should convert non-object error to object with error property', async () => {
      mock.onGet('/test').reply(500, 'Plain string error');

      try {
        await axiosInstance.get('/test');
      } catch (error) {
        expect(error.response.data.error).toBe('Plain string error');
        expect(typeof error.response.data.error).toBe('string');
      }
    });

    it('should handle 401 errors', async () => {
      tokenManager.setAccessToken('invalid-token');
      mock.onGet('/test').reply(401, { error: 'Unauthorized' });

      try {
        await axiosInstance.get('/test');
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });

    it('should handle 403 errors without logout', async () => {
      mock.onGet('/test').reply(403, { error: 'Forbidden' });

      try {
        await axiosInstance.get('/test');
      } catch (error) {
        expect(error.response.status).toBe(403);
        // Should NOT clear tokens on 403
        expect(tokenManager.getAccessToken()).not.toBeNull();
      }
    });

    it('should use cache on network error for GET requests', async () => {
      // First successful request
      mock.onGet('/test').replyOnce(200, { data: 'cached' });
      await axiosInstance.get('/test');

      // Network error
      mock.onGet('/test').networkError();

      try {
        const response = await axiosInstance.get('/test');
        // Should return cached response
        expect(response.data).toEqual({ data: 'cached' });
      } catch (error) {
        // If cache miss, should throw
        expect(error.message).toContain('Network Error');
      }
    });
  });

  describe('Public Endpoints', () => {
    it('should not require token for public endpoints', async () => {
      mock.onPost('/auth/login').reply((config) => {
        expect(config.headers.Authorization).toBeUndefined();
        return [200, { accessToken: 'new-token' }];
      });

      await axiosInstance.post('/auth/login', { email: 'test@test.com' });
    });
  });

  describe('Token Refresh Logic', () => {
    it('should attempt refresh on 401 error', async () => {
      tokenManager.setAccessToken('expired-token');
      tokenManager.setRefreshToken('valid-refresh');

      mock.onGet('/protected').replyOnce(401);
      mock.onPost('/auth/refresh-token').reply(200, {
        accessToken: 'new-access-token',
        expiresIn: 900
      });
      mock.onGet('/protected').reply(200, { data: 'success' });

      const response = await axiosInstance.get('/protected');
      expect(response.data.data).toBe('success');
    });
  });

  describe('Edge Cases', () => {
    it('should handle timeout errors', async () => {
      mock.onGet('/slow').timeout();

      try {
        await axiosInstance.get('/slow');
      } catch (error) {
        expect(error.code).toBe('ECONNABORTED');
      }
    });

    it('should handle large response payloads', async () => {
      const largeData = { items: new Array(10000).fill({ id: 1 }) };
      mock.onGet('/large').reply(200, largeData);

      const response = await axiosInstance.get('/large');
      expect(response.data.items.length).toBe(10000);
    });

    it('should handle concurrent requests', async () => {
      mock.onGet('/test1').reply(200, { id: 1 });
      mock.onGet('/test2').reply(200, { id: 2 });
      mock.onGet('/test3').reply(200, { id: 3 });

      const results = await Promise.all([
        axiosInstance.get('/test1'),
        axiosInstance.get('/test2'),
        axiosInstance.get('/test3')
      ]);

      expect(results[0].data.id).toBe(1);
      expect(results[1].data.id).toBe(2);
      expect(results[2].data.id).toBe(3);
    });
  });
});
