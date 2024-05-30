<script lang="ts" setup>
import { t, Translatable } from '@/i18n';

export interface IProps {
  title: Translatable;
  ariaLabel?: string;
  icon?: string;
}

withDefaults(defineProps<IProps>(), {
  icon: undefined,
  ariaLabel: undefined,
});
</script>

<template>
  <div class="list-page-root divide-y overflow-hidden rounded border border-divide">
    <div class="flex max-w-none items-center bg-main p-2 md:p-4">
      <ly-icon v-if="icon" :name="icon" :auto-scale="false" class="mr-1.5" />
      <h1 tabindex="-1" :aria-label="t(ariaLabel || title)">
        {{ t(title) }}
      </h1>
      <div class="ml-auto inline-block">
        <slot name="header-right"></slot>
      </div>
    </div>

    <slot></slot>
  </div>
</template>

<style scoped>
.list-page-root > :last-child {
  @apply rounded-b;
}
</style>
