import axios from 'axios';
import { Icons } from '@lyvely/ui';
import { useGlobalDialogStore } from '../store';

// TODO: abstract this away in config or something..
const apiURL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8080';
export const repository = axios.create({ baseURL: apiURL });

export function createApiUrl(path: string, queryParameters: Record<string, string> = {}) {
  const url = new URL(apiURL);
  path = path.charAt(0) === '/' ? path : '/' + path;
  url.pathname = path;

  Object.keys(queryParameters).forEach((key) => {
    url.searchParams.append(key, queryParameters[key]);
  });

  return url.toString();
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
    } else if (
      error.response.status === 403 &&
      error.response.data.message === 'invalid csrf token'
    ) {
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
