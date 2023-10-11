import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import vuePlugin from '@vitejs/plugin-vue';
import { externalizeDeps } from 'vite-plugin-externalize-deps';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import { resolve } from 'path';
import { sync } from 'glob';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    tsconfigPaths({ ignoreConfigErrors: true }),
    vuePlugin(),
    externalizeDeps({ include: ['virtual:pwa-register/vue'] }),
    VueI18nPlugin({
      /* options */
      // locale messages resource pre-compile option
      include: [resolve(__dirname, './locales/**')],
    }),
    VitePWA({
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'safari-pinned-tab.svg'],
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'prompt',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'lyvely',
        short_name: 'lyvely',
        description: 'lyvely PWA',
        theme_color: '#1f2937',
        icons: [
          {
            src: 'android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html',
      },
    }),
  ],
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
