import fs from 'fs';
import typescript from '@rollup/plugin-typescript';

const excludes = ['tests', 'index.ts'];
const modules = fs.readdirSync('./src').filter(d => !excludes.includes(d));
const bundles = modules.reduce((bundles, module) => {
  bundles[module] = `src/${module}/index.ts`;
  return bundles;
}, {
   'index': 'src/index.ts'
});

const production = !process.env.ROLLUP_WATCH;

export default [
  {
    input: bundles,
    output: [
      {
        sourcemap: !production,
        dir: 'dist/esm',
        format: 'esm'
      },
      {
        sourcemap: !production,
        dir: 'dist/cjs',
        format: 'cjs'
      }
    ],
    external: [
      'class-validator',
      'class-transformer',
      'dayjs',
      'dayjs/plugin/weekOfYear',
      'dayjs/plugin/utc',
      'dayjs/plugin/timezone',
      'dayjs/plugin/quarterOfYear',
      'dayjs/plugin/isoWeek',
    ],
    plugins: [typescript({
      sourceMap: !production,
      inlineSources: !production
    })],
    watch: {
      clearScreen: false
    }
  }
]