import { useLyvelyApp } from '@/lyvely-web.app';

export function isDevelopEnvironment() {
  return useLyvelyApp().options.env === 'development';
}
