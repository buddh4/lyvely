<script lang="ts" setup>
import ContentStreamFooter from '@/modules/content-stream/components/ContentStreamFooter.vue';
import ContentStream from '@/modules/content-stream/components/ContentStream.vue';
import { ContentStreamFilter } from '@lyvely/common';
import { useRouter } from 'vue-router';
import { useContentStreamFilterStore } from '@/modules/content-stream/stores/content-stream-filter.store';
import { storeToRefs } from 'pinia';

const { filter } = storeToRefs(useContentStreamFilterStore());
filter.value = new ContentStreamFilter();
filter.value.fromQuery(useRouter().currentRoute.value.query);
</script>

<template>
  <content-stream :batch-size="40" />
  <content-stream-footer />
</template>

<style scoped></style>
