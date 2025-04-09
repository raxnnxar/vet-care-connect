
import type { Config } from "tailwindcss";
import { theme as vettTheme } from "./src/theme/theme";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#7ECEC4', // Main teal from logo
					50: vettTheme.colors.primary[50],
					100: vettTheme.colors.primary[100],
					200: vettTheme.colors.primary[200],
					300: vettTheme.colors.primary[300],
					400: vettTheme.colors.primary[400],
					500: vettTheme.colors.primary[500],
					600: vettTheme.colors.primary[600],
					700: vettTheme.colors.primary[700],
					800: vettTheme.colors.primary[800],
					900: vettTheme.colors.primary[900],
					foreground: '#FFFFFF',
				},
				secondary: {
					DEFAULT: '#FFFFFF', // White from logo
					foreground: '#1F2937',
				},
				destructive: {
					DEFAULT: vettTheme.colors.error.DEFAULT,
					foreground: vettTheme.colors.error.light,
				},
				muted: {
					DEFAULT: vettTheme.colors.gray[100],
					foreground: vettTheme.colors.gray[500],
				},
				accent: {
					DEFAULT: vettTheme.colors.gray[100],
					foreground: vettTheme.colors.gray[900],
				},
				popover: {
					DEFAULT: '#FFFFFF',
					foreground: vettTheme.colors.text.DEFAULT,
				},
				card: {
					DEFAULT: '#FFFFFF',
					foreground: vettTheme.colors.text.DEFAULT,
				},
				success: vettTheme.colors.success,
				warning: vettTheme.colors.warning,
				error: vettTheme.colors.error,
				info: vettTheme.colors.info,
				gray: vettTheme.colors.gray,
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: vettTheme.borderRadius.lg,
				md: vettTheme.borderRadius.md,
				sm: vettTheme.borderRadius.sm,
			},
			fontFamily: {
				sans: [vettTheme.typography.fontFamily.sans],
				display: [vettTheme.typography.fontFamily.display],
				mono: [vettTheme.typography.fontFamily.mono],
			},
			fontSize: vettTheme.typography.fontSize,
			fontWeight: vettTheme.typography.fontWeight,
			lineHeight: vettTheme.typography.lineHeight,
			letterSpacing: vettTheme.typography.letterSpacing,
			spacing: vettTheme.spacing,
			boxShadow: vettTheme.shadows,
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'fade-out': {
					'0%': {
						opacity: '1',
						transform: 'translateY(0)'
					},
					'100%': {
						opacity: '0',
						transform: 'translateY(10px)'
					}
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
			},
			zIndex: vettTheme.zIndex,
			screens: vettTheme.breakpoints,
			transitionProperty: {
				height: 'height',
				spacing: 'margin, padding',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
