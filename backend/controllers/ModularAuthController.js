
/**
 * 🎯 MODULAR AUTH CONTROLLER
 * Uses DI Container and Modules
 */

const { container } = require('../core/Container');
const { ErrorResponseFormatter } = require('../utils/errorHandler');

class ModularAuthController {
  /**
   * Register user
   */
  static async register(req, res) {
    try {
      const authModule = container.resolve('authModule');
      const user = await authModule.register(req.body);
      
      res.status(201).json(
        ErrorResponseFormatter.success(user, 'User registered successfully', 201)
      );
    } catch (error) {
      res.status(500).json(ErrorResponseFormatter.error(error));
    }
  }

  /**
   * Login user
   */
  static async login(req, res) {
    try {
      const authModule = container.resolve('authModule');
      const { email, password } = req.body;
      
      const result = await authModule.login(email, password);
      
      res.status(200).json(
        ErrorResponseFormatter.success(result, 'Login successful')
      );
    } catch (error) {
      res.status(401).json(ErrorResponseFormatter.error(error, 401));
    }
  }
}

module.exports = ModularAuthController;
