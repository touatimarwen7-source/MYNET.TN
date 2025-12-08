
/**
 * 🛡️ ERROR HANDLING MIDDLEWARE
 * Centralized error handling for all routes
 */

const { logger } = require('../utils/logger');
const { ErrorResponseFormatter } = require('../utils/errorHandler');
const { handleDatabaseError } = require('../utils/databaseErrorHandler');

/**
 * Async route wrapper to catch errors
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Global error handler middleware
 */
function errorHandler(err, req, res, next) {
  // Log error
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    code: err.code
  });

  // Handle database errors specifically
  if (err.code && (err.code.startsWith('23') || err.code.startsWith('42') || err.code.startsWith('08') || err.code.startsWith('22'))) {
    const dbError = handleDatabaseError(err);
    const errorResponse = ErrorResponseFormatter.error(dbError, dbError.statusCode, {
      path: req.path,
      method: req.method,
    });
    return res.status(dbError.statusCode).json(errorResponse);
  }

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Send formatted error response
  const errorResponse = ErrorResponseFormatter.error(err, statusCode, {
    path: req.path,
    method: req.method,
  });

  res.status(statusCode).json(errorResponse);
}

/**
 * 404 Not Found handler
 */
function notFoundHandler(req, res) {
  const errorResponse = ErrorResponseFormatter.notFoundError('Route');
  res.status(404).json(errorResponse);
}

module.exports = {
  asyncHandler,
  errorHandler,
  notFoundHandler,
};
