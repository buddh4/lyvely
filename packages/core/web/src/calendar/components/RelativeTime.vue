<script lang="ts" setup>
import { computed, onUnmounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { getRelativeTime } from '@lyvely/dates';
import { useI18nStore } from '@/i18n';

export interface IProps {
  ts: number;
  style?: Intl.RelativeTimeFormatStyle;
}

const props = withDefaults(defineProps<IProps>(), {
  style: 'long',
});

const { locale } = storeToRefs(useI18nStore());

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
  getRelativeTime(props.ts - now.value, locale.value, props.style),
);
</script>

<template>
  <span class="text-xs text-dimmed">
    {{ relativeTime }}
  </span>
</template>

<style scoped></style>
