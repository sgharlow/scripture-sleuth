/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx}",
    "./webroot/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        // Scripture theme - parchment/biblical palette
        scripture: {
          bg: '#faf3e3',         // Parchment background
          card: '#f5ebe0',       // Cream card background
          cardHover: '#efe5d8',  // Card hover state
          border: '#d4c4a8',     // Warm borders
        },
        // Accent colors
        burgundy: {
          DEFAULT: '#722f37',   // Primary burgundy
          dark: '#5a252c',      // Darker for hover/emphasis
          light: '#8b3d47',     // Lighter variant
        },
        gold: {
          DEFAULT: '#c9a227',   // Gold accent
          dark: '#a88820',      // Darker gold
          light: '#dab82f',     // Lighter gold
        },
        // Feedback colors
        correct: '#46D160',     // Success green
        incorrect: '#FF4B4B',   // Error red
        fake: '#722f37',        // Burgundy for fake reveal (was 'ai' purple)
        // Text colors for light theme
        textPrimary: '#3d2c29',   // Dark brown primary text
        textSecondary: '#6b5c58', // Brown secondary text
        textMuted: '#8b7d79',     // Muted text
        textVerse: '#2d1f1c',     // Dark text for verses
      },
      fontFamily: {
        verse: ['Georgia', 'Garamond', 'serif'],
        display: ['Georgia', 'serif'],
      },
      boxShadow: {
        'selected': '0 0 20px rgba(201, 162, 39, 0.4)',   // Gold glow for selection
        'correct': '0 0 20px rgba(70, 209, 96, 0.4)',
        'fake': '0 0 20px rgba(114, 47, 55, 0.4)',        // Burgundy glow for fake
      },
      backgroundImage: {
        'parchment': "url('data:image/svg+xml,...')",  // Optional: subtle paper texture
      },
    },
  },
  plugins: [],
}
