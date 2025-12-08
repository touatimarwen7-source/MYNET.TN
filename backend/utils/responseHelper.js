
/**
 * 📤 RESPONSE HELPER
 * Utility functions for standardized API responses
 */

const { ErrorResponseFormatter } = require('./errorHandler');

/**
 * Send success response with 200 OK
 */
const sendOk = (res, data, message = 'Success') => {
  return res.status(200).json(
    ErrorResponseFormatter.success(data, message, 200)
  );
};

/**
 * Send success response with 201 Created
 */
const sendCreated = (res, data, message = 'Resource created successfully') => {
  return res.status(201).json(
    ErrorResponseFormatter.success(data, message, 201)
  );
};

/**
 * Send success response with 204 No Content
 */
const sendNoContent = (res) => {
  return res.status(204).send();
};

/**
 * Send validation error (400)
 */
const sendValidationError = (res, errors, message = 'Validation failed') => {
  return res.status(400).json(
    ErrorResponseFormatter.validationError(errors, message)
  );
};

/**
 * Send unauthorized error (401)
 */
const sendUnauthorized = (res, message = 'Unauthorized access') => {
  return res.status(401).json(
    ErrorResponseFormatter.authorizationError(message)
  );
};

/**
 * Send forbidden error (403)
 */
const sendForbidden = (res, message = 'Access forbidden') => {
  return res.status(403).json(
    ErrorResponseFormatter.authorizationError(message)
  );
};

/**
 * Send not found error (404)
 */
const sendNotFound = (res, resource = 'Resource') => {
  return res.status(404).json(
    ErrorResponseFormatter.notFoundError(resource)
  );
};

/**
 * Send conflict error (409)
 */
const sendConflict = (res, message, details = {}) => {
  return res.status(409).json(
    ErrorResponseFormatter.conflictError(message, details)
  );
};

/**
 * Send unprocessable entity error (422)
 */
const sendUnprocessableEntity = (res, message, details = {}) => {
  return res.status(422).json(
    ErrorResponseFormatter.unprocessableEntityError(message, details)
  );
};

/**
 * Send rate limit error (429)
 */
const sendRateLimitError = (res, retryAfter = 60, limit = null, window = null) => {
  return res.status(429).json(
    ErrorResponseFormatter.rateLimitError(retryAfter, limit, window)
  );
};

/**
 * Send internal server error (500)
 */
const sendInternalError = (res, message = 'Internal server error') => {
  return res.status(500).json(
    ErrorResponseFormatter.error(new Error(message), 500)
  );
};

/**
 * Send bad gateway error (502)
 */
const sendBadGateway = (res, message = null) => {
  return res.status(502).json(
    ErrorResponseFormatter.badGatewayError(message)
  );
};

/**
 * Send service unavailable error (503)
 */
const sendServiceUnavailable = (res, message = null, retryAfter = null) => {
  return res.status(503).json(
    ErrorResponseFormatter.serviceUnavailableError(message, retryAfter)
  );
};

module.exports = {
  sendOk,
  sendCreated,
  sendNoContent,
  sendValidationError,
  sendUnauthorized,
  sendForbidden,
  sendNotFound,
  sendConflict,
  sendUnprocessableEntity,
  sendRateLimitError,
  sendInternalError,
  sendBadGateway,
  sendServiceUnavailable,
};
