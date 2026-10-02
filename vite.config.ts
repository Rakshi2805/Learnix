import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { viteTutorPlugin } from './src/server/viteTutorPlugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteTutorPlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
