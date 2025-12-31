import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
 

  theme: {
  extend: {
    colors: {
      course: {
        bg: "#E9D5FF",        // light lavender
        primary: "#7C3AED",   // purple
        secondary: "#9333EA",
        dark: "#111827",
        muted: "#6B7280",
        card: "#FFFFFF",
      },
    },
    borderRadius: {
      xl2: "1.25rem",
      xl3: "1.75rem",
    },
  },
}

})