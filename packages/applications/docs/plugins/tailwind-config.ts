import type {LoadContext, PluginOptions, Plugin} from "@docusaurus/types";
import postCssImport from "postcss-import";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export function tailwindPlugin(context: LoadContext, options: PluginOptions): Plugin | Promise<Plugin> {
  return {
    name: 'tailwind-plugin',
    configurePostCss(postcssOptions) {
      postcssOptions.plugins = [
        postCssImport,
        tailwindcss,
        autoprefixer,
      ];
      return postcssOptions;
    },
  };
}