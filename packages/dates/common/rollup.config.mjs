import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';

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
      commonjs({}),
    ],
    watch: {
      clearScreen: false,
    },
  },
];
