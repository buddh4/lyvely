import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';

const production = !process.env.ROLLUP_WATCH;

export default [
  {
    input: 'src/index.ts',
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
   external: [
      'class-validator',
      'class-transformer',
      'dayjs',
      'dayjs/plugin/weekOfYear',
      'dayjs/plugin/weekYear',
      'dayjs/plugin/weekday',
      'dayjs/plugin/utc',
      'dayjs/plugin/timezone',
      'dayjs/plugin/quarterOfYear',
      'dayjs/plugin/isoWeek',
    ],
    plugins: [
      typescript({
        sourceMap: !production,
        inlineSources: !production,
        paths: {
          '@/*': ['src/*'],
        },
      }),
      dynamicImportVars(),
      commonjs({}),
    ],
    watch: {
      clearScreen: false,
    },
  },
];
