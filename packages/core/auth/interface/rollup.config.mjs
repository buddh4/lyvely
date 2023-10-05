import libConfig from '@lyvely/configs/rollup/lib.rollup.config.mjs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const production = !process.env.ROLLUP_WATCH;

const config = libConfig({ path: __dirname })

export default config;