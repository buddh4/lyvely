<script lang="ts" setup>
import { IContentFilter, useContentFilter, t } from '@lyvely/web';
import { LocationQuery, onBeforeRouteLeave, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useCalendarPlanStore } from '@/stores';
import {
  LyButton,
  LyIcon,
  LySliderMenu,
  LyUpdateIndicator,
  LyDrawer,
  LyCheckbox,
} from '@lyvely/ui';
import { ref } from 'vue';

export interface IProps {
  filter: IContentFilter;
}

const showFilterDrawer = ref(false);
const { dragActive } = storeToRefs(useCalendarPlanStore());

const props = withDefaults(defineProps<IProps>(), {});
const emit = defineEmits(['queryHandler']);

const { tags, stopWatch, activeTagId, setTagFilter, queryFilter, archiveFilter } = useContentFilter(
  {
    filter: props.filter,
    router: useRouter(),
    queryHandler: (filter: any, query: LocationQuery) => {
      emit('queryHandler', filter, query);
    },
  }
);

const commonButtonClassNames = 'secondary outlined inline-flex items-center text-xs py-1 px-1';
const pillButton = commonButtonClassNames + ' px-2 rounded';
const roundButton = commonButtonClassNames + ' px-1 rounded';

onBeforeRouteLeave(stopWatch);
</script>

<template>
  <nav id="filter-nav" class="content-left clearfix mb-2 flex flex-row gap-0.5">
    <ly-button
      :class="roundButton"
      :active="dragActive"
      :aria-label="t('calendar-plan.aria.drag-toggle-button')"
      @click="dragActive = !dragActive">
      <ly-icon name="drag" />
    </ly-button>

    <ly-slider-menu class="tag-filter-selection">
      <ly-button :class="pillButton" :active="!activeTagId" @click="setTagFilter()">
        {{ t('filter.all') }}
      </ly-button>

      <ly-button
        v-for="tag in tags"
        :key="tag.id"
        :class="pillButton"
        :active="filter.option('tagId') === tag.id"
        role="tab"
        aria-controls="calendar-plan"
        :data-tag-id="tag.id"
        @click="setTagFilter(tag.id)">
        {{ tag.name }}
      </ly-button>
    </ly-slider-menu>

    <div class="ml-auto flex flex-nowrap">
      <ly-button
        class="relative"
        data-filter-button
        :class="[roundButton, 'ml-auto']"
        :active="showFilterDrawer"
        @click="showFilterDrawer = !showFilterDrawer">
        <ly-icon name="filter" />
        <ly-update-indicator v-if="!filter.isEmpty()" />
      </ly-button>
    </div>
  </nav>

  <ly-drawer v-model="showFilterDrawer" title="common.filter.title">
    <div class="p-4">
      <div class="relative inline-block">
        <input
          ref="search"
          v-model="queryFilter"
          class="search mb-4 w-full py-1"
          :placeholder="t('common.filter.search')"
          type="text" />
        <ly-icon name="search" class="pointer-events-none absolute right-2.5 top-2 text-dimmed" />
      </div>

      <ly-checkbox v-model="archiveFilter" class="mb-4" label="common.filter.archive" />

      <ly-button
        class="primary float-right text-xs"
        text="common.filter.clear"
        @click="filter.reset()" />
    </div>
  </ly-drawer>
</template>

<style scoped></style>
