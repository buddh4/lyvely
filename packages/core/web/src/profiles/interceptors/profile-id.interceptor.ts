import { useProfileStore } from '@/profiles';
import { InternalAxiosRequestConfig } from 'axios';

export const profileIdInterceptor = function (config: InternalAxiosRequestConfig) {
  const { profile } = useProfileStore();
  if (profile) {
    if (config.url?.startsWith('profiles/:pid')) {
      config.url = config.url.replace('profiles/:pid', `profiles/${profile.id}`);
    }

    if (config.url?.startsWith('profiles/:handle')) {
      config.url = config.url.replace('profiles/:handle', `profiles/${profile.handle}`);
    }

    // We add the oid for organization sub profiles for server side optimization
    if (profile.hasOrg) {
      config.params.oid = profile.oid;
    }
  }
  return config;
};
