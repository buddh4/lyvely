import { getCalendarPlanOptions } from '@lyvely/common';
import { useProfileStore } from '@/modules/profile/stores/profile.store';
import { computed, toRefs } from 'vue';
import { useActivityEditStore } from '@/modules/activity/store/editActivityStore';

export default function() {
  const profileStore = useProfileStore();
  const activityEditStore = useActivityEditStore();
  const tagOptions = computed(() => profileStore.tagOptions);
  const calendarPlanOptions = computed(() => getCalendarPlanOptions());
  const { model, modalTitle } = toRefs(activityEditStore);

  const showModal = computed( {
    get: () => activityEditStore.isActive,
    set: (value) => !value ? activityEditStore.reset() : undefined
  });

  function getError(field: string) {
    return activityEditStore.getError(field);
  }

  function getErrors(field: string) {
    return activityEditStore.getErrors();
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
    getErrors,
    onHide,
    onSubmit,
    tagOptions,
    calendarPlanOptions,
  };
}
