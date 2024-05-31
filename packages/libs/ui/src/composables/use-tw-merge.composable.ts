import { twMerge } from 'tailwind-merge';
import { computed, type ComputedRef, normalizeClass, useAttrs } from 'vue';

export const useTwMergeComposable = (
  defaults: unknown
): {
  originalAttrs: ComputedRef<any>;
  classResult: ComputedRef<string>;
  classAttrs: ComputedRef<string>;
  classDefaults: ComputedRef<string>;
  attrs: ComputedRef<any>;
} => {
  const originalAttrs = computed(() => ({ ...useAttrs() }));
  const classAttrs = computed(() => normalizeClass(originalAttrs.value.class));
  const classDefaults = computed(() => normalizeClass(defaults));
  const classResult = computed(() => twMerge(classAttrs.value, classDefaults.value));
  const attrs = computed(() => ({ ...originalAttrs.value, class: classResult.value }));

  return {
    originalAttrs,
    classResult,
    classAttrs,
    classDefaults,
    attrs,
  };
};
