<script setup lang="ts">
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import {unified} from 'unified';
//import rehypeHighlight from 'rehype-highlight'
import {computedAsync} from "@vueuse/core";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeExternalLinks from 'rehype-external-links'

// TODO: allow html per configuration and prop
// https://unifiedjs.com/learn/recipe/remark-html/#how-to-allow-html-embedded-in-markdown

// TODO: Accessibility https://www.w3.org/WAI/WCAG21/Techniques/general/G201

interface IProps {
  md: string | undefined;
}

const props = withDefaults(defineProps<IProps>(), {
  md: ''
});


const html = computedAsync(async () => {
  try {
    return await unified()
        .use(remarkParse, {fragment: true})
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw) // *Parse* the raw HTML strings embedded in the tree
       // .use(rehypeHighlight)
        .use(rehypeSanitize)
        .use(rehypeExternalLinks, { rel: ['nofollow', 'noopener', 'noreferrer'], target: '_blank' })
        .use(rehypeStringify)
        .process(props.md);
  } catch(e)  {
    return 'Error';
  }
});
</script>

<template>
  <div class="prose dark:prose-invert max-w-none" v-html="html" />
</template>

<style scoped>

</style>