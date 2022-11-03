import axios from 'axios';
import { Icons } from '@/modules/ui/components/icon/Icons';
import { useGlobalDialogStore } from '@/modules/core/store/global.dialog.store';
import { AvatarModel } from '@lyvely/common';

// TODO: abstract this away in config or something..
const apiURL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8080';
const repository = axios.create({ baseURL: apiURL });

export function createApiUrl(path: string) {
  path = path.charAt(0) === '/' ? path : '/' + path;
  return apiURL + path;
}

export function createAvatarUrl(avatar: AvatarModel) {
  return createApiUrl(`/avatars/${avatar.guid}?v=${avatar.timestamp}`);
}

export function createFileUrl(hash: string) {
  // TODO (file) this is just a dummy implementation, and does not work at the moment...
  return createApiUrl('/files/' + hash);
}

repository.defaults.withCredentials = true;

repository.interceptors.response.use(undefined, (error) => {
  return new Promise((resolve, reject) => {
    if (!error.response) {
      useGlobalDialogStore().showError({
        icon: Icons.error_network.name,
        title: 'error.network.title',
        message: 'error.network.message',
        buttonType: 'reload',
      });
    } else if (error.response.status === 403 && error.response.data.message === 'invalid csrf token') {
      useGlobalDialogStore().showError({
        icon: Icons.error_network.name,
        title: 'error.csrf.title',
        message: 'error.csrf.message',
        buttonType: 'reload',
      });
    }

    reject(error);
  });
});

export default repository;
