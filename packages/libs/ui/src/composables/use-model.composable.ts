import { ref, watch, Ref, type UnwrapRef } from 'vue';
import { clone } from '@lyvely/common';

export function useModel<TModel, TModelName extends string = 'modelValue'>(
  model: TModel,
  emit: (emit: `update:${TModelName}`, val?: any) => void,
  propName: TModelName = 'modelValue' as TModelName
): { formValue: Ref<UnwrapRef<TModel>> } {
  const formValue = ref<TModel>(clone(model));

  watch(
    () => model,
    (newVal: TModel) => {
      formValue.value = clone(newVal) as UnwrapRef<TModel>;
    },
    { deep: true }
  );

  watch(
    () => formValue.value,
    (newVal) => {
      emit(`update:${propName}`, newVal);
    },
    { deep: true }
  );

  return { formValue };
}
