
/**
 * Pagination Validator Middleware
 * Validates and sanitizes pagination parameters
 */

const DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
};

/**
 * Validate pagination parameters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validatePagination = (req, res, next) => {
  try {
    // Extract and parse pagination parameters
    let { page, limit } = req.query;

    // Validate and sanitize page
    page = parseInt(page, 10);
    if (isNaN(page) || page < 1) {
      page = DEFAULTS.PAGE;
    }

    // Validate and sanitize limit
    limit = parseInt(limit, 10);
    if (isNaN(limit) || limit < DEFAULTS.MIN_LIMIT) {
      limit = DEFAULTS.LIMIT;
    }
    if (limit > DEFAULTS.MAX_LIMIT) {
      limit = DEFAULTS.MAX_LIMIT;
    }

    // Calculate offset
    const offset = (page - 1) * limit;

    // Attach sanitized values to request
    req.pagination = {
      page,
      limit,
      offset,
    };

    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid pagination parameters',
      error: error.message,
    });
  }
};

/**
 * Create pagination metadata for response
 * @param {number} totalCount - Total number of records
 * @param {Object} pagination - Pagination object from request
 * @returns {Object} Pagination metadata
 */
const createPaginationMeta = (totalCount, pagination) => {
  const { page, limit } = pagination;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    currentPage: page,
    pageSize: limit,
    totalPages,
    totalCount,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

module.exports = {
  validatePagination,
  createPaginationMeta,
  DEFAULTS,
};
