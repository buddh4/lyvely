import { extendTailwindMerge } from 'tailwind-merge';
import { computed, type ComputedRef, normalizeClass, useAttrs } from 'vue';

export const lyvelyTwMerge = extendTailwindMerge({
  extend: {
    theme: {
      colors: [
        'highlight',
        'main',
        'sidebar',
        'dimmed',
        'inverted',
        'lyvely',
        'inverted',
        'pop',
        'primary',
        'primary-light',
        'primary-dark',
        'secondary',
        'secondary-light',
        'secondary-dark',
        'warning',
        'warning-light',
        'warning-dark',
        'info',
        'info-light',
        'info-dark',
        'danger',
        'danger-light',
        'danger-dark',
        'success',
        'success-light',
        'success-dark',
      ],
    },
    classGroups: {
      'font-size': ['text-xxs'],
      'bg-color': ['bg-body', 'bg-main', 'bg-shadow', 'bg-sidebar', 'bg-highlight'],
      'max-h': ['max-h-1/3', 'max-h-2/3', 'max-h-screen-s'],
      h: ['h-screen-s'],
    },
  },
});

export const useTwMerge = (
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
  const classResult = computed(() => lyvelyTwMerge(classDefaults.value, classAttrs.value));
  const attrs = computed(() => ({ ...originalAttrs.value, class: classResult.value }));

  return {
    originalAttrs,
    classResult,
    classAttrs,
    classDefaults,
    attrs,
  };
};
