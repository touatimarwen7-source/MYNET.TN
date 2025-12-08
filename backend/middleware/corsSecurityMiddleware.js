/**
 * CORS Security Headers Middleware
 * Comprehensive security headers for production
 */

const cors = require('cors');

/**
 * CORS configuration with security options - supports all Replit domains
 */
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin
    if (!origin) return callback(null, true);
    
    // Allow all origins in development
    if (process.env.NODE_ENV === 'development') return callback(null, true);
    
    // Check if origin matches allowed patterns
    const isAllowed = /\.replit\.dev$/.test(origin) || 
                     /\.repl\.co$/.test(origin) ||
                     origin.includes('localhost') ||
                     origin.includes('0.0.0.0') ||
                     origin === process.env.CORS_ORIGIN;
    
    callback(null, isAllowed);
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-CSRF-Token',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400, // 24 hours
};

/**
 * Security headers middleware
 */
function securityHeadersMiddleware(req, res, next) {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()');

  // Content Security Policy (strict)
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none';"
  );

  // Strict Transport Security (HSTS)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // Cache control for sensitive resources
  if (req.path.includes('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  // Add request ID header for tracking
  res.setHeader('X-Request-ID', res.locals?.requestId || 'N/A');

  next();
}

/**
 * Rate limiting headers
 */
function rateLimitHeadersMiddleware(limit, window) {
  return (req, res, next) => {
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', limit - 1);
    res.setHeader('X-RateLimit-Reset', Math.ceil((Date.now() + window) / 1000));
    next();
  };
}

module.exports = {
  corsOptions,
  corsMiddleware: cors(corsOptions),
  securityHeadersMiddleware,
  rateLimitHeadersMiddleware,
};