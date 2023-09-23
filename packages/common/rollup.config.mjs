import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const production = !process.env.ROLLUP_WATCH;

export default [
  {
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
    external: (id) => {
      const isExternal = [
        'class-validator',
        'class-transformer',
        'dayjs',
        'mitt',
        'dayjs/plugin/weekOfYear',
        'dayjs/plugin/utc',
        'dayjs/plugin/timezone',
        'dayjs/plugin/quarterOfYear',
        'dayjs/plugin/isoWeek',
      ].includes(id);

      // Exclude all dependencies from the bundle
      if(isExternal) {
        console.log('External '+id);
      } else {
        console.log('Non External '+id);
      }

      return isExternal;
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
