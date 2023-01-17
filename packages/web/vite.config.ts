import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import vuePlugin from '@vitejs/plugin-vue';
import { resolve, dirname } from 'path';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';

/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [
    vuePlugin(),
    tsconfigPaths(),
    VueI18nPlugin({
      /* options */
      // locale messages resource pre-compile option
      include: [
        resolve(__dirname, './locales/**'),
        resolve(__dirname, './src/modules/*/locales/**'),
      ],
    }),
  ],
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
