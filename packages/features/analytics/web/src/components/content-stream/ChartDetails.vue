<script lang="ts" setup>
import { ContentDetails, useContentStore } from '@lyvely/web';
import { LyAlert, LyIcon, LyMarkdownView, resolveComponentRegistration } from '@lyvely/ui';
import { ChartModel } from '@lyvely/analytics-interface';
import { getChartCategoryDefinition } from '@/registries';
import { ref } from 'vue';

export interface IProps {
  model: ChartModel;
}

const props = defineProps<IProps>();

const modelValue = ref(props.model);

const category = getChartCategoryDefinition(props.model.config.category);

const ChartComponent = category?.component
  ? resolveComponentRegistration(category.component)
  : null;

useContentStore().onContentUpdated(ChartModel.contentType, (content: ChartModel) => {
  if (content.id !== props.model.id) return;
  modelValue.value = content;
});
</script>

<template>
  <content-details :model="modelValue">
    <template #image>
      <div class="border-divide bg-main flex h-8 w-8 justify-center rounded-full border">
        <router-link :to="{ name: 'Analytics' }">
          <ly-icon name="statistics" class="text-main" />
        </router-link>
      </div>
    </template>
    <template #body>
      <div v-if="modelValue.content.text?.length" class="mb-4">
        <ly-markdown-view :md="modelValue.content.text" class="text-sm" />
      </div>
      <Component :is="ChartComponent" v-if="ChartComponent" :model="modelValue" />
      <ly-alert v-else type="danger" text="analytics.errors.invalid_category" />
    </template>
  </content-details>
</template>

<style scoped></style>
