// Performance monitoring middleware
const performanceMiddleware = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    // Warn if response takes too long
    if (duration > 1000) {
      console.warn(`⚠️ SLOW REQUEST: ${req.method} ${req.path} took ${duration}ms`);
    }
    
    // Track response time
    req.responseTime = duration;
  });
  
  next();
};

module.exports = performanceMiddleware;
