import { setTranslationProvider, TranslationAdapter } from '@/i18n';
import { IAvatarData } from '@/interfaces';
import { isPlainObject } from '@lyvely/common';

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

export function createAvatarUrl(avatar: IAvatarData): string;
export function createAvatarUrl(guid: string, timestamp?: number): string;
export function createAvatarUrl(guid: string | IAvatarData, timestamp?: number): string {
  if (isPlainObject<IAvatarData>(guid)) {
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
