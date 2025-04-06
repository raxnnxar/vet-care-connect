// Export navigation components
export { default as AppNavigator } from './AppNavigator';
export { default as AuthNavigator } from './AuthNavigator';
export { default as OwnerNavigator } from './OwnerNavigator';
export { default as VetNavigator } from './VetNavigator';
export * from './navigationConfig';

// Legacy exports - keep for backward compatibility
export { default as LayoutBase } from '../../src/frontend/navigation/components/LayoutBase';
export { default as HeaderConBusqueda } from '../../src/frontend/navigation/components/HeaderConBusqueda';
export { default as NavbarInferior } from '../../src/frontend/navigation/components/NavbarInferior';
