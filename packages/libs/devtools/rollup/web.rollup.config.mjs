import vue from 'rollup-plugin-vue';
import { nodeExternals } from 'rollup-plugin-node-externals';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';

export default async (options) => {
  options ||= {};
  const nodeExternalsOptions = options.nodeExternals || { devDeps: true };
  delete options.nodeExternals;

  return Object.assign(
    {
      input: 'src/index.js', // Path to your library's entry file
      output: [
        {
          file: 'dist/my-library.min.js', // Output file for the minified version
          format: 'umd', // Universal Module Definition (UMD)
          name: 'MyLibrary', // Replace with your library's name
          globals: {
            vue: 'Vue', // If your library depends on Vue, specify it here
          },
        },
      ],
      plugins: [
        nodeExternals(nodeExternalsOptions),
        vue(),
        typescript({
          outputToFilesystem: true,
          paths: {
            '@/*': ['src/*'],
          },
        }),
        commonjs({}),
      ],
      external: ['vue'], // List external dependencies here
    },
    options
  );
};
