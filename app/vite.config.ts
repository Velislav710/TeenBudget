import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    fs: {
      strict: false,
    },
  },
  build: {
    chunkSizeWarningLimit: 50000,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
