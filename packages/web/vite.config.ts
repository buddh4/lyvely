import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import vuePlugin from "@vitejs/plugin-vue";
import path from 'path';

export default defineConfig({
    plugins: [vuePlugin(), tsconfigPaths()],
    resolve: {
        alias: [
            { find: /^@(?=\/)/, replacement: path.resolve(__dirname, './src') },
        ],
    },
})