/**
 * 🔴 UNIFIED ERROR HANDLER
 * Consolidates all error handling logic in one centralized module
 * Combines errorResponseFormatter.js and errorResponseWrapper.js
 */

const { logger } = require('./logger');

// ============================================================================
// ERROR RESPONSE FORMAT CLASSES
// ============================================================================

/**
 * Base error response class
 */
class ErrorResponse {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    this.success = false;
    this.error = {
      message,
      code,
      statusCode,
      timestamp: new Date().toISOString(),
    };
    if (details) {
      this.error.details = details;
    }
  }
}

/**
 * Validation error response
 */
class ValidationError extends ErrorResponse {
  constructor(message, details = null) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

/**
 * Not found error response
 */
class NotFoundError extends ErrorResponse {
  constructor(message = 'Ressource non trouvée') {
    super(message, 404, 'NOT_FOUND');
  }
}

/**
 * Unauthorized error response
 */
class UnauthorizedError extends ErrorResponse {
  constructor(message = 'Non autorisé') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

/**
 * Forbidden error response
 */
class ForbiddenError extends ErrorResponse {
  constructor(message = 'Accès refusé') {
    super(message, 403, 'FORBIDDEN');
  }
}

/**
 * Conflict error response
 */
class ConflictError extends ErrorResponse {
  constructor(message, details = null) {
    super(message, 409, 'CONFLICT', details);
  }
}

/**
 * Server error response
 */
class ServerError extends ErrorResponse {
  constructor(message = 'Erreur serveur interne', details = null) {
    super(message, 500, 'INTERNAL_ERROR', details);
    logger.error('Server Error:', { message, details });
  }
}

// ============================================================================
// ERROR RESPONSE FORMATTER (static methods)
// ============================================================================

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
      timestamp: new Date().toISOString(),
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
      timestamp: new Date().toISOString(),
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
      timestamp: new Date().toISOString(),
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
      timestamp: new Date().toISOString(),
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
      timestamp: new Date().toISOString(),
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
      ...(Object.keys(context).length > 0 && { context }),
    };
  }

  /**
   * Format rate limit error
   */
  static rateLimitError(retryAfter = 60, limit = null, window = null) {
    return {
      success: false,
      statusCode: 429,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'تجاوزت الحد الأقصى للطلبات. يرجى المحاولة لاحقاً',
        details: {
          retryAfter,
          ...(limit && { limit }),
          ...(window && { window }),
        },
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Format conflict error
   */
  static conflictError(message, details = {}) {
    return {
      success: false,
      statusCode: 409,
      error: {
        code: 'CONFLICT',
        message: message || 'تعارض في البيانات',
        ...(Object.keys(details).length > 0 && { details }),
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Format unprocessable entity error
   */
  static unprocessableEntityError(message, details = {}) {
    return {
      success: false,
      statusCode: 422,
      error: {
        code: 'UNPROCESSABLE_ENTITY',
        message: message || 'لا يمكن معالجة الطلب',
        ...(Object.keys(details).length > 0 && { details }),
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Format service unavailable error
   */
  static serviceUnavailableError(message = null, retryAfter = null) {
    return {
      success: false,
      statusCode: 503,
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: message || 'الخدمة غير متاحة حالياً',
        ...(retryAfter && { details: { retryAfter } }),
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Format bad gateway error
   */
  static badGatewayError(message = null) {
    return {
      success: false,
      statusCode: 502,
      error: {
        code: 'BAD_GATEWAY',
        message: message || 'بوابة غير صحيحة',
      },
      timestamp: new Date().toISOString(),
    };
  }
}

// ============================================================================
// RESPONSE HANDLER FUNCTIONS
// ============================================================================

/**
 * Send standardized error response
 */
function sendErrorResponse(res, error, statusCode = 500) {
  let errorResponse;

  if (error instanceof ErrorResponse) {
    errorResponse = error;
    statusCode = error.error.statusCode;
  } else if (error instanceof Error) {
    errorResponse = new ServerError(error.message);
  } else if (typeof error === 'string') {
    errorResponse = new ServerError(error);
  } else {
    errorResponse = new ServerError('Erreur inconnue');
  }

  return res.status(statusCode).json(errorResponse);
}

/**
 * Send success response
 */
function sendSuccessResponse(res, data, statusCode = 200, message = 'Succès') {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Classes for class-based error handling
  ErrorResponse,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  ServerError,

  // Static formatter methods
  ErrorResponseFormatter,

  // Response handler functions
  sendErrorResponse,
  sendSuccessResponse,
};
