import { uniqueId } from 'lodash';
import { computed, ref } from 'vue';
import { t } from '@/i18n';

export function useHelpText(helpText?: string) {
  const translatedHelpText = helpText ? t(helpText) : undefined;
  const helpTextId = uniqueId('input-help');
  return {
    showHelpText: ref(false),
    helpTextId,
    translatedHelpText,
    hasHelpText: translatedHelpText && translatedHelpText !== helpText,
    ariaDescribedBy: computed(() => (translatedHelpText?.length ? undefined : helpTextId)),
  };
}
