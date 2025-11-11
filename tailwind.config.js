/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class", // Habilita dark mode con clase 'dark'
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "#e3f2fd",
                    100: "#bbdefb",
                    200: "#90caf9",
                    300: "#64b5f6",
                    400: "#42a5f5",
                    500: "#2196f3",
                    600: "#1e88e5",
                    700: "#1976d2",
                    800: "#1565c0",
                    900: "#0d47a1",
                },
                success: {
                    light: "#81c784",
                    main: "#4caf50",
                    dark: "#388e3c",
                },
                warning: {
                    light: "#ffb74d",
                    main: "#ff9800",
                    dark: "#f57c00",
                },
                error: {
                    light: "#e57373",
                    main: "#f44336",
                    dark: "#d32f2f",
                },
                critical: {
                    light: "#ef5350",
                    main: "#c62828",
                    dark: "#b71c1c",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
            },
            boxShadow: {
                card: "0 2px 8px rgba(0, 0, 0, 0.1)",
                "card-hover": "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
        },
    },
    plugins: [],
};
