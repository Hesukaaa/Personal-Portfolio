import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const apiPort = 3001;

export default defineConfig({
  base: '/Personal-Portfolio/',

  plugins: [
    react(),
  ],

  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${apiPort}`,
        changeOrigin: true,
      },
    },
  },
});