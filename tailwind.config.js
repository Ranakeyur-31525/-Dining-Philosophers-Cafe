export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        terracotta: {
          DEFAULT: '#A43716',
          container: '#C54F2C',
          hover: '#8c2e12',
          light: '#fdf2ee',
        },
        cafe: {
          bg: '#FEF8F5',
          surface: '#FFFFFF',
          border: '#E8DCD5',
          muted: '#F5EDE8',
        },
        status: {
          thinking: '#0051D5',
          hungry: '#E67E22',
          eating: '#006B2C',
          deadlock: '#BA1A1A',
          starvation: '#7B1FA2',
        },
        theme: {
          bg: 'var(--background)',
          surface: 'var(--surface)',
          primary: 'var(--primary)',
          primaryContainer: 'var(--primary-container)',
          text: 'var(--text)',
          textMuted: 'var(--text-muted)',
          error: 'var(--error)',
          success: 'var(--success)',
          secondary: 'var(--secondary)',
          border: 'var(--border)',
        }
      }
    },
  },
  plugins: [],
}

