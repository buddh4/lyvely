import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { computed, toRefs } from 'vue';
import { useUpdateActivityStore } from '@/modules/activities/store/update-activity.store';
import { getCalendarPlanOptions } from '@lyvely/common';

export default function () {
  const profileStore = useProfileStore();
  const activityEditStore = useUpdateActivityStore();
  const tagOptions = computed(() => profileStore.tagOptions);
  const calendarPlanOptions = computed(() => getCalendarPlanOptions());
  const { model, validator, status, isCreate } = toRefs(activityEditStore);

  const { submit, reset } = activityEditStore;

  const showModal = computed({
    get: () => activityEditStore.isActive,
    set: (value) => (!value ? activityEditStore.reset() : undefined),
  });

  function addTag(newTag: string) {
    if (model?.value?.tagNames) {
      model?.value.tagNames.push(newTag);
    }
  }

  return {
    model,
    isCreate,
    validator,
    addTag,
    status,
    showModal,
    submit,
    reset,
    tagOptions,
    calendarPlanOptions,
  };
}
