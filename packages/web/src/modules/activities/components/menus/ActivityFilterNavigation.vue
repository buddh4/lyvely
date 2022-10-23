<script lang="ts" setup>
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { useActivityStore } from '@/modules/activities/store/activity.store';
import { useCalendarPlanStore } from '@/modules/calendar/store';
import { computed, ref, toRefs, watch } from 'vue';
import { TagFilter } from '@lyvely/common';
import { useRouter } from 'vue-router';
import SliderNavigation from '@/modules/ui/components/slider/SliderNavigation.vue';
import useFilterOption from '@/util/composables/useFilterOption';

const profileStore = useProfileStore();
const { dragActive } = toRefs(useCalendarPlanStore());
const { filter } = useActivityStore();
const tags = computed(() => new TagFilter({ archived: false }).apply(profileStore.getTags()));
const activeTagId = computed(() => filter.option('tagId'));
const router = useRouter();
const showFilterDrawer = ref(false);
let fullPath: string | undefined = undefined;

watch(filter, () => {
  const currentRoute = router.currentRoute.value;
  const query = {
    ...currentRoute.query,
    ...filter.getOptionsWithStringValues(),
  };

  if (!filter.option('archived')) {
    delete query.archived;
  }

  if (!filter.option('tagId')) {
    delete query.tagId;
  }

  delete query.type;

  const route = router.resolve({ path: currentRoute.path, query: query });

  if (route.fullPath !== fullPath) {
    // Prevent update loops
    fullPath = route.fullPath;
    router.replace({ path: currentRoute.path, query: query });
  }
});

watch(router.currentRoute, (to) => {
  if (to.fullPath !== fullPath) {
    // Prevent update loops
    fullPath = to.fullPath;
    setFilterFromRoute();
  }
});

function setFilterFromRoute() {
  const currentRoute = router.currentRoute.value;
  filter.reset();
  filter.setOptions(currentRoute.query);
}

setFilterFromRoute();

function setTagFilter(tagId?: string) {
  filter.setOptions({ tagId });
}

const archiveFilter = useFilterOption(filter, 'archived');
const queryFilter = useFilterOption(filter, 'query');

const commonButtonClassNames = 'secondary outlined mr-0.5 inline-flex items-center text-xs py-1 px-1 text-xs';
const pillButton = commonButtonClassNames + ' px-2 rounded';
const roundButton = commonButtonClassNames + ' px-1 rounded';
</script>

<template>
  <nav id="filter-nav" class="flex flex-row content-left clearfix ms-2 me-2 mb-2">
    <ly-button
      :class="roundButton"
      :active="dragActive"
      :aria-label="$t('calendar.plan.aria.drag-toggle-button')"
      @click="dragActive = !dragActive"
    >
      <ly-icon name="drag" />
    </ly-button>

    <slider-navigation class="tag-filter-selection">
      <ly-button :class="pillButton" :active="!activeTagId" @click="setTagFilter()">
        {{ $t('filter.all') }}
      </ly-button>

      <ly-button
        v-for="tag in tags"
        :key="tag.id"
        :class="pillButton"
        :active="filter.option('tagId') === tag.id"
        role="tab"
        aria-controls="calendar-plan"
        :data-tag-id="tag.id"
        @click="setTagFilter(tag.id)"
      >
        {{ tag.name }}
      </ly-button>
    </slider-navigation>

    <div class="ml-auto flex flex-nowrap">
      <ly-button
        class="relative"
        data-filter-button
        :class="[roundButton, 'ml-auto']"
        :active="showFilterDrawer"
        @click="showFilterDrawer = !showFilterDrawer"
      >
        <ly-icon name="filter" />
        <div v-if="!filter.isEmpty()" class="absolute w-1.5 h-1.5 bg-pop right-1 bottom-1.5 rounded-full">&nbsp;</div>
      </ly-button>
    </div>
  </nav>

  <ly-drawer v-model="showFilterDrawer" title="common.filter.title">
    <div class="relative inline-block">
      <input
        ref="search"
        v-model="queryFilter"
        class="search w-full mb-4 py-1"
        :placeholder="$t('common.filter.search')"
        type="text"
      />
      <ly-icon name="search" class="absolute right-2.5 top-2 text-dimmed pointer-events-none" />
    </div>

    <ly-input-checkbox v-model="archiveFilter" class="mb-4" label="common.filter.archive" />

    <ly-button class="primary float-right text-xs" text="common.filter.clear" @click="filter.reset()" />
  </ly-drawer>
</template>

<style scoped>
.slider-nav {
  transition-duration: 0.15s;
  transition-timing-function: cubic-bezier(0.05, 0, 0, 1);
  will-change: transform;
  display: inline-block;
  white-space: nowrap;
}
</style>
