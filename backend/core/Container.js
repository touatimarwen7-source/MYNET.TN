
/**
 * 🏗️ DEPENDENCY INJECTION CONTAINER
 * Modular Monolith - Inversion of Control
 */

class Container {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
  }

  /**
   * Register a service
   */
  register(name, factory, singleton = false) {
    this.services.set(name, { factory, singleton });
    return this;
  }

  /**
   * Register a singleton service
   */
  singleton(name, factory) {
    return this.register(name, factory, true);
  }

  /**
   * Resolve a service
   */
  resolve(name) {
    const service = this.services.get(name);
    
    if (!service) {
      throw new Error(`Service "${name}" not found in container`);
    }

    // Return singleton instance if exists
    if (service.singleton && this.singletons.has(name)) {
      return this.singletons.get(name);
    }

    // Create instance
    const instance = service.factory(this);

    // Store singleton
    if (service.singleton) {
      this.singletons.set(name, instance);
    }

    return instance;
  }

  /**
   * Check if service exists
   */
  has(name) {
    return this.services.has(name);
  }

  /**
   * Clear all services
   */
  clear() {
    this.services.clear();
    this.singletons.clear();
  }
}

// Global container instance
const container = new Container();

module.exports = { Container, container };
