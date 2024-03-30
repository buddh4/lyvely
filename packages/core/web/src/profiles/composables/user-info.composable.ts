import { useProfileStore } from '@/profiles/stores';
import { computedAsync } from '@vueuse/core';
import { ref } from 'vue';

export const useUserInfo = (uid: string) => {
  const userInfo = useProfileStore().getMemberUserInfo(uid);
  return userInfo ? ref(userInfo) : computedAsync(async () => useProfileStore().getUserInfo(uid));
};
