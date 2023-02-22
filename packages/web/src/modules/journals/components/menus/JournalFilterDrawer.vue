<script lang="ts" setup>
import useFilterOption from '@/util/composables/useFilterOption';
import { useJournalPlanStore } from '@/modules/journals/stores/journal-plan.store';
import { storeToRefs } from 'pinia';

const journalStore = useJournalPlanStore();
const { filter } = journalStore;
const { showFilterDrawer } = storeToRefs(journalStore);
const archiveFilter = useFilterOption(filter, 'archived');
const queryFilter = useFilterOption(filter, 'query');
</script>

<template>
  <ly-drawer v-model="showFilterDrawer" title="common.filter.title">
    <div class="p-4">
      <div class="relative inline-block">
        <input
          ref="search"
          v-model="queryFilter"
          class="search w-full mb-4 py-1"
          :placeholder="$t('common.filter.search')"
          type="text" />
        <ly-icon name="search" class="absolute right-2.5 top-2 text-dimmed pointer-events-none" />
      </div>

      <ly-input-checkbox v-model="archiveFilter" class="mb-4" label="common.filter.archive" />

      <ly-button
        class="primary float-right text-xs"
        text="common.filter.clear"
        @click="filter.reset()" />
    </div>
  </ly-drawer>
</template>

<style scoped></style>
