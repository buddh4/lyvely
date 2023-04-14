<script lang="ts" setup>
import { computed, useSlots } from 'vue';

export interface IProps {
  message?: string;
  hide?: boolean;
  type?: 'danger' | 'info' | 'warning' | 'secondary';
}

const props = withDefaults(defineProps<IProps>(), {
  message: undefined,
  hide: undefined,
  type: 'secondary',
});

const cssClass = [
  'flex items-center border px-4 py-3 rounded relative mb-1',
  { 'border-danger text-danger': props.type === 'danger' },
  { 'border-info text-dimmed': props.type === 'info' },
  { 'border-warning text-warning': props.type === 'warning' },
  { 'border-divide text-dimmed': props.type === 'secondary' },
];

const isActive = computed(() => {
  return !!useSlots().default || props.message?.length;
});
</script>

<template>
  <div v-if="isActive" :class="cssClass">
    <span class="text-sm">
      <slot>
        <template v-if="message">
          {{ $t(message) }}
        </template>
      </slot>
    </span>
  </div>
</template>

<style lang="postcss">
@import '../../styles/alerts.css';
</style>
