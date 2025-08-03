/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Healing Greens Palette for Medical Trust (Enhanced for Bioprognostika)
        primary: {
          50: '#f0fdf4',   // Lightest green - backgrounds
          100: '#dcfce7',  // Very light green - subtle highlights
          200: '#bbf7d0',  // Light green - secondary backgrounds
          300: '#86efac',  // Medium light green - accents
          400: '#4ade80',  // Medium green - interactive elements
          500: '#22c55e',  // Main green - primary buttons
          600: '#16a34a',  // Darker green - hover states
          700: '#15803d',  // Dark green - text, borders
          800: '#166534',  // Darker green - emphasis
          900: '#14532d',  // Darkest green - high contrast text
        },
        // Bioprognostika Brand Colors
        prediction: {
          50: '#eff6ff',   // Lightest blue
          100: '#dbeafe',  // Very light blue
          200: '#bfdbfe',  // Light blue
          300: '#93c5fd',  // Medium light blue
          400: '#60a5fa',  // Medium blue
          500: '#3b82f6',  // Main blue - prediction technology
          600: '#2563eb',  // Darker blue
          700: '#1d4ed8',  // Dark blue - trust, authority
          800: '#1e40af',  // Darker blue - medical authority
          900: '#1e3a8a',  // Darkest blue
        },
        intelligence: {
          50: '#faf5ff',   // Lightest purple
          100: '#f3e8ff',  // Very light purple
          200: '#e9d5ff',  // Light purple
          300: '#d8b4fe',  // Medium light purple
          400: '#c084fc',  // Medium purple
          500: '#a855f7',  // Main purple - insights
          600: '#9333ea',  // Darker purple
          700: '#7c3aed',  // Dark purple - innovation
          800: '#6b21a8',  // Darker purple
          900: '#581c87',  // Darkest purple
        },
        precision: {
          50: '#ecfeff',   // Lightest teal
          100: '#cffafe',  // Very light teal
          200: '#a5f3fc',  // Light teal
          300: '#67e8f9',  // Medium light teal
          400: '#22d3ee',  // Medium teal
          500: '#06b6d4',  // Main teal - precision
          600: '#0891b2',  // Darker teal - clinical accuracy
          700: '#0e7490',  // Dark teal
          800: '#155e75',  // Darker teal
          900: '#164e63',  // Darkest teal
        },
        // Healing complement colors
        healing: {
          sage: '#87a96b',     // Calming sage green
          mint: '#98d8c8',     // Fresh mint accent
          ocean: '#4a90a4',    // Trustworthy blue-green
          earth: '#8b7355',    // Grounding earth tone
        },
        // Medical UI colors
        medical: {
          low: '#22c55e',      // Low risk - green
          borderline: '#eab308', // Borderline risk - yellow
          intermediate: '#f97316', // Intermediate risk - orange  
          high: '#ef4444',     // High risk - red
        },
        // Neutral grays with warm undertones
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        }
      },
      fontFamily: {
        // Healthcare typography system for medical authority and trust
        'medical-brand': ['Source Serif Pro', 'Georgia', 'serif'], // Primary headings, brand name
        'medical-heading': ['IBM Plex Sans', 'system-ui', 'sans-serif'], // Section headers, subheadings
        'medical-body': ['Source Sans Pro', 'system-ui', 'sans-serif'], // Body text, descriptions
        'medical-ui': ['Inter', 'system-ui', 'sans-serif'], // UI elements, buttons, forms
        // Legacy support (gradually phase out)
        sans: ['Source Sans Pro', 'system-ui', 'sans-serif'],
        serif: ['Source Serif Pro', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        // Enhanced medical typography scale for healthcare applications
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }], // Fine print, disclaimers
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }], // Supporting text, labels
        'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }], // Body text
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }], // Emphasis text
        'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.02em' }], // Subheadings
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.025em' }], // Section headings
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.035em' }], // Page headings
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.04em' }], // Hero headings
        '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.045em' }], // Display headings
        '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.05em' }], // Brand/hero text
        // Medical-specific text sizes
        'medical-brand': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }], // Brand typography
        'medical-heading': ['1.5rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }], // Medical headings
        'medical-body': ['1rem', { lineHeight: '1.6', letterSpacing: '0' }], // Medical content
        'medical-caption': ['0.875rem', { lineHeight: '1.4', letterSpacing: '0.01em' }], // Medical captions
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'medical': '0 4px 6px -1px rgba(34, 197, 94, 0.1), 0 2px 4px -1px rgba(34, 197, 94, 0.06)',
        'trust': '0 10px 15px -3px rgba(34, 197, 94, 0.1), 0 4px 6px -2px rgba(34, 197, 94, 0.05)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}