<script lang="ts" setup>
import { useHelpText } from './help-text.util';
import { t, Translatable } from '@/i18n';
import LyLoader from '../loaders/LyLoader.vue';
import LyIcon from '@/components/icons/LyIcon.vue';
import LyAlert from '@/components/dialogs/LyAlert.vue';
import { computed } from 'vue';

export interface IProps {
  id?: string;
  label?: Translatable;
  inputId?: string;
  inputError?: Translatable;
  helpText?: Translatable;
  wrapperClass?: string;
  loading?: boolean;
  required?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  id: undefined,
  label: undefined,
  inputId: undefined,
  helpText: undefined,
  inputError: undefined,
  wrapperClass: undefined,
  loading: false,
  required: false,
});

const { helpTextId, showHelpText, translatedHelpText, hasHelpText, ariaDescribedBy } = useHelpText(
  props.helpText
);

const wrapperClasses = computed(() => {
  return [
    'form-input relative no-swipe text-main text-sm',
    { required: props.required },
    props.wrapperClass,
  ];
});
</script>

<template>
  <section :id="id" :class="wrapperClasses">
    <slot name="label">
      <label
        v-if="label"
        :id="inputId + 'label'"
        :for="inputId"
        class="pointer-events-none absolute z-10 inline-block px-3 pt-2 text-xs text-main text-opacity-70"
        :aria-describedby="ariaDescribedBy">
        {{ t(label) }}
      </label>
      <ly-icon
        v-if="!loading && hasHelpText"
        name="info"
        class="absolute right-3 top-2 z-10 w-4 cursor-pointer text-info-dark"
        aria-hidden="true"
        @click="showHelpText = !showHelpText" />

      <ly-loader v-if="loading" size="10px" icon-class="absolute right-[10px] top-[10px] z-10" />
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
        <div v-if="inputError" class="overflow-hidden pl-1 pt-1 text-sm text-danger">
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

.fade-leave-active,
.fade-enter-active {
  transition:
    all 0.5s ease,
    max-height 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  max-height: 24px;
}
</style>
