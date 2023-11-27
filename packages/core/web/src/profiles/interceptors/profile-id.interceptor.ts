import { useProfileStore } from '@/profiles';
import { InternalAxiosRequestConfig } from 'axios';

export const profileIdInterceptor = function (config: InternalAxiosRequestConfig) {
  const { profile } = useProfileStore();
  if (!config.skipProfileIdParam && profile) {
    if (config.params) {
      config.params.pid = profile.id;
    } else {
      config.params = { pid: profile.id };
    }

    if (config.url?.startsWith('profiles/:pid')) {
      config.url = config.url.replace('profiles/:pid', `profiles/${profile.id}`);
    }

    // We add the oid for organization sub profiles for server side optimization
    if (profile.hasOrg) {
      config.params.oid = profile.oid;
    }
  }
  return config;
};
