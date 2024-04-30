import { Plugin } from 'vite';
import { externalizeDeps } from 'vite-plugin-externalize-deps';
import vuePlugin from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import { resolve } from 'path';
import { sync } from 'glob';
import dts from 'vite-plugin-dts';

interface IOptions {
  locales?: string | boolean;
  input?: string[];
}

const tsconfigPathDefault: (options: any) => Plugin = !!(<any>tsconfigPaths).default
  ? (<any>tsconfigPaths).default
  : tsconfigPaths;

const dtsDefault: (options: any) => Plugin = !!(<any>dts).default ? (<any>dts).default : dts;

export const useViteWebConfig = (options: IOptions) => {
  const __dirname = process.cwd();

  options = { locales: true, ...options };

  const plugins = [
    externalizeDeps({ devDeps: true }),
    vuePlugin(),
    dtsDefault({
      tsconfigPath: './tsconfig.build.json',
    }),
    tsconfigPathDefault({ ignoreConfigErrors: true }),
  ];

  if (options.locales) {
    plugins.push(
      VueI18nPlugin({
        /* options */
        // locale messages resource pre-compile option
        include: [
          resolve(
            __dirname,
            typeof options.locales === 'string' ? <string>options.locales! : './locales/**',
          ),
        ],
      }) as Plugin,
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
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        formats: ['es'],
      },
      rollupOptions: {
        input,
        output: {
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: ({ name: fileName }: { name: string }) => {
            return `${fileName}.js`;
          },
        },
      },
    },
  };
};
