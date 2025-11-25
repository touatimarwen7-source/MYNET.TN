/**
 * Standardized Error Response Formatter
 * Ensures all API responses follow consistent format
 */

class ErrorResponseFormatter {
  /**
   * Format success response
   */
  static success(data, message = 'Operation successful', statusCode = 200) {
    return {
      success: true,
      statusCode,
      message,
      data: data || null,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Format error response
   */
  static error(error, statusCode = 500, context = {}) {
    const isProduction = process.env.NODE_ENV === 'production';
    
    const formatted = {
      success: false,
      statusCode,
      message: error.message || 'Internal Server Error',
      code: error.code || 'INTERNAL_ERROR',
      timestamp: new Date().toISOString()
    };

    // Include stack trace only in development
    if (!isProduction && error.stack) {
      formatted.stack = error.stack;
    }

    // Include context for debugging
    if (Object.keys(context).length > 0) {
      formatted.context = context;
    }

    return formatted;
  }

  /**
   * Format validation error
   */
  static validationError(errors, message = 'Validation failed') {
    return {
      success: false,
      statusCode: 400,
      message,
      code: 'VALIDATION_ERROR',
      errors: Array.isArray(errors) ? errors : [errors],
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Format authorization error
   */
  static authorizationError(message = 'Unauthorized access') {
    return {
      success: false,
      statusCode: 403,
      message,
      code: 'AUTHORIZATION_ERROR',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Format not found error
   */
  static notFoundError(resource = 'Resource') {
    return {
      success: false,
      statusCode: 404,
      message: `${resource} not found`,
      code: 'NOT_FOUND',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Format database error
   */
  static databaseError(error, context = {}) {
    return {
      success: false,
      statusCode: 500,
      message: 'Database operation failed',
      code: 'DATABASE_ERROR',
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV !== 'production' && { details: error.message }),
      ...(Object.keys(context).length > 0 && { context })
    };
  }

  /**
   * Format rate limit error
   */
  static rateLimitError(retryAfter = 60) {
    return {
      success: false,
      statusCode: 429,
      message: 'Too many requests. Please try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = ErrorResponseFormatter;
