import { IModule } from '@/core';
import { OTP_MODULE_ID } from '@lyvely/core-interface';

export default (): IModule => {
  return {
    id: OTP_MODULE_ID,
    i18n: {
      locale: (locale: string) => import(`./locales/${locale}.json`),
    },
  };
};
