import { setTranslationProvider, TranslationAdapter } from '@lyvely/i18n';
import { AvatarData } from '@/interfaces';

export type ENV = 'development' | 'production';
export type AvatarUrlProvider = (guid: string, ts?: number) => string;

export type LyvelyUiOptions = {
  translationProvider?: TranslationAdapter;
  env?: ENV;
  avatarUrlProvider?: AvatarUrlProvider;
};

const globalOptions: LyvelyUiOptions = {
  env: 'production',
};

let env = 'production';
export const getEnv = () => env;
export const setEnv = (environment: ENV = 'production') => (env = environment);
export const isDevelopmentEnvironment = () => env === 'development';

export function getAvatarUrl(guid: string, ts?: number) {
  if (globalOptions.avatarUrlProvider) return globalOptions.avatarUrlProvider(guid, ts);
  return `/avatars/${encodeURIComponent(guid)}` + ts ? `?v=${encodeURIComponent(ts!)}` : '';
}

export function createAvatarUrl(avatar: AvatarData): string;
export function createAvatarUrl(guid: string, timestamp?: number): string;
export function createAvatarUrl(guid: string | AvatarData, timestamp?: number): string {
  if (typeof guid === 'object') {
    timestamp = guid.timestamp;
    guid = guid.guid;
  }
  return getAvatarUrl(guid, timestamp);
}

export function setConfigOptions(options?: LyvelyUiOptions) {
  if (options?.translationProvider) setTranslationProvider(options.translationProvider);
  if (options?.env) setEnv(options.env);
  if (options?.avatarUrlProvider) globalOptions.avatarUrlProvider = options.avatarUrlProvider;
}
