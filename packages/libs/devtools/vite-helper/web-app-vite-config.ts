import { Plugin } from 'vite';
import vuePlugin from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import { resolve } from 'path';
import { sync } from 'glob';

interface IOptions {
  locales?: string | boolean;
  input?: string[];
  plugins?: Plugin[];
  minify?: boolean;
}

const tsconfigPathDefault: (options: any) => Plugin = !!(<any>tsconfigPaths).default
  ? (<any>tsconfigPaths).default
  : tsconfigPaths;

export const useViteWebAppConfig = (options: IOptions) => {
  const cwd = process.cwd();

  options = { locales: true, ...options };

  const plugins = [
    vuePlugin(),
    tsconfigPathDefault({ ignoreConfigErrors: true }),
    ...(options.plugins || []),
  ];

  if (options.locales) {
    plugins.push(
      VueI18nPlugin({
        /* options */
        // locale messages resource pre-compile option
        include: [
          resolve(
            cwd,
            typeof options.locales === 'string' ? options.locales : './locales/**'
          ),
          resolve(
            cwd,
            typeof options.locales === 'string' ? options.locales : './src/**/locales/**'
          ),
        ],
      }) as Plugin
    );
  }

  const input = options.input || sync(resolve(cwd, 'src/**/*.ts'));

  /// <reference types="vitest" />
  return {
    define: {
      //'__VUE_OPTIONS_API__': false
    },
    plugins,
    server: {
      host: '127.0.0.1',
      port: 3000,
      //  hmr: process.env.NODE_ENV !== 'e2e'
    },
    test: {
      setupFiles: ['vitest.setup.ts'],
      environment: 'jsdom',
    },
    assetsInclude: ['**/*.svg', '**/*.png'],
    resolve: {
      alias: [
        { find: /^@(?=\/)/, replacement: resolve(cwd, './src') },
        // This will exclude the phonenumber-js lib which is huge and currently not in use
        { find: 'libphonenumber-js/max', replacement: '@lyvely/devtools/vite-helper/libphonenumber-stub' }
      ],
    },
    build: {
      // Note this value should be aligned with the PWAs maximumFileSizeToCacheInBytes
      chunkSizeWarningLimit: 750,
      minify: options.minify ?? true,
      rollupOptions: {
        output: {
          manualChunks: {
            '@lyvely/ui': ['@lyvely/ui'],
            'vue': ['vue']
          },
        },
      },
    },
  };
};
