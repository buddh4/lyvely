import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import vuePlugin from '@vitejs/plugin-vue';
import { externalizeDeps } from 'vite-plugin-externalize-deps'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import { resolve } from 'path';
import { sync } from 'glob';

export default defineConfig({
  plugins: [
    externalizeDeps(),
    vuePlugin(),
    tsconfigPaths({ ignoreConfigErrors: true }),
    VueI18nPlugin({
      /* options */
      // locale messages resource pre-compile option
      include: [
          resolve(__dirname, './locales/**')
      ],
  }),],
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
      name: 'LyvelyWeb',
      fileName: 'lyvely-web',
      formats: ['es'],
    },
    rollupOptions: {
      input: sync(resolve(__dirname, 'src/**/*.{ts,css,svg,png}')),
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: ({ name: fileName }) => {
          return `${fileName}.js`;
        },
      },
    },
  },
});
