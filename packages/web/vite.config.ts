import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import vuePlugin from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vuePlugin(), tsconfigPaths()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: [
      { find: /^@(?=\/)/, replacement: path.resolve(__dirname, "./src") },
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          /*'activities': [
            './src/modules/activity/views/ActivityLayout.vue',
            './src/modules/activity/views/HabitPlanView.vue',
            './src/modules/activity/views/TaskPlanView.vue',
          ]*/
        },
      },
    },
  },
});
