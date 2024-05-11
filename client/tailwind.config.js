/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        // Simple 16 column grid
        '50': 'repeat(50, minmax(0, 1fr))',

        // Complex site-specific column configuration
        'footer': '200px minmax(900px, 1fr) 100px',
      },
      colors:{
        'heading':'#FFFCE1',
        'dark-head': "#FF8709",
        'text1': "#00BAE2",
        'background': '#0E100F',
        'border':'#42433D',
        'first': '#1e1f22',
        'second': '#2b2d31',
        'third': '#313338',
        'message-bar': '#383a40',
        'loginbutton': '#5865f2',
        'loginbuttonhover': '#4752c4',
        'text-one': '#b0b5bb',
        'text-two': '#f2f3f5',
        'text-three': "#b5bac1",
        'forgotbutton': '#00a8fc',
        'inputfield': '#e8f0fe',
        'homegreen': '#23a559',
        "icons": "#7e8288",
      },
      fontFamily:{
        'm':["M PLUS 1", "sans-serif"],
        'pt': ["PT Sans","sans-serif"],
      }
    },
  },
  plugins: [],
}