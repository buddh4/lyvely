<script lang="ts" setup>
import { MessageModel } from '@lyvely/common';
import ContentStreamEntry from '@/modules/content-stream/components/ContentStreamEntry.vue';

export interface IProps {
  model: MessageModel;
}

const props = defineProps<IProps>();
const name = 'buddh4';
</script>

<template>
  <content-stream-entry :model="model">
    {{ model.content.text }}
  </content-stream-entry>
</template>
