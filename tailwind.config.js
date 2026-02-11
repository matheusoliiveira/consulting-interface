/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#3b82f6',
          secondary: '#6366f1',
        },
        back: {
          light: '#f8fafc',
          dark: '#020617',
        },
        front: {
          light: '#ffffff',
          dark: '#0f172a',
        },
        line: {
          light: '#e2e8f0',
          dark: '#1e293b',
        }
      }
    },
  },
}