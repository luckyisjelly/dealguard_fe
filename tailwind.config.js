/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Pretendard', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#111827',
        muted: '#6b7280',
      },
      boxShadow: {
        soft: '0 8px 28px rgba(15, 23, 42, 0.04)',
      },
    },
  },
  plugins: [],
}
