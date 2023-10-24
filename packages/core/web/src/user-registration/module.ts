import { USER_REGISTRATION_MODULE_ID } from '@lyvely/core-interface';
import { userRegistrationRoutes } from './routes';

export default () => {
  return {
    id: USER_REGISTRATION_MODULE_ID,
    routes: userRegistrationRoutes,
  };
};
