/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./views/**/*.ejs', './src/**/*.js', './public/js/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'Georgia', 'serif'],
        sans: ['"Instrument Sans"', '"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        paper:  { DEFAULT: '#F7F4ED', raised: '#FFFDF8', sunk: '#EFEADF' },
        ink:    { DEFAULT: '#101A18', soft: '#3C4A47', mute: '#6B7976' },
        noche:  { DEFAULT: '#0E1614', raised: '#161F1D', sunk: '#0A100F' },
        paramo: { 50:'#E7F5F1', 100:'#C4E8DF', 300:'#5FC3AC', 500:'#0A8F73', 600:'#0A6B58', 700:'#084F42', 900:'#05302A' },
        carnaval:{ 300:'#F5B970', 500:'#D96A0B', 600:'#B45408', 700:'#8A3F06' },
        galeras: { 500:'#2C74D6', 600:'#1F5AAC' },
        chiva:   { 500:'#C13A6E', 600:'#9E2C58' },
        lienzo:  { 500:'#7A5AD6' },
        rio:     { 500:'#12A2C4' },
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(16,26,24,.06), 0 12px 32px -18px rgba(16,26,24,.45)',
        lift: '0 2px 0 0 rgba(16,26,24,.08), 0 28px 60px -28px rgba(16,26,24,.55)',
        signage: 'inset 0 0 0 1px rgba(255,255,255,.14), 0 10px 24px -14px rgba(0,0,0,.6)',
      },
      backgroundImage: {
        'stripe-signage': 'repeating-linear-gradient(135deg, rgba(217,106,11,.18) 0 10px, transparent 10px 20px)',
        'grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        'rise': { '0%': { opacity: '0', transform: 'translateY(14px)' }, '100%': { opacity: '1', transform: 'none' } },
        'ticker': { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        'pulse-dot': { '0%,100%': { opacity: '1', transform: 'scale(1)' }, '50%': { opacity: '.35', transform: 'scale(1.6)' } },
      },
      animation: {
        rise: 'rise .7s cubic-bezier(.22,1,.36,1) both',
        ticker: 'ticker 38s linear infinite',
        'pulse-dot': 'pulse-dot 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
