<script lang="ts" setup>
import { RouteLocationRaw } from 'vue-router';
import { t } from '@/i18n';

export interface IProps {
  to: RouteLocationRaw;
  ariaControls: string;
  label?: string;
  translate?: boolean;
}

withDefaults(defineProps<IProps>(), {
  translate: true,
  label: undefined,
});
</script>

<template>
  <ly-button
    :route="to"
    role="tab"
    class="secondary outlined grow px-1 py-1"
    :aria-controls="ariaControls">
    <template #default="{ active }">
      <slot :active="active">
        <template v-if="label">
          {{ translate ? t(label) : label }}
        </template>
      </slot>
    </template>
  </ly-button>
</template>

<style scoped></style>
