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
  const { page = 1, limit = 10, sort, order } = req.query;

  // Validate page
  const pageNum = parseInt(String(page).trim(), 10);
  if (isNaN(pageNum) || pageNum < 1 || pageNum > 10000) {
    return res.status(400).json({
      success: false,
      error: 'Numéro de page invalide (1-10000)',
      code: 'INVALID_PAGE',
    });
  }

  // Validate limit
  const limitNum = parseInt(String(limit).trim(), 10);
  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    return res.status(400).json({
      success: false,
      error: 'Limite invalide (1-100)',
      code: 'INVALID_LIMIT',
    });
  }

  // Validate sort field (whitelist)
  const allowedSortFields = ['created_at', 'updated_at', 'title', 'status', 'deadline', 'budget_min'];
  if (sort && !allowedSortFields.includes(sort)) {
    return res.status(400).json({
      success: false,
      error: 'Champ de tri invalide',
      code: 'INVALID_SORT_FIELD',
      allowedFields: allowedSortFields,
    });
  }

  // Validate order
  const validOrders = ['asc', 'desc', 'ASC', 'DESC'];
  if (order && !validOrders.includes(order)) {
    return res.status(400).json({
      success: false,
      error: 'Ordre de tri invalide (asc/desc)',
      code: 'INVALID_SORT_ORDER',
    });
  }

  req.pagination = {
    page: pageNum,
    limit: limitNum,
    offset: (pageNum - 1) * limitNum,
    sort: sort || 'created_at',
    order: (order || 'desc').toUpperCase(),
  };

  next();
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