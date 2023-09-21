<script lang="ts" setup>
import { t } from '@/i18n';

export interface IProps {
  title: string;
  ariaLabel?: string;
  icon?: string;
  translate?: boolean;
}

withDefaults(defineProps<IProps>(), {
  icon: undefined,
  ariaLabel: undefined,
  translate: true,
});
</script>

<template>
  <div class="list-page-root border border-divide rounded divide-y">
    <div class="flex items-center max-w-none py-2 px-3 bg-shadow rounded">
      <ly-icon v-if="icon" :name="icon" :auto-scale="false" class="mr-1.5" />
      <h2
        class="list-page-headline inline-block font-medium m-0"
        tabindex="-1"
        :aria-label="translate ? t(ariaLabel || title) : ariaLabel || title">
        {{ translate ? t(title) : title }}
      </h2>
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
