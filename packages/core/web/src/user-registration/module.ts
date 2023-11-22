import { USER_REGISTRATION_MODULE_ID } from '@lyvely/interface';
import { userRegistrationRoutes } from './routes';

export default () => {
  return {
    id: USER_REGISTRATION_MODULE_ID,
    routes: userRegistrationRoutes,
    i18n: {
      locale: (locale: string) => import(`./locales/${locale}.json`),
    },
  };
};
