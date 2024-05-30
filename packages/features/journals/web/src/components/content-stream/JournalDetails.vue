<script lang="ts" setup>
import { JournalModel } from '@lyvely/journals-interface';
import { ContentDetails } from '@lyvely/web';
import { LyIcon, LyMarkdownView } from '@lyvely/ui';

export interface IProps {
  model: JournalModel;
}

defineProps<IProps>();
</script>

<template>
  <content-details :model="model">
    <template #image>
      <div class="flex h-8 w-8 justify-center rounded-full border border-divide bg-main">
        <router-link :to="{ name: 'Journals' }">
          <ly-icon name="activity" class="text-main" />
        </router-link>
      </div>
    </template>
    <template #body>
      <ly-markdown-view :md="model.content.text" class="text-sm" />
    </template>
  </content-details>
</template>

<style scoped></style>
