import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    // Phase 2.1 D-05: register vite-imagetools for ?w=...&format=webp;png&as=picture query-string imports
    // exclude:'' overrides the default exclude:'public/**/*' so imagetools processes
    // static imports that resolve into the public/ directory (Rule 3 fix — otherwise
    // the plugin passes public/ files through as raw URL strings).
    imagetools({ exclude: '' }),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  // SPA fallback: all routes serve index.html in dev
  server: {
    historyApiFallback: true,
  },
})
