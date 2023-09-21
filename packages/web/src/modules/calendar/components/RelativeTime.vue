<script lang="ts" setup>
import { computed, onUnmounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { getRelativeTime } from '@lyvely/common';
import { useAuthStore } from '@/modules/auth/store/auth.store';

export interface IProps {
  ts: number;
  locale?: string;
  style?: Intl.RelativeTimeFormatStyle;
}

const { locale } = storeToRefs(useAuthStore());

const props = withDefaults(defineProps<IProps>(), {
  locale: undefined,
  style: 'long',
});

const now = ref(Date.now());

const diff = Math.abs(Math.floor((props.ts - Date.now()) / 1000));
if (diff < 86_400 /* Less than a day */) {
  const timeout = diff < 3_600 ? 60_000 : 3_600_000;
  const interval = setInterval(() => {
    now.value = Date.now();
  }, timeout);
  onUnmounted(() => clearInterval(interval));
}

const relativeTime = computed(() =>
  getRelativeTime(props.ts - now.value, props.locale || locale.value, props.style),
);
</script>

<template>
  <span class="text-dimmed text-xs">
    {{ relativeTime }}
  </span>
</template>

<style scoped></style>
