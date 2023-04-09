<script lang="ts" setup>
import { MilestoneModel } from '@lyvely/common';
import ContentDetails from '@/modules/content-stream/components/ContentDetails.vue';

export interface IProps {
  model: MilestoneModel;
}

const props = defineProps<IProps>();
</script>

<template>
  <content-details :model="model">
    <template #image>
      <div class="flex justify-center rounded-full border border-divide w-8 h-8 bg-main">
        <router-link :to="{ name: 'Milestones' }">
          <ly-icon name="milestone" class="text-main" />
        </router-link>
      </div>
    </template>
    <template #body> <ly-input-checkbox :label="model.content.title" /> </template>
  </content-details>
</template>

<style scoped></style>
