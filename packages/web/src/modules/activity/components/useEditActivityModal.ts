import { getCalendarPlanOptions } from '@lyvely/common';
import { useProfileStore } from '@/modules/profile/stores/profile.store';
import { computed, toRefs } from 'vue';
import { useActivityEditStore } from '@/modules/activity/store/editActivityStore';

export default function() {
  const profileStore = useProfileStore();
  const activityEditStore = useActivityEditStore();
  const tagOptions = computed(() => profileStore.tagOptions);
  const calendarPlanOptions = computed(() => getCalendarPlanOptions());
  const { model, modalTitle, validator, error } = toRefs(activityEditStore);
  const { submit, reset } = activityEditStore;

  const showModal = computed( {
    get: () => activityEditStore.isActive,
    set: (value) => !value ? activityEditStore.reset() : undefined
  });


  function addTag (newTag: string) {
    model.value!.tagNames!.push(newTag);
  }

  return {
    model,
    modalTitle,
    validator,
    addTag,
    error,
    showModal,
    submit,
    reset,
    tagOptions,
    calendarPlanOptions,
  };
}
