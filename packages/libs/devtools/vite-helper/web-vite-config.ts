import { Plugin } from 'vite';
import { externalizeDeps } from 'vite-plugin-externalize-deps';
import vuePlugin from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import { resolve } from 'path';
import { sync } from 'glob';

interface IOptions {
  locales?: string | boolean;
  dirname: string;
  input?: string[];
}

const tsconfigPathDefault: (options: any) => Plugin = !!(<any>tsconfigPaths).default
  ? (<any>tsconfigPaths).default
  : tsconfigPaths;

export const useViteWebConfig = (options: IOptions) => {
  const { dirname } = options;
  options = { locales: true, ...options };

  const plugins = [
    externalizeDeps(),
    vuePlugin(),
    tsconfigPathDefault({ ignoreConfigErrors: true }),
  ];

  if (options.locales) {
    plugins.push(
      VueI18nPlugin({
        /* options */
        // locale messages resource pre-compile option
        include: [
          resolve(dirname, typeof options.locales === 'string' ? options.locales : './locales/**'),
        ],
      }) as Plugin,
    );
  }

  const input =
    options.input ||
    sync(resolve(dirname, 'src/**/*.{ts,css,svg,png}'), {
      ignore: 'src/styles/tailwind.css',
    });

  return {
    plugins,
    server: {
      port: 3000,
    },
    assetsInclude: ['**/*.svg'],
    resolve: {
      alias: [{ find: /^@(?=\/)/, replacement: resolve(dirname, './src') }],
    },
    build: {
      lib: {
        entry: resolve(dirname, 'src/index.ts'),
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
