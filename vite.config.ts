import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'

export default defineConfig(({ isSsrBuild }) => ({
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

  // Phase 2.2: split vendor libraries into dedicated chunks so the browser can
  // (a) download them in parallel with the app chunk via Vite's auto-emitted modulepreload,
  // (b) cache them across deploys (vendor code changes far less often than app code).
  // Client build only — SSR build must emit a single file so prerender.mjs can import it.
  build: {
    rollupOptions: {
      output: isSsrBuild ? {} : {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router')) return 'vendor-router';
            if (id.includes('react-dom') || id.includes('scheduler') || id.includes('/react/')) return 'vendor-react';
            if (id.includes('lucide-react')) return 'vendor-lucide';
          }
        },
      },
    },
  },

  // SPA fallback: all routes serve index.html in dev
  server: {
    historyApiFallback: true,
  },
}))

