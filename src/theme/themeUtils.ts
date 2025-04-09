
import { theme } from './theme';

/**
 * Helper functions to work with the theme
 */

/**
 * Gets a color from the theme using dot notation
 * Example: getColor('primary.500') returns the primary.500 color
 */
export function getColor(path: string): string {
  const parts = path.split('.');
  let result: any = { ...theme.colors };
  
  for (const part of parts) {
    if (result && typeof result === 'object' && part in result) {
      result = result[part];
    } else {
      return '';
    }
  }
  
  return typeof result === 'string' ? result : '';
}

/**
 * Gets a spacing value from the theme
 * Example: getSpacing(4) returns 1rem (16px)
 */
export function getSpacing(key: keyof typeof theme.spacing): string {
  return theme.spacing[key] || '';
}

/**
 * Gets a font size value from the theme
 * Example: getFontSize('lg') returns 1.125rem (18px)
 */
export function getFontSize(key: keyof typeof theme.typography.fontSize): string {
  return theme.typography.fontSize[key] || '';
}

/**
 * Gets a border radius value from the theme
 * Example: getBorderRadius('lg') returns 0.5rem (8px)
 */
export function getBorderRadius(key: keyof typeof theme.borderRadius): string {
  return theme.borderRadius[key] || '';
}

/**
 * Gets a shadow value from the theme
 * Example: getShadow('lg') returns the large shadow value
 */
export function getShadow(key: keyof typeof theme.shadows): string {
  return theme.shadows[key] || '';
}

/**
 * Returns all available color names in the theme
 */
export function getColorNames(): string[] {
  return Object.keys(theme.colors);
}

/**
 * Returns all available spacing keys in the theme
 */
export function getSpacingKeys(): (keyof typeof theme.spacing)[] {
  return Object.keys(theme.spacing) as (keyof typeof theme.spacing)[];
}

/**
 * Generates CSS variables for the theme
 * Can be used to inject theme values into CSS-in-JS solutions
 */
export function generateCssVariables(): Record<string, string> {
  const cssVars: Record<string, string> = {};
  
  // Process colors
  Object.entries(theme.colors).forEach(([colorName, colorValue]) => {
    if (typeof colorValue === 'string') {
      cssVars[`--color-${colorName}`] = colorValue;
    } else if (typeof colorValue === 'object') {
      Object.entries(colorValue).forEach(([shade, value]) => {
        cssVars[`--color-${colorName}-${shade}`] = value;
      });
    }
  });
  
  // Process spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    cssVars[`--spacing-${key}`] = value;
  });
  
  // Process fonts
  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    cssVars[`--font-size-${key}`] = value;
  });
  
  return cssVars;
}

export default {
  getColor,
  getSpacing,
  getFontSize,
  getBorderRadius,
  getShadow,
  getColorNames,
  getSpacingKeys,
  generateCssVariables,
};
