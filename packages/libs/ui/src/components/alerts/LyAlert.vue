<script lang="ts" setup>
import { computed, useSlots } from 'vue';
import { t, Translatable } from '@/i18n';

export interface IProps {
  text?: Translatable;
  hide?: boolean;
  type?: 'danger' | 'info' | 'warning' | 'secondary' | 'success';
}

const props = withDefaults(defineProps<IProps>(), {
  text: undefined,
  hide: undefined,
  type: 'secondary',
});

const cssClass = [
  'flex items-center border px-4 py-3 rounded relative mb-1',
  { 'border-danger text-danger': props.type === 'danger' },
  { 'border-info text-dimmed': props.type === 'info' },
  { 'border-warning text-warning': props.type === 'warning' },
  { 'border-divide text-dimmed': props.type === 'secondary' },
  { 'border-success text-dimmed': props.type === 'success' },
];

const isActive = computed(() => {
  return !!useSlots().default || t(props.message).length;
});
</script>

<template>
  <div v-if="isActive" :class="cssClass">
    <span class="text-sm">
      <slot>
        <template v-if="message">
          {{ t(text) }}
        </template>
      </slot>
    </span>
  </div>
</template>

<style lang="postcss">
.alert {
  @apply px-4 py-3 rounded relative;
}

.alert.primary {
  @apply bg-primary-light border border-primary-dark;
}

.alert.secondary {
  @apply bg-secondary-light border border-secondary-dark;
}

.alert.info {
  @apply bg-info-light border border-info-dark;
}

.alert.success {
  @apply bg-success-light border border-success-dark;
}

.alert.warning {
  @apply bg-warning-light border border-warning-dark;
}

.alert.danger {
  @apply bg-danger-light border border-danger-dark;
}
</style>
