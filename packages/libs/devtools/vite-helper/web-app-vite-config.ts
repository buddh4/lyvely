import { Plugin } from 'vite';
import { externalizeDeps } from 'vite-plugin-externalize-deps';
import vuePlugin from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import { resolve } from 'path';
import { sync } from 'glob';

interface IOptions {
  locales?: string | boolean;
  input?: string[];
  plugins?: Plugin[];
}

const tsconfigPathDefault: (options: any) => Plugin = !!(<any>tsconfigPaths).default
  ? (<any>tsconfigPaths).default
  : tsconfigPaths;

export const useViteWebAppConfig = (options: IOptions) => {
  const __dirname = process.cwd();

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
            __dirname,
            typeof options.locales === 'string' ? <string>options.locales! : './locales/**'
          ),
        ],
      }) as Plugin
    );
  }

  const input = options.input || sync(resolve(__dirname, 'src/**/*.ts'));

  /// <reference types="vitest" />
  return {
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
      alias: [{ find: /^@(?=\/)/, replacement: resolve(__dirname, './src') }],
    },
    build: {
      /* rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          ...input,
        },
      },*/
    },
  };
};
