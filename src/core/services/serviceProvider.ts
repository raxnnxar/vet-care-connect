/**
 * Service Provider
 * 
 * A dependency injection container that manages service instances
 * throughout the application.
 */

// Type to represent a constructor function
type Constructor<T> = new (...args: any[]) => T;

/**
 * Service Provider class that manages service instances and their retrieval
 */
class ServiceProvider {
  private services: Map<string, any> = new Map();
  private singletons: Map<string, any> = new Map();

  /**
   * Register a service implementation
   * 
   * @param key The unique identifier for the service
   * @param implementation The service implementation or constructor
   * @param isSingleton Whether to treat this service as a singleton
   */
  register<T>(key: string, implementation: T | Constructor<T>, isSingleton = true): void {
    if (isSingleton) {
      // If it's a singleton and already a constructed object, store it directly
      if (typeof implementation !== 'function') {
        this.singletons.set(key, implementation);
      } else {
        // Store the constructor to be instantiated on first use
        this.services.set(key, implementation);
      }
    } else {
      // For non-singletons, always store the implementation/constructor
      this.services.set(key, implementation);
    }
  }

  /**
   * Get a service by its key
   * 
   * @param key The unique identifier for the service
   * @returns The service instance
   * @throws Error if the service is not registered
   */
  get<T>(key: string): T {
    // Check if it's a singleton that's already instantiated
    if (this.singletons.has(key)) {
      return this.singletons.get(key) as T;
    }

    // Get the implementation or constructor
    const implementation = this.services.get(key);
    
    if (!implementation) {
      throw new Error(`Service '${key}' is not registered`);
    }

    // If it's a constructor function, instantiate it
    if (typeof implementation === 'function') {
      const instance = new implementation();
      
      // If it was registered as a singleton, store the instance
      if (!this.singletons.has(key)) {
        this.singletons.set(key, instance);
      }
      
      return instance as T;
    }

    // Otherwise return the implementation directly
    return implementation as T;
  }

  /**
   * Check if a service is registered
   * 
   * @param key The unique identifier for the service
   * @returns Whether the service is registered
   */
  has(key: string): boolean {
    return this.services.has(key) || this.singletons.has(key);
  }

  /**
   * Remove a registered service
   * 
   * @param key The unique identifier for the service
   * @returns Whether the service was removed
   */
  remove(key: string): boolean {
    const removedFromServices = this.services.delete(key);
    const removedFromSingletons = this.singletons.delete(key);
    return removedFromServices || removedFromSingletons;
  }

  /**
   * Clear all registered services
   */
  clear(): void {
    this.services.clear();
    this.singletons.clear();
  }
}

// Create and export a singleton instance of the ServiceProvider
export const serviceProvider = new ServiceProvider();

// Import and register pet API service
import { petsApi } from '../../features/pets/api/petsApi';
import { IPetsApi } from '../../features/pets/api/petsApiInterface';

// Register the API services
serviceProvider.register<IPetsApi>('petsApi', petsApi);

// Export the ServiceProvider class for testing or custom instantiation
export default ServiceProvider;
