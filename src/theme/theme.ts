
/**
 * Vett App Theme
 * 
 * This file contains the theme configuration for the Vett application,
 * including colors, typography, spacing, and other design tokens.
 */

export const theme = {
  /**
   * Color Palette
   * Primary: Teal from logo (#7ECEC4)
   * Secondary: White from logo (#FFFFFF)
   * Background: Light gray for contrast
   * Text: Dark gray for readability
   * Accents and semantic colors
   */
  colors: {
    // Brand Colors
    primary: {
      50: '#E6F7F5',
      100: '#CDEFEB',
      200: '#A0E3DB',
      300: '#7ECEC4', // Main teal from logo
      400: '#5CBEB3',
      500: '#46A79C',
      600: '#388A81',
      700: '#2D6D66',
      800: '#224F4A',
      900: '#172F2C',
    },
    secondary: {
      DEFAULT: '#FFFFFF', // White from logo
    },

    // Neutral Colors
    gray: {
      50: '#F9FAFB', // Light background
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937', // Main text color
      900: '#111827',
    },

    // Semantic Colors
    success: {
      light: '#D1FAE5',
      DEFAULT: '#10B981',
      dark: '#065F46',
    },
    warning: {
      light: '#FEF3C7',
      DEFAULT: '#F59E0B',
      dark: '#92400E',
    },
    error: {
      light: '#FEE2E2',
      DEFAULT: '#EF4444',
      dark: '#B91C1C',
    },
    info: {
      light: '#DBEAFE',
      DEFAULT: '#3B82F6',
      dark: '#1E40AF',
    },

    // Common UI Colors
    background: {
      DEFAULT: '#F9FAFB', // Light gray
      alt: '#FFFFFF', // White
      dark: '#1F2937', // Dark mode background
    },
    text: {
      DEFAULT: '#1F2937', // Dark gray for readability
      muted: '#6B7280', // Secondary text
      light: '#FFFFFF', // Light text on dark backgrounds
    },
    border: '#E5E7EB',
    divider: '#E5E7EB',
    focus: '#7ECEC4', // Primary teal
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  /**
   * Typography
   * Font families, sizes, weights, and line heights
   */
  typography: {
    // Font family
    fontFamily: {
      sans: 'Inter, system-ui, sans-serif',
      display: 'Inter, system-ui, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },

    // Font sizes (rem values = px/16)
    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem', // 48px
    },

    // Font weights
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },

    // Line heights
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },

    // Letter spacing
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
    },
  },

  /**
   * Spacing
   * Consistent spacing scale for margins, paddings, gaps, etc.
   */
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem', // 2px
    1: '0.25rem', // 4px
    1.5: '0.375rem', // 6px
    2: '0.5rem', // 8px
    2.5: '0.625rem', // 10px
    3: '0.75rem', // 12px
    3.5: '0.875rem', // 14px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    7: '1.75rem', // 28px
    8: '2rem', // 32px
    9: '2.25rem', // 36px
    10: '2.5rem', // 40px
    11: '2.75rem', // 44px
    12: '3rem', // 48px
    14: '3.5rem', // 56px
    16: '4rem', // 64px
    20: '5rem', // 80px
    24: '6rem', // 96px
    28: '7rem', // 112px
    32: '8rem', // 128px
    36: '9rem', // 144px
    40: '10rem', // 160px
    44: '11rem', // 176px
    48: '12rem', // 192px
    52: '13rem', // 208px
    56: '14rem', // 224px
    60: '15rem', // 240px
    64: '16rem', // 256px
    72: '18rem', // 288px
    80: '20rem', // 320px
    96: '24rem', // 384px
  },

  /**
   * Border Radius
   * Consistent border radius values
   */
  borderRadius: {
    none: '0',
    sm: '0.125rem', // 2px
    DEFAULT: '0.25rem', // 4px
    md: '0.375rem', // 6px
    lg: '0.5rem', // 8px
    xl: '0.75rem', // 12px
    '2xl': '1rem', // 16px
    '3xl': '1.5rem', // 24px
    full: '9999px', // Fully rounded (circle)
  },

  /**
   * Shadows
   * Consistent shadow values
   */
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },

  /**
   * Transitions
   * Common transition presets
   */
  transitions: {
    DEFAULT: 'all 0.2s ease',
    fast: 'all 0.1s ease',
    slow: 'all 0.3s ease',
  },

  /**
   * Z-index
   * Z-index scale for layering
   */
  zIndex: {
    0: 0,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50,
    auto: 'auto',
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modal: 1300,
    popover: 1400,
    tooltip: 1500,
  },

  /**
   * Media Queries
   * Common breakpoints for responsive design
   */
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

export default theme;
