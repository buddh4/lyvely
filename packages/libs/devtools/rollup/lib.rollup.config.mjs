import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { nodeExternals } from 'rollup-plugin-node-externals';

const production = !process.env.ROLLUP_WATCH;

/**
 * Returns a rollup config suited for common libraries consumed by web and server components.
 *
 *
 * @param {Object} [options] - Options
 * @param {Object} options.nodeExternals - NodeExternalsConfig.
 * @returns {void}
 *
 * @example
 * // Usage with options:
 * myFunction({
 *   externals: ['dependency1', 'dependency2']
 * });
 *
 * // Usage without options:
 * myFunction();
 */
export default async (options) => {
  options ||= {};
  const nodeExternalsOptions = options.nodeExternals || { devDeps: true };
  delete options.nodeExternals;

  return Object.assign(
    {
      input: './src/index.ts',
      output: [
        {
          sourcemap: !production,
          preserveModules: true,
          dir: 'dist/esm',
          format: 'esm',
        },
        {
          sourcemap: !production,
          dir: 'dist/cjs',
          preserveModules: true,
          format: 'cjs',
          entryFileNames: '[name].cjs',
        },
      ],
      plugins: [
        nodeExternals(nodeExternalsOptions),
        typescript({
          sourceMap: !production,
          inlineSources: !production,
          outputToFilesystem: true,
          paths: {
            '@/*': ['src/*'],
          },
        }),
        nodeResolve({
          resolveOnly: ['he'],
        }),
        commonjs({}),
      ],
      watch: {
        clearScreen: false,
      },
    },
    options
  );
};
