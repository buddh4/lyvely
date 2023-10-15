<script lang="ts" setup>
import { useHelpText } from './help-text.util';
import { t, Translatable } from '@/i18n';

export interface IProps {
  label?: Translatable;
  inputId: string;
  inputError?: Translatable;
  helpText?: Translatable;
  wrapperClass?: string;
  required?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  label: undefined,
  helpText: undefined,
  inputError: undefined,
  wrapperClass: undefined,
  required: false,
});

const { helpTextId, showHelpText, translatedHelpText, hasHelpText, ariaDescribedBy } = useHelpText(
  props.helpText,
);

const wrapperClasses = [
  'form-input relative no-swipe',
  { required: props.required },
  props.wrapperClass,
];
</script>

<template>
  <section :class="wrapperClasses">
    <slot name="label">
      <label
        v-if="label"
        :for="inputId"
        class="absolute inline-block inset-0 opacity-70 text-xs px-3 py-2 pointer-events-none"
        :aria-describedby="ariaDescribedBy">
        {{ t(label) }}
      </label>
      <ly-icon
        v-if="hasHelpText"
        name="info"
        class="absolute text-info-dark w-4 cursor-pointer top-2 right-3"
        aria-hidden="true"
        @click="showHelpText = !showHelpText" />
    </slot>
    <slot></slot>

    <ly-alert
      v-if="hasHelpText"
      v-show="showHelpText"
      :id="helpTextId"
      class="mt-2 text-xs"
      type="info">
      {{ translatedHelpText }}
    </ly-alert>

    <slot name="error">
      <transition name="fade">
        <div v-if="inputError" class="text-danger text-sm pl-1 pt-1">
          {{ t(inputError) }}
        </div>
      </transition>
    </slot>
  </section>
</template>

<style scoped>
.form-input label {
  top: 1px;
  left: 1px;
}

.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
