import fs from 'fs';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const excludes = ['tests', 'index.ts'];
const modules = fs.readdirSync('./src').filter((d) => !excludes.includes(d));
let bundles = modules.reduce(
  (bundles, module) => {
    bundles[module] = `src/${module}/index.ts`;
    return bundles;
  },
  {
    index: 'src/index.ts',
  },
);

console.log(bundles);

const production = !process.env.ROLLUP_WATCH;

export default [
  {
    input: bundles,
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
    external: (id) => {
      // Exclude all dependencies from the bundle
      return /node_modules/.test(id);
    },
    plugins: [
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
  },
];
