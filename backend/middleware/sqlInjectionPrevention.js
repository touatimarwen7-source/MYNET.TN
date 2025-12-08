
const logger = require('../utils/logger');

/**
 * SQL Injection Prevention Middleware
 * Détecte et bloque les tentatives d'injection SQL
 */
const sqlInjectionPrevention = (req, res, next) => {
  const suspiciousPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
    /(--|\||;|\/\*|\*\/|xp_|sp_)/gi,
    /('|('')|;|--|\/\*|\*\/|\bOR\b|\bAND\b)/gi,
  ];

  const checkValue = (value, path = '') => {
    if (typeof value === 'string') {
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(value)) {
          logger.error('🚨 SQL Injection attempt detected', {
            ip: req.ip,
            path: req.path,
            method: req.method,
            suspiciousValue: value,
            fieldPath: path,
            userAgent: req.get('user-agent'),
          });
          
          return true;
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      for (const key in value) {
        if (checkValue(value[key], `${path}.${key}`)) {
          return true;
        }
      }
    }
    return false;
  };

  // Check query params
  if (checkValue(req.query, 'query')) {
    return res.status(400).json({
      success: false,
      error: 'Requête invalide détectée',
      code: 'INVALID_INPUT',
    });
  }

  // Check body
  if (checkValue(req.body, 'body')) {
    return res.status(400).json({
      success: false,
      error: 'Données invalides détectées',
      code: 'INVALID_INPUT',
    });
  }

  // Check params
  if (checkValue(req.params, 'params')) {
    return res.status(400).json({
      success: false,
      error: 'Paramètres invalides détectés',
      code: 'INVALID_INPUT',
    });
  }

  next();
};

module.exports = sqlInjectionPrevention;
