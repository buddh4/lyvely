import { useProfileStore } from '@/profiles/stores';
import { computedAsync } from '@vueuse/core';

export const useUserInfo = (uid: string) => {
  const profileStore = useProfileStore();
  const userInfo = profileStore.getMemberUserInfo(uid);
  return userInfo ? userInfo : computedAsync(async () => useProfileStore().getUserInfo(uid));
};
