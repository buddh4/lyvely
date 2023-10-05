<script lang="ts" setup>
import { JournalModel } from '@lyvely/journals-interface';
import ContentDetails from '@/modules/content-stream/components/ContentDetails.vue';

export interface IProps {
  model: JournalModel;
}

const props = defineProps<IProps>();
</script>

<template>
  <content-details :model="model">
    <template #image>
      <div class="flex justify-center rounded-full border border-divide w-8 h-8 bg-main">
        <router-link :to="{ name: 'Habits' }">
          <ly-icon name="activity" class="text-main" />
        </router-link>
      </div>
    </template>
    <template #body>
      {{ model.content.text }}
    </template>
  </content-details>
</template>

<style scoped></style>
