const AuthorizationGuard = require('../security/AuthorizationGuard');

// Espone i metodi come middleware
module.exports = AuthorizationGuard.authenticateToken.bind(AuthorizationGuard);

// Export anche funzioni specifiche
module.exports.verifyToken = AuthorizationGuard.authenticateToken.bind(AuthorizationGuard);
module.exports.checkRole = (roles) => AuthorizationGuard.requireRole(roles);
module.exports.checkPermission = (permission) => AuthorizationGuard.requirePermission(permission);
