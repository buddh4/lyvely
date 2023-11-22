<script lang="ts" setup>
import { MessageModel } from '@lyvely/interface';
import { ContentDetails } from '@/content';

export interface IProps {
  model: MessageModel;
}

defineProps<IProps>();
</script>

<template>
  <content-details :model="model" :show-type="false" />
</template>
