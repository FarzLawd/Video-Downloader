import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#4299E1',
          hover: '#3182CE',
          soft: '#BEE3F8',
        },
        accent: {
          yellow: '#F6AD55',
          'yellow-hover': '#ED8936',
          pink: '#F687B3',
          'pink-soft': '#FED7E2',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F7FAFC',
          muted: '#EDF2F7',
          border: '#CBD5E0',
          subtle: '#E2E8F0',
        },
        ink: {
          DEFAULT: '#1A202C',
          secondary: '#4A5568',
          muted: '#718096',
        },
        semantic: {
          success: '#38A169',
          'success-bg': '#F0FFF4',
          warning: '#D69E2E',
          'warning-bg': '#FFFFF0',
          error: '#E53E3E',
          'error-bg': '#FFF5F5',
          info: '#3182CE',
          'info-bg': '#EBF8FF',
        },
      },
      fontFamily: {
        display: ['var(--font-comfortaa)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-plex-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        mono: ['var(--font-plex-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '10px',
        xl: '14px',
        '2xl': '18px',
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0 0 #1A202C',
        brutal: '4px 4px 0 0 #1A202C',
        'brutal-md': '6px 6px 0 0 #1A202C',
        'brutal-brand': '4px 4px 0 0 #4299E1',
        'brutal-yellow': '4px 4px 0 0 #F6AD55',
        'brutal-pink': '4px 4px 0 0 #F687B3',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
 