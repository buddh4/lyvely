import { useViteWebConfig } from '@lyvely/devtools'
import { defineConfig } from "vite";

export default defineConfig(useViteWebConfig({
  dirname: __dirname
}));
