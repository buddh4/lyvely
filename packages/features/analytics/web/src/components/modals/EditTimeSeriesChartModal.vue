<script lang="ts" setup>
import { computed } from 'vue';
import { LyModal } from '@lyvely/ui';
import { useUpsertChartTimeSeriesStore } from '@/store';
import ChartTemplateForm from '@/components/forms/ChartTemplateForm.vue';

export interface IProps {
  cid?: string;
}

defineProps<IProps>();

const { reset, submit, isCreate, model, showModal } = useUpsertChartTimeSeriesStore();
const title = computed(() =>
  isCreate.value ? 'analytics.graphs.add.title' : 'analytics.graphs.edit.title',
);
</script>

<template>
  <ly-modal v-model="showModal" :title="title" @close="reset" @submit="submit">
    <chart-template-form v-if="isCreate" v-model="model" :embedded="true" />
  </ly-modal>
</template>

<style scoped></style>
