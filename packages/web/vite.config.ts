import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import vuePlugin from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vuePlugin(), tsconfigPaths()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: [{ find: /^@(?=\/)/, replacement: resolve(__dirname, './src') }],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {},
      },
    },
  },
});
