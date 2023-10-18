import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import vuePlugin from '@vitejs/plugin-vue';
import { externalizeDeps } from 'vite-plugin-externalize-deps'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import { resolve } from 'path';
import { sync } from 'glob';

export function myPlugin() {
  const virtualModuleId = 'virtual:pwa-register/vue'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'my-plugin', // required, will show up in warnings and errors
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `
        export const useRegisterSW = () => {
          return {
            offlineReady: { value: false },            
            needRefresh: { value: false },    
            updateServiceWorker: () => {},        
          }
        };
      
        `
      }
    },
  }
}

export default defineConfig({
  plugins: [
    tsconfigPaths({ ignoreConfigErrors: true }),
    externalizeDeps({ include: ['virtual:pwa-register/vue'] }),
    myPlugin(),
    vuePlugin(),
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
      name: 'lyvely-habits',
      fileName: 'lyvely-habits',
      formats: ['es'],
    },
    rollupOptions: {
      input: sync(resolve(__dirname, 'src/**/*.{ts,css,svg,png}')),
      output: {
        external: ['virtual:pwa-register/vue'],
        globals: {'virtual:pwa-register/vue': 'pwa'} ,
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: ({ name: fileName }) => {
          return `${fileName}.js`;
        },
      },
    },
  },
});
