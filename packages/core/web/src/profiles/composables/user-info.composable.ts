import { useProfileStore } from '@/profiles/stores';
import { computedAsync } from '@vueuse/core';
import { ref } from 'vue';
import { useAuthStore } from '@/auth';

export const useUserInfo = (uid?: string) => {
  uid ??= useAuthStore().user?.id;
  if (!uid) return ref(null);
  const userInfo = useProfileStore().getMemberUserInfo(uid);
  return userInfo ? ref(userInfo) : computedAsync(async () => useProfileStore().getUserInfo(uid!));
};
