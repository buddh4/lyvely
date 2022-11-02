import { defineStore } from 'pinia';
import { useAccountService } from '@/modules/account/services/account.service';
import { useAuthStore } from '@/modules/auth/store/auth.store';

export const useUploadAccountAvatarStore = defineStore('upload-account-avatar', () => {
  const accountService = useAccountService();

  async function updateAvatar(blob: Blob) {
    useAuthStore().user!.avatar = await accountService.updateAvatar(blob);
  }

  return {
    updateAvatar,
  };
});
