
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
    code: err.code,
    statusCode: err.statusCode,
  });

  // Handle database errors specifically
  if (err.code && (err.code.startsWith('23') || err.code.startsWith('42') || err.code.startsWith('08') || err.code.startsWith('22'))) {
    const dbError = handleDatabaseError(err);
    const errorResponse = ErrorResponseFormatter.error(dbError, dbError.statusCode, {
      path: req.path,
      method: req.method,
      requestId: req.id,
    });
    return res.status(dbError.statusCode).json(errorResponse);
  }

  // Determine status code - default to 500 for unknown errors
  let statusCode = err.statusCode || err.status || 500;

  // Map common error types to correct status codes
  if (err.name === 'ValidationError') statusCode = 400;
  if (err.name === 'UnauthorizedError') statusCode = 401;
  if (err.name === 'ForbiddenError') statusCode = 403;
  if (err.name === 'NotFoundError') statusCode = 404;
  if (err.name === 'ConflictError') statusCode = 409;
  if (err.name === 'UnprocessableEntityError') statusCode = 422;
  if (err.name === 'TooManyRequestsError') statusCode = 429;

  // Send formatted error response with request context
  const errorResponse = ErrorResponseFormatter.error(err, statusCode, {
    path: req.path,
    method: req.method,
    requestId: req.id,
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
