// tailwind.config.js
// Mental Wellness Companion - Tailwind Configuration
// Optimized for accessibility and older adult users

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  
  theme: {
    extend: {
      // Custom color palette - calming, accessible
      colors: {
        // Primary - calming blue
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        
        // Success - completion/positive
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        
        // Warning - attention
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        
        // Danger - crisis (use sparingly)
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        
        // Breathing exercise colors
        breath: {
          inhale: '#3b82f6',    // Blue
          hold: '#8b5cf6',      // Purple  
          exhale: '#10b981',    // Green
        },
        
        // Mindfulness - calm purple
        mindful: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
        },
        
        // Neutral gray with warm undertone
        gray: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
      },
      
      // Typography - larger defaults for accessibility
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],           // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],        // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],         // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],            // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],       // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],         // 36px
        '5xl': ['3rem', { lineHeight: '1' }],                 // 48px
        
        // Accessibility variants
        'accessible': ['1.125rem', { lineHeight: '1.75rem' }],      // Large body
        'accessible-lg': ['1.25rem', { lineHeight: '1.875rem' }],   // Extra large body
      },
      
      // Font families
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      
      // Spacing - generous for touch targets and readability
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        'touch': '44px',        // Minimum touch target
        'touch-lg': '48px',     // Comfortable touch target
      },
      
      // Border radius
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      
      // Shadows - subtle, not overwhelming
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(0, 0, 0, 0.1)',
        'soft-md': '0 4px 12px -4px rgba(0, 0, 0, 0.12)',
        'soft-lg': '0 8px 24px -8px rgba(0, 0, 0, 0.15)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      },
      
      // Animations
      animation: {
        'breathe-in': 'breatheIn 4s ease-in-out',
        'breathe-out': 'breatheOut 8s ease-in-out',
        'pulse-soft': 'pulseSoft 2s infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      
      keyframes: {
        breatheIn: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.5)' },
        },
        breatheOut: {
          '0%': { transform: 'scale(1.5)' },
          '100%': { transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      
      // Transitions
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      
      // Min height for touch targets
      minHeight: {
        'touch': '44px',
        'touch-lg': '48px',
      },
      
      // Min width for touch targets  
      minWidth: {
        'touch': '44px',
        'touch-lg': '48px',
      },
      
      // Z-index scale
      zIndex: {
        'modal': '100',
        'toast': '110',
        'tooltip': '120',
        'crisis': '200',    // Crisis button always on top
      },
    },
  },
  
  plugins: [
    // Custom plugin for focus-visible states
    function({ addUtilities }) {
      addUtilities({
        '.focus-ring': {
          '@apply focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2': {},
        },
        '.focus-ring-danger': {
          '@apply focus:outline-none focus-visible:ring-2 focus-visible:ring-danger-500 focus-visible:ring-offset-2': {},
        },
        '.touch-target': {
          '@apply min-h-touch min-w-touch': {},
        },
        '.touch-target-lg': {
          '@apply min-h-touch-lg min-w-touch-lg': {},
        },
      });
    },
  ],
};
