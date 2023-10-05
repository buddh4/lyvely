import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import  commonjs from '@rollup/plugin-commonjs';
import { nodeExternals } from 'rollup-plugin-node-externals'

const production = !process.env.ROLLUP_WATCH;

/**
 * Returns a rollup config suited for libraries consumed by web and server components.
 *
 * The config will by default add all dependencies and peer dependencies to the excludes. In case you want to bundle
 * an external dependency you need to explicitly define it in the options.includes options.
 *
 * @param {Object} [options] - Options
 * @param {Object} options.nodeExternals - NodeExternalsConfig.
 * @param {string[]} [options.externals] - An array of external dependencies to exclude (we exclude by default all dependencies of package.json.
 * @param {string[]} [options.includes] - An array of dependencies to explicitly include.
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
  options.nodeExternals ||= { devDeps: true };

  return Object.assign( {
    input: './src/index.ts',
    output: [
      {
        sourcemap: !production,
        dir: 'dist/esm',
        format: 'esm',
      },
      {
        sourcemap: !production,
        dir: 'dist/cjs',
        format: 'cjs',
      },
    ],
    plugins: [
      nodeExternals(options.nodeExternals),
      typescript({
        sourceMap: !production,
        inlineSources: !production,
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
  }, options)
}
