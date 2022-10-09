<script lang="ts" setup>
import { computed } from "vue";

interface IProps {
  message?: string;
}

const props = defineProps<IProps>();

const show = computed(() => {
  return typeof props.message === "string" && props.message.length;
});
</script>

<template>
  <div
    v-if="show"
    class="flex items-center bg-red-100 border border-danger text-danger px-4 py-3 rounded relative dark:bg-main mb-1"
  >
    <slot>
      <span v-if="message && message.length" class="ml-1 text-sm">
        {{ $t(message) }}
      </span>
    </slot>
  </div>
</template>

<style lang="postcss">
@import "../../styles/alerts.css";
</style>
