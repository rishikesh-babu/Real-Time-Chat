import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                glass: "rgba(255, 255, 255, 0.1)",
                "glass-dark": "rgba(0, 0, 0, 0.2)",
            },
            backdropBlur: {
                xs: "2px",
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-up': 'slideUp 0.4s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [
        daisyui,
        function({ addUtilities }) {
            addUtilities({
                '.glassmorphism': {
                    'background': 'rgba(255, 255, 255, 0.05)',
                    'backdrop-filter': 'blur(10px)',
                    'border': '1px solid rgba(255, 255, 255, 0.1)',
                },
                '.glassmorphism-dark': {
                    'background': 'rgba(0, 0, 0, 0.2)',
                    'backdrop-filter': 'blur(10px)',
                    'border': '1px solid rgba(255, 255, 255, 0.05)',
                },
                '.custom-scrollbar': {
                    '&::-webkit-scrollbar': {
                        'width': '5px',
                    },
                    '&::-webkit-scrollbar-track': {
                        'background': 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        'background': 'rgba(255, 255, 255, 0.1)',
                        'border-radius': '10px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        'background': 'rgba(255, 255, 255, 0.2)',
                    },
                },
            })
        }
    ],
    daisyui: {
        themes: ["light", "dark", "cupcake"],
    },
    darkMode: ['selector', '[data-theme="dark"]'],
}