import { CalendarInterval } from '@lyvely/dates';
import { useCalendarPlanItem } from './calendar-plan-item.composable';
import { useContentCreateStore, ICreateContentInitOptions } from '@lyvely/web';

export const useCreateCalendarPlanItem = (contentType: string) => {
  const createItem = (interval = CalendarInterval.Daily, options?: ICreateContentInitOptions) => {
    options ??= {};
    return useContentCreateStore()
      .createContentType(contentType, { interval, ...options })
      .then(({ model }) => {
        if (!model) return;
        useCalendarPlanItem(model).highlight();
        return model;
      });
  };

  return {
    createItem,
  };
};
