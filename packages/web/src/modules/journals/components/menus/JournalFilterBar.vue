<script lang="ts" setup>
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { useCalendarPlanStore } from '@/modules/calendar/stores/calendar-plan.store';
import { computed, ref, toRefs, watch } from 'vue';
import { TagFilter } from '@lyvely/common';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import SliderNavigation from '@/modules/ui/components/slider/SliderNavigation.vue';
import LyUpdateIndicator from '@/modules/ui/components/button/ButtonUpdateIndicator.vue';
import { useJournalStore } from '@/modules/journals/stores/journals.store';

const profileStore = useProfileStore();
const { dragActive } = toRefs(useCalendarPlanStore());
const { filter } = useJournalStore();

const tags = computed(() => new TagFilter({ archived: false }).apply(profileStore.getTags()));
const activeTagId = computed(() => filter.option('tagId'));
const router = useRouter();
const showFilterDrawer = ref(false);
let filterPath: string | undefined = undefined;

const unwatchFilter = watch(filter, () => {
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

  if (route.fullPath !== currentRoute.fullPath) {
    // Prevent update loops
    filterPath = route.fullPath;
    router.replace({ path: currentRoute.path, query: query });
  }
});

watch(
  router.currentRoute,
  (to) => {
    if (to.fullPath !== filterPath) {
      // Prevent update loops
      filterPath = to.fullPath;
      setFilterFromRoute();
    }
  },
  { immediate: true },
);

function setFilterFromRoute() {
  const currentRoute = router.currentRoute.value;
  filter.reset();
  filter.setOptions(currentRoute.query);
}

function setTagFilter(tagId?: string) {
  filter.setOptions({ tagId });
}

const commonButtonClassNames =
  'secondary outlined mr-0.5 inline-flex items-center text-xs py-1 px-1 text-xs';
const pillButton = commonButtonClassNames + ' px-2 rounded';
const roundButton = commonButtonClassNames + ' px-1 rounded';

// This prevents a routing error, since to the filter watcher is triggered on profile changes while navigating.
onBeforeRouteLeave(unwatchFilter);
</script>

<template>
  <nav id="filter-nav" class="flex flex-row content-left clearfix ms-2 me-2 mb-2">
    <ly-button
      :class="roundButton"
      :active="dragActive"
      :aria-label="$t('calendar.plan.aria.drag-toggle-button')"
      @click="dragActive = !dragActive">
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
        @click="setTagFilter(tag.id)">
        {{ tag.name }}
      </ly-button>
    </slider-navigation>

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
</template>

<style scoped></style>
