import { useViteWebLibConfig } from '@lyvely/devtools';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { useViteWebAppConfig } from "@lyvely/devtools";

export default defineConfig(
  useViteWebAppConfig({
    plugins: [
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
          handle_links: 'preferred',
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
  }),
);
