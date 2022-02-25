import { getCalendarPlanOptions } from 'lyvely-common';
import { useProfileStore } from '@/modules/user/store/profile.store';
import { computed, toRefs } from 'vue';
import { useActivityEditStore } from '@/modules/activity/store/editActivityStore';

export default function() {
  const profileStore = useProfileStore();
  const activityEditStore = useActivityEditStore();
  const categoryOptions = computed(() => profileStore.categoryOptions);
  const calendarPlanOptions = computed(() => getCalendarPlanOptions());
  const { model, modalTitle } = toRefs(activityEditStore);

  const showModal = computed( {
    get: () => activityEditStore.showModal,
    set: (value) => !value ? activityEditStore.reset() : undefined
  });

  function getError(field: string) {
    return activityEditStore.getError(field);
  }

  function onHide() {
    return activityEditStore.reset();
  }

  function onSubmit() {
    return activityEditStore.submit();
  }

  return {
    model,
    modalTitle,
    showModal,
    getError,
    onHide,
    onSubmit,
    categoryOptions,
    calendarPlanOptions,
  };
}
