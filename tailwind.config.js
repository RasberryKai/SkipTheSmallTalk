/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    normal: "#383c6e",
                    dark: "#2e345d",
                    darker: "#4d527b",
                    notAsDark: "#6d75b1",
                },
                gray: "#1a1c1e",
                actionable: "#197aff",
                errorPage: "#d75032",
                hoveredWhite: "#f1f1f1",
            },
            backgroundImage: {
                login: "url('/public/Login2.jpg')",
            },
            animation: {
                fade: "fadeIn 0.5s ease-in-out",
            },
            keyframes: () => ({
                fadeIn: {
                    "0%": { opacity: 0 },
                    "100%": { opacity: 1 },
                },
            }),
        },
    },
    plugins: [],
}
