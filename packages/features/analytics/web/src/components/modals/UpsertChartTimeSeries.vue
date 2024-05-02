<script lang="ts" setup>
import { computed } from 'vue';
import { LyModal, LyButton } from '@lyvely/ui';
import { useUpsertChartSeriesStore } from '@/store';
import ChartTemplateForm from '@/components/forms/ChartTemplateForm.vue';

const { deleteSeries, reset, submit, isCreate, model, showModal } = useUpsertChartSeriesStore();
const title = computed(() =>
  isCreate.value ? 'analytics.series.add.title' : 'analytics.series.edit.title',
);
</script>

<template>
  <ly-modal v-model="showModal" :title="title" @close="reset" @submit="submit">
    <chart-template-form v-model="model" :is-create="isCreate" :embedded="true" />
    <template #pre-footer>
      <ly-button
        v-if="!isCreate"
        class="mr-auto danger"
        text="common.delete"
        @click="deleteSeries" />
    </template>
  </ly-modal>
</template>

<style scoped></style>
