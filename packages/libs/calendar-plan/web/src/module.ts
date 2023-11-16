import './index.css';
import { IModule } from '@lyvely/web';
import { CALENDAR_PLAN_MODULE_ID } from '@/calendar-plan.constants';
export default () => {
  return {
    id: CALENDAR_PLAN_MODULE_ID,
    i18n: {
      base: (locale) => import(`./locales/base.${locale}.json`),
    },
  } as IModule;
};
