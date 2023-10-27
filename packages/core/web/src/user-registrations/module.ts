import { USER_REGISTRATIONS_MODULE_ID } from '@lyvely/core-interface';
import { userRegistrationRoutes } from './routes';

export default () => {
  return {
    id: USER_REGISTRATIONS_MODULE_ID,
    routes: userRegistrationRoutes,
    i18n: {
      locale: (locale: string) => import(`./locales/${locale}.json`),
    },
  };
};
