<script lang="ts" setup>
import { computed } from 'vue';
import { LyModal, LyFormModel, LySelect, LyTextField } from '@lyvely/ui';
import { useEditChartSeriesStore } from '@/store';
import { getChartDefinitions } from '@/registries/chart-series-web.registry';

export interface IProps {
  cid?: string;
}

defineProps<IProps>();

/*const { reset, submit, isCreate, showModal, baseModel, baseValidator } = useEditChartSeriesStore();
const graphTypes = getChartDefinitions();
const title = computed(() =>
  isCreate.value ? 'analytics.graphs.add.title' : 'analytics.graphs.edit.title',
);*/
</script>

<template>
  <!--ly-modal v-model="showModal" :title="title" @close="reset" @submit="submit">
    <ly-form-model
      v-model="baseModel"
      :validator="baseValidator"
      label-key="analytics.graphs.fields">
      <ly-select property="type" :options="graphTypes" />
      <ly-text-field property="name" />
    </ly-form-model>
  </ly-modal -->
</template>

<style scoped></style>
