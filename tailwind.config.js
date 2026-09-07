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
                // Bricolage Grotesque as the universal typeface
                'sans':      ['"Bricolage Grotesque"', 'sans-serif'],
                'bricolage': ['"Bricolage Grotesque"', 'sans-serif'],
                // Keep fraunces alias pointing to Bricolage so existing classes still work
                'fraunces':  ['"Bricolage Grotesque"', 'sans-serif'],
                'mono':      ['"Bricolage Grotesque"', 'monospace'],
                'general':   ['"Bricolage Grotesque"', 'sans-serif'],
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
