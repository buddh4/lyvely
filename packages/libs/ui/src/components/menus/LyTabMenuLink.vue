<script lang="ts" setup>
import { RouteLocationRaw } from 'vue-router';
import { t, Translatable } from '@/i18n';

export interface IProps {
  to: RouteLocationRaw;
  label?: Translatable;
}

withDefaults(defineProps<IProps>(), {
  label: undefined,
});
</script>

<template>
  <ly-button :route="to" role="tab" class="secondary outlined grow px-1 py-1">
    <template #default="{ active }">
      <slot :active="active">
        <template v-if="label">
          {{ t(label) }}
        </template>
      </slot>
    </template>
  </ly-button>
</template>

<style scoped></style>
