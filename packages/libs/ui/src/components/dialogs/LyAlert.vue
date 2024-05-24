<script lang="ts" setup>
import { computed, useSlots } from 'vue';
import { t, Translatable } from '@/i18n';
import LyIcon from '@/components/icons/LyIcon.vue';
import LyButton from '@/components/buttons/LyButton.vue';
import { getTextSizeClass, TextSize } from '@/types';

export interface IProps {
  modelValue?: boolean;
  text?: Translatable;
  textSize: TextSize;
  type?: 'danger' | 'info' | 'warning' | 'secondary' | 'success';
  icon?: boolean;
  fullWidth?: boolean;
  enterActiveClass?: string;
  leaveActiveClass?: string;
  closable?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: true,
  text: undefined,
  textSize: 'sm',
  type: 'secondary',
  icon: false,
  fullWidth: true,
  enterActiveClass: 'animate__animated animate__faster animate__fadeIn',
  leaveActiveClass: 'animate__animated animate__faster animate__fadeOut',
  closable: false,
});

const emit = defineEmits(['update:modelValue']);

const cssClass = computed(() => [
  'inline-block items-center border px-4 py-3 rounded mb-1',
  { 'w-full': props.fullWidth },
  { 'border-danger text-danger bg-red-50': props.type === 'danger' },
  { 'border-info text-blue-900 bg-blue-50': props.type === 'info' },
  { 'border-warning text-orange-600 bg-orange-50': props.type === 'warning' },
  { 'border-divide text-gray-600 bg-gray-200': props.type === 'secondary' },
  { 'border-success text-green-800 bg-green-50': props.type === 'success' },
]);

const show = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const isActive = computed(() => {
  return !!useSlots().default || t(props.text).length;
});

const iconMap = {
  danger: { icon: 'error', textClass: 'text-danger' },
  warning: { icon: 'warning', textClass: 'text-warning' },
  info: { icon: 'info', textClass: 'text-blue-400' },
  success: { icon: 'check', textClass: 'text-gray-400' },
  secondary: { icon: 'info', textClass: 'text-base' },
};

const iconTextClass = computed(() => {
  return iconMap[props.type]?.textClass;
});

const iconName = computed(() => {
  return typeof props.icon === 'string' ? props.icon : iconMap[props.type].icon;
});
</script>

<template>
  <transition :enter-active-class="enterActiveClass" :leave-active-class="leaveActiveClass">
    <div v-if="show && isActive" :class="cssClass" role="alert">
      <div :class="['relative', getTextSizeClass(textSize)]">
        <slot>
          <div class="flex items-center gap-1">
            <slot name="icon">
              <ly-icon
                v-if="icon"
                :name="iconName"
                class="mr-1 w-5 flex-shrink-0"
                :class="iconTextClass" />
            </slot>

            <div class="inline-block flex-grow" v-if="text">
              {{ t(text) }}
            </div>

            <ly-button v-if="closable" class="flex-shrink-0 px-1 py-1" @click="show = false">
              <ly-icon name="close" class="w-4" :class="iconTextClass" />
            </ly-button>
          </div>
        </slot>
      </div>
    </div>
  </transition>
</template>

<style lang="postcss">
.alert {
  @apply relative rounded px-4 py-3;
}

.alert.primary {
  @apply bg-primary-light border-primary-dark border;
}

.alert.secondary {
  @apply bg-secondary-light border-secondary-dark border;
}

.alert.info {
  @apply bg-info-light border-info-dark border;
}

.alert.success {
  @apply bg-success-light border-success-dark border;
}

.alert.warning {
  @apply bg-warning-light border-warning-dark border;
}

.alert.danger {
  @apply bg-danger-light border-danger-dark border;
}
</style>
