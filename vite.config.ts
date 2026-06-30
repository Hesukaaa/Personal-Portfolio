import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const apiPort = 3001;

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  base: isProduction ? '/Personal-Portfolio/' : '/',

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