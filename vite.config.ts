import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Essential for GitHub Pages or serving from subpaths
  define: {
    // Shim process.env for the Google GenAI SDK usage pattern requested
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  }
});