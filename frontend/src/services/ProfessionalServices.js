/**
 * Services professionnels unifiés
 * Ensemble de services auxiliaires avec des spécifications mondiales
 */

import axios from 'axios';
import { logger } from '../utils/logger';

/**
 * Service de gestion des données
 */
export const DataService = {
  /**
   * Formatage de la devise
   */
  formatCurrency: (value, currency = 'TND') => {
    return new Intl.NumberFormat('fr-TN').format(value) + ' ' + currency;
  },

  /**
   * Formatage de la date
   */
  formatDate: (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  },

  /**
   * Calcul de la différence temporelle
   */
  getTimeAgo: (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    if (days < 30) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    return this.formatDate(date);
  },

  /**
   * Calcul du pourcentage
   */
  calculatePercentage: (value, total) => {
    return ((value / total) * 100).toFixed(1);
  },

  /**
   * Formatage des grands nombres
   */
  formatNumber: (num) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  },
};

/**
 * Service de validation
 */
export const ValidationService = {
  /**
   * التحقق من البريد الإلكتروني
   */
  isValidEmail: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  /**
   * التحقق من رقم الهاتف
   */
  isValidPhone: (phone) => {
    const regex = /^[0-9]{8,}$/;
    return regex.test(phone.replace(/\s/g, ''));
  },

  /**
   * التحقق من كلمة المرور
   */
  isStrongPassword: (password) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password)
    );
  },

  /**
   * التحقق من البيانات المطلوبة
   */
  validateRequired: (fields) => {
    return Object.values(fields).every((field) => field && field.trim() !== '');
  },
};

/**
 * خدمة التنبيهات والإشعارات
 */
export const NotificationService = {
  /**
   * قائمة التنبيهات
   */
  alerts: [],

  /**
   * إضافة تنبيه
   */
  add: function (message, type = 'info') {
    const alert = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date(),
    };
    this.alerts.push(alert);
    logger.info(`Alert: ${message}`);
    return alert;
  },

  /**
   * إزالة تنبيه
   */
  remove: function (id) {
    this.alerts = this.alerts.filter((a) => a.id !== id);
  },

  /**
   * الحصول على جميع التنبيهات
   */
  getAll: function () {
    return this.alerts;
  },
};

/**
 * خدمة التصفية والبحث
 */
export const FilterService = {
  /**
   * تصفية البيانات
   */
  filter: (data, criteria) => {
    return data.filter((item) => {
      return Object.entries(criteria).every(([key, value]) => {
        if (!value) return true;
        return String(item[key]).toLowerCase().includes(String(value).toLowerCase());
      });
    });
  },

  /**
   * ترتيب البيانات
   */
  sort: (data, field, direction = 'asc') => {
    return [...data].sort((a, b) => {
      if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  },

  /**
   * تجميع البيانات
   */
  group: (data, field) => {
    return data.reduce((acc, item) => {
      const key = item[field];
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  },
};

/**
 * خدمة إدارة الأداء
 */
export const PerformanceService = {
  /**
   * حساب وقت الاستجابة
   */
  measureResponseTime: async (asyncFn) => {
    const start = performance.now();
    try {
      const result = await asyncFn();
      const end = performance.now();
      return {
        result,
        duration: (end - start).toFixed(2),
        success: true,
      };
    } catch (error) {
      const end = performance.now();
      return {
        error,
        duration: (end - start).toFixed(2),
        success: false,
      };
    }
  },

  /**
   * قياس حجم الذاكرة
   */
  getMemoryUsage: () => {
    if (performance.memory) {
      return {
        used: (performance.memory.usedJSHeapSize / 1048576).toFixed(2),
        limit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2),
      };
    }
    return null;
  },
};

/**
 * خدمة التخزين المحلي
 */
export const StorageService = {
  /**
   * حفظ البيانات
   */
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error('Storage set error:', error);
      return false;
    }
  },

  /**
   * استرجاع البيانات
   */
  get: (key) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Storage get error:', error);
      return null;
    }
  },

  /**
   * حذف البيانات
   */
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      logger.error('Storage remove error:', error);
      return false;
    }
  },

  /**
   * مسح التخزين
   */
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      logger.error('Storage clear error:', error);
      return false;
    }
  },
};
