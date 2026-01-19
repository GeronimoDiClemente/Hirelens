/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                pastel: {
                    bg: '#F0F9FF', // Sky 50
                    card: '#FFFFFF',
                    primary: '#BAE6FD', // Sky 200
                    primaryHover: '#7DD3FC', // Sky 300
                    text: '#0C4A6E', // Sky 900
                    accent: '#E0F2FE', // Sky 100
                }
            }
        },
    },
    plugins: [],
}
