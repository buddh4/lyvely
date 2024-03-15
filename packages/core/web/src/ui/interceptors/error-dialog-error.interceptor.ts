import { useFlashStore, usePageStore } from '@/ui';
import { useGlobalDialogStore } from '@/core';
import { LySvgIcons } from '@lyvely/ui';
import { usePingClient } from '@lyvely/interface';

let pingInterval: number | undefined = undefined;

export const errorDialogErrorInterceptor = (error: any) => {
  return new Promise((resolve, reject) => {
    if (!error.response) {
      if (usePageStore().loaded) {
        useFlashStore().addErrorFlash('error.network.message');
      } else {
        useGlobalDialogStore().showError({
          icon: LySvgIcons.error_network.name,
          title: 'error.network.title',
          message: 'error.network.message',
          buttonType: 'reload',
        });

        if (!pingInterval) {
          pingInterval = setInterval(() => {
            usePingClient()
              .ping()
              .then((result) => {
                if (result) {
                  clearInterval(pingInterval);
                  document.location.reload();
                }
              });
          }, 2000) as any;
        }
      }
    } else if (
      error.response.status === 403 &&
      error.response.data.message === 'invalid csrf token'
    ) {
      useGlobalDialogStore().showError({
        icon: LySvgIcons.error_network.name,
        title: 'error.csrf.title',
        message: 'error.csrf.message',
        buttonType: 'reload',
      });
    }

    reject(error);
  });
};
