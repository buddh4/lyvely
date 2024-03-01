<script lang="ts" setup>
import { computed } from 'vue';
import { LyModal, LyFormModel, LySelect, LyTextField } from '@lyvely/ui';
import { useEditGraphSeriesStore } from '@/store';
import { getGraphTypeDefinitions } from '@/registries/graph-type-definition.registry';

export interface IProps {
  cid?: string;
}

const props = defineProps<IProps>();

const editGraphStore = useEditGraphSeriesStore();
const { reset, submit, isCreate, showModal, baseModel, baseValidator } = editGraphStore;
const graphTypes = getGraphTypeDefinitions();
const title = computed(() =>
  isCreate.value ? 'analytics.graphs.add.title' : 'analytics.graphs.edit.title',
);
</script>

<template>
  <ly-modal v-model="showModal" :title="title" @close="reset" @submit="submit">
    <ly-form-model
      v-model="baseModel"
      :validator="baseValidator"
      label-key="analytics.graphs.fields">
      <ly-select property="type" :options="graphTypes" />
      <ly-text-field property="name" />
    </ly-form-model>
  </ly-modal>
</template>

<style scoped></style>
