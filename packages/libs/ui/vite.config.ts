import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import vuePlugin from '@vitejs/plugin-vue';
import { externalizeDeps } from 'vite-plugin-externalize-deps';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts(), vuePlugin(), externalizeDeps(), tsconfigPaths({ ignoreConfigErrors: true })],
  server: {
    port: 3000,
  },
  assetsInclude: ['**/*.svg'],
  resolve: {
    alias: [{ find: /^@(?=\/)/, replacement: resolve(__dirname, './src') }],
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'lyvelyUi',
      fileName: 'lyvely-ui',
      formats: ['es'],
    },
  },
});
