/**
 * Query Optimization Middleware
 * Logs slow queries and provides optimization suggestions
 */

const SLOW_QUERY_THRESHOLD = 500; // ms

class QueryOptimizationMiddleware {
  static middleware() {
    return (req, res, next) => {
      const startTime = Date.now();

      // Wrap res.json to measure query time
      const originalJson = res.json.bind(res);
      res.json = function(data) {
        const duration = Date.now() - startTime;

        // Log slow queries
        if (duration > SLOW_QUERY_THRESHOLD) {
          console.warn(`⚠️ SLOW QUERY: ${req.method} ${req.path} took ${duration}ms`);
          res.set('X-Query-Time', `${duration}ms`);
          
          // Add optimization hint
          if (duration > 1000) {
            console.warn(`💡 Consider:
              - Adding pagination (page, limit params)
              - Using specific columns (not *)
              - Adding database indexes
              - Implementing caching
            `);
          }
        }

        return originalJson(data);
      };

      next();
    };
  }
}

module.exports = QueryOptimizationMiddleware;
