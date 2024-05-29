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
  plugins?: Plugin[];
}

const tsconfigPathDefault: (options: any) => Plugin = !!(tsconfigPaths as any).default
  ? (tsconfigPaths as any).default
  : tsconfigPaths;

const dtsDefault: (options: any) => Plugin = !!(dts as any).default ? (dts as any).default : dts;

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
            typeof options.locales === 'string' ? options.locales! : './locales/**'
          ),
        ],
      }) as Plugin
    );
  }

  // main.ts imports tailwind.css, which we only want to import in dev environment and not in production build
  const ignore = process.env.NODE_ENV !== 'development' ? ['src/main.ts'] : [];

  const input = options.input || sync(resolve(__dirname, 'src/**/*.ts'), { ignore });

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
