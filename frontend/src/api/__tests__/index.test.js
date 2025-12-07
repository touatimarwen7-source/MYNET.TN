
import { describe, it, expect } from 'vitest';
import * as apiExports from '../index';

describe('API Index - Central Exports', () => {
  describe('Export Structure', () => {
    it('should export authAPI', () => {
      expect(apiExports.authAPI).toBeDefined();
      expect(typeof apiExports.authAPI).toBe('object');
    });

    it('should export procurementAPI', () => {
      expect(apiExports.procurementAPI).toBeDefined();
      expect(typeof apiExports.procurementAPI).toBe('object');
    });

    it('should export adminAPI', () => {
      expect(apiExports.adminAPI).toBeDefined();
      expect(typeof apiExports.adminAPI).toBe('object');
    });

    it('should export notificationAPI', () => {
      expect(apiExports.notificationAPI).toBeDefined();
      expect(typeof apiExports.notificationAPI).toBe('object');
    });

    it('should export searchAPI', () => {
      expect(apiExports.searchAPI).toBeDefined();
      expect(typeof apiExports.searchAPI).toBe('object');
    });

    it('should export bidAPI', () => {
      expect(apiExports.bidAPI).toBeDefined();
      expect(typeof apiExports.bidAPI).toBe('object');
    });

    it('should export directSupplyAPI', () => {
      expect(apiExports.directSupplyAPI).toBeDefined();
      expect(typeof apiExports.directSupplyAPI).toBe('object');
    });

    it('should export companyProfileAPI', () => {
      expect(apiExports.companyProfileAPI).toBeDefined();
      expect(typeof apiExports.companyProfileAPI).toBe('object');
    });

    it('should export apiClient (axios instance)', () => {
      expect(apiExports.apiClient).toBeDefined();
      expect(apiExports.apiClient.defaults).toBeDefined();
    });
  });

  describe('authAPI Methods', () => {
    it('should have login method', () => {
      expect(typeof apiExports.authAPI.login).toBe('function');
    });

    it('should have register method', () => {
      expect(typeof apiExports.authAPI.register).toBe('function');
    });

    it('should have logout method', () => {
      expect(typeof apiExports.authAPI.logout).toBe('function');
    });

    it('should have getProfile method', () => {
      expect(typeof apiExports.authAPI.getProfile).toBe('function');
    });

    it('should have updateProfile method', () => {
      expect(typeof apiExports.authAPI.updateProfile).toBe('function');
    });

    it('should have refreshToken method', () => {
      expect(typeof apiExports.authAPI.refreshToken).toBe('function');
    });
  });

  describe('procurementAPI Methods', () => {
    it('should have getTenders method', () => {
      expect(typeof apiExports.procurementAPI.getTenders).toBe('function');
    });

    it('should have getTender method', () => {
      expect(typeof apiExports.procurementAPI.getTender).toBe('function');
    });

    it('should have createTender method', () => {
      expect(typeof apiExports.procurementAPI.createTender).toBe('function');
    });

    it('should have getMyTenders method', () => {
      expect(typeof apiExports.procurementAPI.getMyTenders).toBe('function');
    });

    it('should have getOffers method', () => {
      expect(typeof apiExports.procurementAPI.getOffers).toBe('function');
    });

    it('should have getMyOffers method', () => {
      expect(typeof apiExports.procurementAPI.getMyOffers).toBe('function');
    });
  });

  describe('adminAPI Methods', () => {
    it('should have getUsers method', () => {
      expect(typeof apiExports.adminAPI.getUsers).toBe('function');
    });

    it('should have getStatistics method', () => {
      expect(typeof apiExports.adminAPI.getStatistics).toBe('function');
    });

    it('should have verifyUser method', () => {
      expect(typeof apiExports.adminAPI.verifyUser).toBe('function');
    });
  });

  describe('notificationAPI Methods', () => {
    it('should have getNotifications method', () => {
      expect(typeof apiExports.notificationAPI.getNotifications).toBe('function');
    });

    it('should have markAsRead method', () => {
      expect(typeof apiExports.notificationAPI.markAsRead).toBe('function');
    });

    it('should have markAllAsRead method', () => {
      expect(typeof apiExports.notificationAPI.markAllAsRead).toBe('function');
    });
  });

  describe('Default Export', () => {
    it('should have default export as axios instance', () => {
      expect(apiExports.default).toBeDefined();
      expect(apiExports.default.defaults).toBeDefined();
    });
  });
});
