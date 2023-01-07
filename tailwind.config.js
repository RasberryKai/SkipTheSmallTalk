/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    normal: "#333762",
                    dark: "#272a45",
                    light: "#4d527b",
                    gray: "#6d75b1",
                },
                gray: "#1a1c1e",
                actionable: "#1174f6",
                purple: "#794de2",
                errorPage: "#d75032",
                hoveredWhite: "#f1f1f1",
                softRed: "#e12727",
                red: "#FF0000",
                lightBlue: "#3398cd",
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
