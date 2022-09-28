<script lang="ts" setup>
interface IProps {
  title: string;
  ariaLabel?: string;
  icon?: string;
}

defineProps<IProps>();
</script>

<template>
  <div class="list-page-root border border-divide rounded divide-y">
    <div class="max-w-none py-2 px-3 bg-shadow">
      <h1
        class="list-page-headline inline-block font-medium m-0"
        tabindex="-1"
        :aria-label="$t(ariaLabel || title)"
      >
        <ly-icon v-if="icon" :name="icon" class="mr-1" />
        {{ $t(title) }}
      </h1>
      <div class="float-right inline-block">
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
