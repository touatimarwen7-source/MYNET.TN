const db = require('../config/db');

class HealthMonitoringService {
  constructor() {
    this.metrics = {
      requests: [],
      errors: [],
      latencies: []
    };
  }

  // تسجيل طلب API
  recordRequest(method, path, statusCode, latency) {
    const record = {
      timestamp: new Date(),
      method,
      path,
      statusCode,
      latency,
      success: statusCode >= 200 && statusCode < 300
    };
    this.metrics.requests.push(record);
    if (statusCode >= 400) this.metrics.errors.push(record);
    this.metrics.latencies.push(latency);
    
    // الاحتفاظ بـ 1000 سجل فقط
    if (this.metrics.requests.length > 1000) {
      this.metrics.requests.shift();
    }
  }

  // الحصول على إحصائيات الصحة
  getHealthStats() {
    const now = new Date();
    const oneHourAgo = new Date(now - 60 * 60 * 1000);
    
    const recentRequests = this.metrics.requests.filter(r => r.timestamp > oneHourAgo);
    const recentErrors = this.metrics.errors.filter(r => r.timestamp > oneHourAgo);
    
    const successRate = recentRequests.length > 0 
      ? ((recentRequests.length - recentErrors.length) / recentRequests.length * 100).toFixed(2)
      : 100;
    
    const avgLatency = recentRequests.length > 0
      ? (recentRequests.reduce((sum, r) => sum + r.latency, 0) / recentRequests.length).toFixed(0)
      : 0;

    return {
      status: successRate >= 99 ? 'healthy' : successRate >= 95 ? 'degraded' : 'critical',
      successRate: parseFloat(successRate),
      avgLatency: parseInt(avgLatency),
      totalRequests: recentRequests.length,
      totalErrors: recentErrors.length,
      timestamp: now
    };
  }

  // إحصائيات حسب المسار
  getPathStats() {
    const pathMetrics = {};
    
    this.metrics.requests.forEach(req => {
      if (!pathMetrics[req.path]) {
        pathMetrics[req.path] = {
          path: req.path,
          method: req.method,
          calls: 0,
          errors: 0,
          avgLatency: 0,
          successRate: 100
        };
      }
      pathMetrics[req.path].calls++;
      if (!req.success) pathMetrics[req.path].errors++;
    });

    return Object.values(pathMetrics).map(metric => ({
      ...metric,
      successRate: metric.calls > 0 
        ? ((metric.calls - metric.errors) / metric.calls * 100).toFixed(2)
        : 100
    }));
  }

  // التحقق من المسارات الحرجة
  checkCriticalPaths() {
    const criticalPaths = [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/refresh',
      '/api/procurement/submit-bid',
      '/api/procurement/create-tender'
    ];

    const alerts = [];
    const pathStats = this.getPathStats();

    pathStats.forEach(stat => {
      if (criticalPaths.includes(stat.path)) {
        if (stat.avgLatency > 1000) {
          alerts.push({
            severity: 'critical',
            path: stat.path,
            message: `Latency exceeded 1000ms: ${stat.avgLatency}ms`,
            timestamp: new Date()
          });
        }
        if (parseFloat(stat.successRate) < 95) {
          alerts.push({
            severity: 'high',
            path: stat.path,
            message: `Success rate below 95%: ${stat.successRate}%`,
            timestamp: new Date()
          });
        }
      }
    });

    return alerts;
  }
}

module.exports = new HealthMonitoringService();
