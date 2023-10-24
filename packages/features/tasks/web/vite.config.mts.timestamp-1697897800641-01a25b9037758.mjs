// vite.config.mts
import { defineConfig } from "file:///home/buddha/codebase/projects/lyvely/app/node_modules/vite/dist/node/index.js";
import tsconfigPaths from "file:///home/buddha/codebase/projects/lyvely/app/node_modules/vite-tsconfig-paths/dist/index.mjs";
import vuePlugin from "file:///home/buddha/codebase/projects/lyvely/app/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { externalizeDeps } from "file:///home/buddha/codebase/projects/lyvely/app/node_modules/vite-plugin-externalize-deps/dist/index.js";
import VueI18nPlugin from "file:///home/buddha/codebase/projects/lyvely/app/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
import { resolve } from "path";
import { sync } from "file:///home/buddha/codebase/projects/lyvely/app/node_modules/glob/dist/mjs/index.js";
var __vite_injected_original_dirname = "/home/buddha/codebase/projects/lyvely/app/packages/features/tasks/web";
var vite_config_default = defineConfig({
  plugins: [
    externalizeDeps(),
    vuePlugin(),
    tsconfigPaths({ ignoreConfigErrors: true }),
    VueI18nPlugin({
      /* options */
      // locale messages resource pre-compile option
      include: [
        resolve(__vite_injected_original_dirname, "./locales/**")
      ]
    })
  ],
  server: {
    port: 3e3
  },
  assetsInclude: ["**/*.svg"],
  resolve: {
    alias: [{ find: /^@(?=\/)/, replacement: resolve(__vite_injected_original_dirname, "./src") }]
  },
  build: {
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "LyvelyWeb",
      fileName: "lyvely-web",
      formats: ["es"]
    },
    rollupOptions: {
      input: sync(resolve(__vite_injected_original_dirname, "src/**/*.{ts,css,svg,png}")),
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: ({ name: fileName }) => {
          return `${fileName}.js`;
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvYnVkZGhhL2NvZGViYXNlL3Byb2plY3RzL2x5dmVseS9hcHAvcGFja2FnZXMvZmVhdHVyZXMvdGFza3Mvd2ViXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9idWRkaGEvY29kZWJhc2UvcHJvamVjdHMvbHl2ZWx5L2FwcC9wYWNrYWdlcy9mZWF0dXJlcy90YXNrcy93ZWIvdml0ZS5jb25maWcubXRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2J1ZGRoYS9jb2RlYmFzZS9wcm9qZWN0cy9seXZlbHkvYXBwL3BhY2thZ2VzL2ZlYXR1cmVzL3Rhc2tzL3dlYi92aXRlLmNvbmZpZy5tdHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gJ3ZpdGUtdHNjb25maWctcGF0aHMnO1xuaW1wb3J0IHZ1ZVBsdWdpbiBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnO1xuaW1wb3J0IHsgZXh0ZXJuYWxpemVEZXBzIH0gZnJvbSAndml0ZS1wbHVnaW4tZXh0ZXJuYWxpemUtZGVwcydcbmltcG9ydCBWdWVJMThuUGx1Z2luIGZyb20gJ0BpbnRsaWZ5L3VucGx1Z2luLXZ1ZS1pMThuL3ZpdGUnO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgc3luYyB9IGZyb20gJ2dsb2InO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgZXh0ZXJuYWxpemVEZXBzKCksXG4gICAgdnVlUGx1Z2luKCksXG4gICAgdHNjb25maWdQYXRocyh7IGlnbm9yZUNvbmZpZ0Vycm9yczogdHJ1ZSB9KSxcbiAgICBWdWVJMThuUGx1Z2luKHtcbiAgICAgIC8qIG9wdGlvbnMgKi9cbiAgICAgIC8vIGxvY2FsZSBtZXNzYWdlcyByZXNvdXJjZSBwcmUtY29tcGlsZSBvcHRpb25cbiAgICAgIGluY2x1ZGU6IFtcbiAgICAgICAgICByZXNvbHZlKF9fZGlybmFtZSwgJy4vbG9jYWxlcy8qKicpXG4gICAgICBdLFxuICB9KSxdLFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiAzMDAwLFxuICB9LFxuICBhc3NldHNJbmNsdWRlOiBbJyoqLyouc3ZnJ10sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczogW3sgZmluZDogL15AKD89XFwvKS8sIHJlcGxhY2VtZW50OiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJykgfV0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvaW5kZXgudHMnKSxcbiAgICAgIG5hbWU6ICdMeXZlbHlXZWInLFxuICAgICAgZmlsZU5hbWU6ICdseXZlbHktd2ViJyxcbiAgICAgIGZvcm1hdHM6IFsnZXMnXSxcbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGlucHV0OiBzeW5jKHJlc29sdmUoX19kaXJuYW1lLCAnc3JjLyoqLyoue3RzLGNzcyxzdmcscG5nfScpKSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBwcmVzZXJ2ZU1vZHVsZXM6IHRydWUsXG4gICAgICAgIHByZXNlcnZlTW9kdWxlc1Jvb3Q6ICdzcmMnLFxuICAgICAgICBlbnRyeUZpbGVOYW1lczogKHsgbmFtZTogZmlsZU5hbWUgfSkgPT4ge1xuICAgICAgICAgIHJldHVybiBgJHtmaWxlTmFtZX0uanNgO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW1ZLFNBQVMsb0JBQW9CO0FBQ2hhLE9BQU8sbUJBQW1CO0FBQzFCLE9BQU8sZUFBZTtBQUN0QixTQUFTLHVCQUF1QjtBQUNoQyxPQUFPLG1CQUFtQjtBQUMxQixTQUFTLGVBQWU7QUFDeEIsU0FBUyxZQUFZO0FBTnJCLElBQU0sbUNBQW1DO0FBUXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLGdCQUFnQjtBQUFBLElBQ2hCLFVBQVU7QUFBQSxJQUNWLGNBQWMsRUFBRSxvQkFBb0IsS0FBSyxDQUFDO0FBQUEsSUFDMUMsY0FBYztBQUFBO0FBQUE7QUFBQSxNQUdaLFNBQVM7QUFBQSxRQUNMLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQ3JDO0FBQUEsSUFDSixDQUFDO0FBQUEsRUFBRTtBQUFBLEVBQ0gsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLGVBQWUsQ0FBQyxVQUFVO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsT0FBTyxDQUFDLEVBQUUsTUFBTSxZQUFZLGFBQWEsUUFBUSxrQ0FBVyxPQUFPLEVBQUUsQ0FBQztBQUFBLEVBQ3hFO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxLQUFLO0FBQUEsTUFDSCxPQUFPLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQ3hDLE1BQU07QUFBQSxNQUNOLFVBQVU7QUFBQSxNQUNWLFNBQVMsQ0FBQyxJQUFJO0FBQUEsSUFDaEI7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLE9BQU8sS0FBSyxRQUFRLGtDQUFXLDJCQUEyQixDQUFDO0FBQUEsTUFDM0QsUUFBUTtBQUFBLFFBQ04saUJBQWlCO0FBQUEsUUFDakIscUJBQXFCO0FBQUEsUUFDckIsZ0JBQWdCLENBQUMsRUFBRSxNQUFNLFNBQVMsTUFBTTtBQUN0QyxpQkFBTyxHQUFHLFFBQVE7QUFBQSxRQUNwQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
