/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                police: {
                    navy: "#001B3D", // Deeper, more royal navy
                    blue: "#0F4C81", // Classic Blue (Pantone 2020)
                    gold: "#D4AF37", // Genuine Metallic Gold
                    accent: "#C5A059", // Soft Gold/Bronze
                    lightBlue: "#F0F7FF",
                    sos: "#DC2626",
                    success: "#059669",
                    gray: "#94A3B8",
                    dark: "#0F172A",
                },
            },
            borderRadius: {
                '3xl': '24px',
                '4xl': '32px',
            }
        },
    },
    plugins: [],
}
