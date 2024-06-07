import { USER_REGISTRATION_MODULE_ID } from '@lyvely/interface';
import { userRegistrationRoutes } from './routes';
import { registerMenuEntry, registerSvgIcon } from '@lyvely/ui';
import { MENU_ACCOUNT_DRAWER } from '@/user-account';
import { useAuthStore } from '@/auth';
import { ROUTE_USER_REGISTRATION } from '@/user-registration/user-registration.constants';

export default () => {
  return {
    id: USER_REGISTRATION_MODULE_ID,
    routes: userRegistrationRoutes,
    i18n: {
      locale: (locale: string) => import(`./locales/${locale}.json`),
      base: (locale: string) => import(`./locales/base.${locale}.json`),
    },
    init() {
      registerSvgIcon({
        name: 'sign-up',
        viewBox: '0 0 32 32',
        paths: [
          'M23 11.031c0-0.553-0.448-1-1-1h-3c0 0 0.033-1.204 0.033-2.954 0-1.625-1.346-3.108-3.033-3.108s-2.988 1.411-2.988 3.099c0 1.625-0.012 2.964-0.012 2.964h-3c-0.553 0-1 0.447-1 1 0 0.552 0 1.938 0 1.938h14c0-0.001 0-1.387 0-1.939zM16 8.969c-0.553 0-1-0.448-1-1 0-0.553 0.447-1 1-1 0.552 0 1 0.447 1 1s-0.448 1-1 1zM28 11.031l-4-0.062 0.021 3.104h-16.021v-2.979l-4-0.062c-1.104 0-2 0.896-2 2v14c0 1.104 0.896 2 2 2h24c1.104 0 2-0.896 2-2v-14c0-1.105-0.896-2.001-2-2.001zM10 16.844c1.208 0 2.188 1.287 2.188 2.875s-0.98 2.875-2.188 2.875-2.188-1.287-2.188-2.875 0.98-2.875 2.188-2.875zM5.667 25.979c0 0 0.237-1.902 0.776-2.261s2.090-0.598 2.090-0.598 1.006 1.075 1.434 1.075c0.427 0 1.433-1.075 1.433-1.075s1.552 0.238 2.091 0.598c0.633 0.422 0.791 2.261 0.791 2.261h-8.615zM26 25.031h-9v-1h9v1zM26 23.031h-9v-1h9v1zM26 21.031h-9v-1h9v1zM26 19.031h-9v-1h9v1z',
        ],
      });
      registerMenuEntry(MENU_ACCOUNT_DRAWER, {
        id: 'user-sign-up',
        sortOrder: 5010,
        moduleId: USER_REGISTRATION_MODULE_ID,
        icon: 'sign-up',
        condition: () => !useAuthStore().isAuthenticated,
        to: ROUTE_USER_REGISTRATION,
        text: 'user-registration.sign-up',
      });
    },
  };
};
