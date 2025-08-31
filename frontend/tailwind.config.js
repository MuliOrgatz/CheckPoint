/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,tsx}'],
  prefix: '',
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#FFFFFF',
        green: '#388084',
        'dark-green': '#004F59',
        gray: '#F2F2F2',
        'gray-text': '#646567',
        lime: '#c4d600',
        turquoise: '#388084',
        darkTurquoise: '#05143e',
        'light-turquoise-1': '#6fc2b4',
        'light-turquoise-2': '#9dd4cf',
        'extra-light-turquoise': '#d8eeec',
        red: '#EE5454',
        blue: '#1D4ED8',
        darkBlue: '#1E3A8A',
        background: '#FFFFFF',
        foreground: '#000000',
        border: '#d1d5db',
        input: '#4E4C4C',
        'checkbox-border': '#C4C4C4',
        ring: '#05143e',
        primary: {
          DEFAULT: '#05143e',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#d9ebfc',
          foreground: '#000000',
        },
        destructive: {
          DEFAULT: '#EE5454',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#4E4C4C',
          foreground: '#4E4C4C',
        },
        accent: {
          DEFAULT: '#388084',
          foreground: '#FFFFFF',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#000000',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#000000',
        },
        disabled: {
          DEFAULT: '#B2B2B2',
          foreground: '#858585',
        },
      },
      fontFamily: {
        sans: ['Rubik', 'system-ui'],
      },
      fontSize: {
        base: ['14px', '24px'],
        sm: ['13px', '24px'],
        lg: ['16px', '24px'],
        xl: ['24px', '24px'],
        '2xl': ['40px', '24px'],
        '3xl': ['45px', '24px'],
      },
      fontWeight: {
        normal: '400',
        semibold: '600',
        bold: '800',
      },
    },
  },
  plugins: [],
};
