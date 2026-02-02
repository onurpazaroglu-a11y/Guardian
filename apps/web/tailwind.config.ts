import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: ['class'],
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                border: 'rgba(255, 255, 255, 0.1)',
                input: 'rgba(255, 255, 255, 0.05)',
                ring: '#b666d2',
                background: '#09090b', // Zinc 950 - Deep Dark
                foreground: '#fafafa', // Zinc 50
                primary: {
                    DEFAULT: '#7c3aed', // Violet 600
                    foreground: '#ffffff',
                },
                secondary: {
                    DEFAULT: '#27272a', // Zinc 800
                    foreground: '#fafafa',
                },
                destructive: {
                    DEFAULT: '#ef4444', // Red 500
                    foreground: '#ffffff',
                },
                muted: {
                    DEFAULT: '#27272a', // Zinc 800
                    foreground: '#a1a1aa', // Zinc 400
                },
                accent: {
                    DEFAULT: '#27272a', // Zinc 800
                    foreground: '#fafafa',
                },
                popover: {
                    DEFAULT: '#09090b',
                    foreground: '#fafafa',
                },
                card: {
                    DEFAULT: 'rgba(9, 9, 11, 0.6)', // Glassy Dark
                    foreground: '#fafafa',
                },
                // Custom Status Colors
                success: '#10b981', // Emerald 500
                warning: '#f59e0b', // Amber 500
                danger: '#ef4444', // Red 500
                info: '#3b82f6', // Blue 500
            },
            borderRadius: {
                lg: '1rem',
                md: '0.75rem',
                sm: '0.5rem',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                shimmer: {
                    '100%': {
                        transform: 'translateX(100%)',
                    },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'shimmer': 'shimmer 2s infinite',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            }
        },
    },
    plugins: [],
};

export default config;