import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      sans: ['var(--font-sans)', 'sans-serif'],
      serif: ['var(--font-serif)', 'serif'],
      mono: ['var(--font-mono)', 'monospace'],
    },
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'border-color-cycle': {
          '0%, 100%': { 'border-color': 'hsl(var(--primary))' }, 
          '33%': { 'border-color': 'hsl(var(--accent))' }, 
          '66%': { 'border-color': 'hsl(var(--primary))' }, 
        },
        'flash': {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' },
        },
        'fade-in-up': {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'logo-blink-glow': {
          '0%, 100%': {
            opacity: '0.7',
            filter: 'drop-shadow(0 0 5px hsl(var(--primary) / 0.4))'
          },
          '50%': {
            opacity: '1',
            filter: 'drop-shadow(0 0 15px hsl(var(--primary) / 0.7))'
          },
        },
        'text-shine': {
          'from': { 'background-position': '0% center' },
          'to': { 'background-position': '-200% center' },
        },
        'scroll-left': {
          'from': { transform: 'translateX(0)' },
          'to': { transform: 'translateX(calc(-50% - 0.75rem))' },
        },
        'scroll-right': {
          'from': { transform: 'translateX(calc(-50% - 0.75rem))' },
          'to': { transform: 'translateX(0)' },
        },
        'biometric-scan': {
          '0%': { transform: 'translateY(-20%)', opacity: '0' },
          '20%, 80%': { transform: 'translateY(288px)', opacity: '1' },
          '100%': { transform: 'translateY(300px)', opacity: '0' },
        },
        'slow-pulse': {
          '0%, 100%': {
            'box-shadow': '0 0 0 0 hsl(var(--primary) / 0.0)',
          },
          '50%': {
            'box-shadow': '0 0 20px 5px hsl(var(--primary) / 0.4)',
          },
        },
        'text-glow': {
          '0%, 100%': { 
            'text-shadow': '0 0 5px hsl(var(--primary) / 0.5), 0 0 10px hsl(var(--primary) / 0.3), 0 0 15px hsl(var(--primary) / 0.2)',
          },
          '50%': { 
            'text-shadow': '0 0 10px hsl(var(--primary) / 0.7), 0 0 20px hsl(var(--primary) / 0.5), 0 0 30px hsl(var(--primary) / 0.3)',
           },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'spin': 'spin 1.5s linear infinite',
        'border-color-cycle': 'border-color-cycle 4s linear infinite',
        'flash': 'flash 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'logo-blink-glow': 'logo-blink-glow 5s ease-in-out infinite',
        'text-shine': 'text-shine 3s linear infinite',
        'scroll-left': 'scroll-left var(--animation-duration) linear infinite',
        'scroll-right': 'scroll-right var(--animation-duration) linear infinite',
        'biometric-scan': 'biometric-scan 3s ease-in-out infinite',
        'slow-pulse': 'slow-pulse 4s ease-in-out infinite',
        'text-glow': 'text-glow 3s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
