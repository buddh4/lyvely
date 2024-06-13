<script setup lang="ts">
import { useDark } from '@vueuse/core';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { getBackgroundColor, hasOverflow } from '@/helpers';
import {
  MARKDOWN_PRESET_DEFAULT,
  renderMarkdown,
} from '@/components/markdown/use-markdown.composable';

// TODO: Accessibility https://www.w3.org/WAI/WCAG21/Techniques/general/G201

interface IProps {
  md: string | undefined;
  prose?: boolean;
  preset?: string;
  maxWidth?: boolean;
  shadow?: boolean;
  maxHeight?: boolean | string;
}

const props = withDefaults(defineProps<IProps>(), {
  md: '',
  preset: MARKDOWN_PRESET_DEFAULT,
  prose: true,
  maxWidth: false,
  shadow: true,
  maxHeight: false,
});

const cssClass = {
  'overflow-hidden prose-a:text-blue-600 prose-a:no-underline dark:prose-a:text-blue-500': true,
  'prose prose-sm dark:prose-invert': props.prose,
  'max-w-none': !props.maxWidth,
};

const isOverflow = ref(false);
const showAll = ref(!props.maxHeight);
const maxHeightState = computed(() => {
  if (props.maxHeight === false || showAll.value) return 'none';
  return typeof props.maxHeight === 'string' ? props.maxHeight : '300px';
});

const shadowEl = ref<HTMLElement>();
const stage = ref<HTMLElement>();

const isDark = useDark();
const shadowBackground = ref('transparent');
watch(isDark, () => {
  nextTick(() => {
    shadowBackground.value = getShadowBackground();
  });
});

function getShadowBackground() {
  if (!props.shadow || !stage.value) return 'transparent';
  const bgColor = getBackgroundColor(stage.value);
  return bgColor ? `linear-gradient(0deg, ${bgColor} 20%, transparent 100%)` : 'transparent';
}

const html = ref('');

const render = () => {
  setTimeout(() => {
    try {
      html.value = renderMarkdown(props.md, props.preset);
      if (!html.value.length) return;
      setTimeout(() => (isOverflow.value = hasOverflow(stage.value!, 20)));
    } catch (e) {
      return 'Error';
    }
  });
};

onMounted(() => {
  shadowBackground.value = getShadowBackground();
  watch(() => props.md, render, { immediate: true });
});
</script>

<template>
  <div>
    <div
      v-if="html.length"
      ref="stage"
      :class="cssClass"
      :style="{ 'max-height': maxHeightState }"
      v-html="html" />
    <div v-else :style="{ 'max-height': maxHeightState }" :class="cssClass">{{ md }}</div>
    <div v-if="isOverflow && maxHeight !== false" class="relative flex w-full justify-end">
      <div
        v-if="!showAll"
        ref="shadowEl"
        class="show-more-shadow"
        :style="{ background: shadowBackground }"></div>
      <ly-button
        v-if="showAll"
        class="text-xs"
        text="ui.markdown-view.showLess"
        @click="showAll = false" />
      <ly-button v-else class="xs" text="ui.markdown-view.showMore" @click="showAll = true" />
    </div>
  </div>
</template>

<style scoped>
.show-more-shadow {
  position: absolute;
  width: 100%;
  height: 32px;
  top: -32px;
  left: 0;
}
</style>
