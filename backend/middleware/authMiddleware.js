const AuthorizationGuard = require('../security/AuthorizationGuard');

// Main middleware export
const authMiddleware = AuthorizationGuard.authenticateToken.bind(AuthorizationGuard);

// Export as default and named
module.exports = authMiddleware;
module.exports.authMiddleware = authMiddleware;
module.exports.verifyToken = AuthorizationGuard.authenticateToken.bind(AuthorizationGuard);
module.exports.checkRole = (roles) => AuthorizationGuard.requireRole(roles);
module.exports.checkPermission = (permission) => AuthorizationGuard.requirePermission(permission);
