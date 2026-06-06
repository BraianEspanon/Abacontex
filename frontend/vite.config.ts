import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
// https://vite.dev/config/
// vite.config.ts

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    watch: {
      usePolling: true,
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
  },
});
