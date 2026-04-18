module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        farm: {
          50: '#f0f7f0',
          100: '#dceee0',
          200: '#b8dcc0',
          300: '#95cba0',
          400: '#71ba80',
          500: '#2E7D32',  // Primary green
          600: '#2a6f2c',
          700: '#255c27',
          800: '#1f4920',
          900: '#193618',
        },
        leaf: {
          50: '#f5fdf4',
          100: '#e6fce0',
          300: '#66BB6A',  // Leaf green
          400: '#5ab05d',
          500: '#4da551',
        },
        harvest: {
          50: '#fffbf0',
          100: '#fff6e0',
          300: '#F9A825',  // Harvest yellow
          400: '#f7981f',
          500: '#f59018',
        },
        sand: {
          50: '#faf9f6',
          100: '#f5f3ed',
          200: '#eae8e0',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
