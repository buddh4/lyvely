import { useProfileStore } from '@/profiles';
import { InternalAxiosRequestConfig } from 'axios';

export const profileIdInterceptor = function (config: InternalAxiosRequestConfig) {
  const profileStore = useProfileStore();
  if (!config.skipProfileIdParam && profileStore.profile) {
    const { profile } = profileStore;
    if (config.params) {
      config.params.pid = profileStore.profile.id;
    } else {
      config.params = { pid: profileStore.profile.id };
    }

    // We add the oid for organization sub profiles for server side optimization
    if (profile.hasOrg) {
      config.params.oid = profileStore.profile.oid;
    }
  }
  return config;
};
