import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { computed, toRefs } from 'vue';
import { useActivityEditStore } from '@/modules/activities/store/edit-activity.store';
import { DataPointNumberInputType, IFieldValidationResult, getCalendarPlanOptions } from '@lyvely/common';

export default function () {
  const profileStore = useProfileStore();
  const activityEditStore = useActivityEditStore();
  const tagOptions = computed(() => profileStore.tagOptions);
  const calendarPlanOptions = computed(() => getCalendarPlanOptions());
  const { model, modalTitle, validator, status } = toRefs(activityEditStore);

  /*validator.value?.addRule('max', (value: any, result: IFieldValidationResult) => {
    debugger;
    if (model.value!.inputType === DataPointNumberInputType.Checkbox && value > 8) {
      result.errors!.push('max');
    }
  });
*/
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
    modalTitle,
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
