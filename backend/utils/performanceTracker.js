
const { Sentry } = require('../config/sentry');
const { logger } = require('./logger');

/**
 * Performance Tracker for monitoring application metrics
 */
class PerformanceTracker {
  constructor() {
    this.metrics = new Map();
    this.slowQueries = [];
    this.apiLatencies = [];
  }

  /**
   * Track database query performance
   */
  trackQuery(queryName, duration, query) {
    const metric = {
      name: queryName,
      duration,
      timestamp: new Date(),
      query: query.substring(0, 100), // First 100 chars
    };

    if (duration > 100) {
      this.slowQueries.push(metric);
      logger.warn(`Slow query detected: ${queryName} took ${duration}ms`);
      
      Sentry.captureMessage(`Slow Query: ${queryName}`, {
        level: 'warning',
        tags: { type: 'performance', category: 'database' },
        extra: metric,
      });
    }

    this.updateMetric(queryName, duration);
  }

  /**
   * Track API endpoint performance
   */
  trackEndpoint(endpoint, method, duration, statusCode) {
    const metric = {
      endpoint,
      method,
      duration,
      statusCode,
      timestamp: new Date(),
    };

    this.apiLatencies.push(metric);

    if (duration > 1000) {
      logger.warn(`Slow endpoint: ${method} ${endpoint} took ${duration}ms`);
      
      Sentry.captureMessage(`Slow Endpoint: ${method} ${endpoint}`, {
        level: 'warning',
        tags: { type: 'performance', category: 'api' },
        extra: metric,
      });
    }

    this.updateMetric(`${method} ${endpoint}`, duration);

    // Keep only last 1000 entries
    if (this.apiLatencies.length > 1000) {
      this.apiLatencies = this.apiLatencies.slice(-1000);
    }
  }

  /**
   * Update metric statistics
   */
  updateMetric(name, duration) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, {
        count: 0,
        total: 0,
        min: Infinity,
        max: -Infinity,
        avg: 0,
      });
    }

    const metric = this.metrics.get(name);
    metric.count++;
    metric.total += duration;
    metric.min = Math.min(metric.min, duration);
    metric.max = Math.max(metric.max, duration);
    metric.avg = metric.total / metric.count;
  }

  /**
   * Get performance report
   */
  getReport() {
    const report = {
      metrics: Object.fromEntries(this.metrics),
      slowQueries: this.slowQueries.slice(-50),
      topSlowEndpoints: this.getTopSlowEndpoints(10),
      avgLatency: this.calculateAvgLatency(),
    };

    return report;
  }

  /**
   * Get top slow endpoints
   */
  getTopSlowEndpoints(limit = 10) {
    return [...this.apiLatencies]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit);
  }

  /**
   * Calculate average API latency
   */
  calculateAvgLatency() {
    if (this.apiLatencies.length === 0) return 0;
    const sum = this.apiLatencies.reduce((acc, m) => acc + m.duration, 0);
    return sum / this.apiLatencies.length;
  }

  /**
   * Clear old metrics
   */
  clearOldMetrics(daysToKeep = 7) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysToKeep);

    this.slowQueries = this.slowQueries.filter(
      (q) => q.timestamp > cutoff
    );
    this.apiLatencies = this.apiLatencies.filter(
      (a) => a.timestamp > cutoff
    );
  }
}

const performanceTracker = new PerformanceTracker();

// Auto-clear old metrics daily
setInterval(() => {
  performanceTracker.clearOldMetrics(7);
}, 24 * 60 * 60 * 1000);

module.exports = {
  performanceTracker,
  PerformanceTracker,
};
