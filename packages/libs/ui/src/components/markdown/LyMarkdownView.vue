<script setup lang="ts">
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { computedAsync, useDark } from '@vueuse/core';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';
import rehypeExternalLinks from 'rehype-external-links';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { getBackgroundColor, hasOverflow } from '@/helpers';

// TODO: Accessibility https://www.w3.org/WAI/WCAG21/Techniques/general/G201

interface IProps {
  md: string | undefined;
  prose?: boolean;
  maxWidth?: boolean;
  shadow?: boolean;
  maxHeight?: boolean | string;
}

const props = withDefaults(defineProps<IProps>(), {
  md: '',
  prose: true,
  maxWidth: false,
  shadow: true,
  maxHeight: false,
});

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

const html = computedAsync(async () => {
  try {
    const processed = await unified()
      // .use(remarkParse, { fragment: true })
      .use(remarkParse)
      .use(remarkBreaks)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw) // *Parse* the raw HTML strings embedded in the tree
      // .use(rehypeHighlight)
      .use(rehypeSanitize)
      .use(rehypeExternalLinks, { rel: ['nofollow', 'noopener', 'noreferrer'], target: '_blank' })
      .use(rehypeStringify)
      .process(props.md);

    setTimeout(() => {
      isOverflow.value = hasOverflow(stage.value!);
    }, 100);

    return processed;
  } catch (e) {
    return 'Error';
  }
});

onMounted(() => {
  shadowBackground.value = getShadowBackground();
});
</script>

<template>
  <div>
    <div
      ref="stage"
      :class="{
        'overflow-hidden prose-a:text-blue-600 prose-a:no-underline dark:prose-a:text-blue-500': true,
        'prose prose-sm dark:prose-invert': prose,
        'max-w-none': !maxWidth,
      }"
      :style="{ 'max-height': maxHeightState }"
      v-html="html" />
    <div v-if="isOverflow && maxHeight !== false" class="relative flex w-full justify-end">
      <div
        v-if="!showAll"
        ref="shadowEl"
        class="show-more-shadow"
        :style="{ background: shadowBackground }"></div>
      <ly-button v-if="showAll" text="ui.markdown-view.showLess" @click="showAll = false" />
      <ly-button v-else text="ui.markdown-view.showMore" @click="showAll = true" />
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
