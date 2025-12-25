/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                'grand': ['GrandSlang-Roman', 'serif'],
                'montserrat': ['Montserrat', 'sans-serif'], // Added Montserrat
                'sans': ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
                'serif': ['GrandSlang-Roman', 'serif'],
            },
            colors: {
                'cream': '#f5f1e8',
                'cream-text': '#ECE7C1',
                'dark-bg': '#0a0a0a',
                'dark-text': '#e8e8e8',
            },
            fontSize: {
                'grand-title': ['128px', { lineHeight: '1.0' }],
            },
        },
    },
    plugins: [],
}
