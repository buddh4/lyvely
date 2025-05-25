<script setup lang="ts">
import { ContentModel, IFileSummary, useContentClient } from '@lyvely/interface';
import { onMounted, ref } from 'vue';
import { downloadBlob } from '@/common';

export interface IProps {
  model: ContentModel;
}

const props = defineProps<IProps>();
const files = ref<IFileSummary[]>([]);
const client = useContentClient();

const download = async (file: IFileSummary) => {
  // TODO: handle error, maybe within downloadBlob?
  const blob = await useContentClient().downloadAttachedFile(props.model.id, file.id);
  downloadBlob(blob, file.name);
};

onMounted(async () => {
  if (!props.model.meta.attachedFileIds?.length) return;
  await client.getAttachedFileInfos(props.model.id).then((result) => (files.value = result.files));
});
</script>

<template>
  <div class="flex gap-1">
    <div
      v-for="file of files"
      :key="file.id"
      role="button"
      class="cursor-pointer rounded border border-divide p-2"
      @click="download(file)">
      {{ file.name }}
    </div>
  </div>
</template>

<style scoped></style>
