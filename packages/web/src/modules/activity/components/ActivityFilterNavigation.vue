<script lang="ts" setup>
import Icon from '@/modules/ui/components/icon/Icon.vue';
import Button from '@/modules/ui/components/button/Button.vue';
import Drawer from '@/modules/ui/components/drawer/Drawer.vue';
import { useProfileStore } from '@/modules/profile/stores/profile.store';
import { useActivityStore } from '@/modules/activity/store/activityStore';
import { useCalendarPlanStore } from '@/modules/calendar/store';
import { computed, ref, toRefs, watch } from 'vue';
import { TagFilter } from "@lyvely/common";
import Checkbox from "@/modules/ui/components/form/Checkbox.vue";
import { useRouter } from "vue-router";
import SliderNavigation from "@/modules/ui/components/slider/SliderNavigation.vue";

const profileStore = useProfileStore();
const { dragActive } = toRefs(useCalendarPlanStore());
const { filter } = useActivityStore();
const tags = computed(() => new TagFilter({ archived: false }).apply(profileStore.getTags()));
const activeTagId = computed(() => filter.option('tagId'));
const router = useRouter();
const showFilterDrawer = ref(false);

watch(filter, () => {
  const currentRoute = router.currentRoute.value;
  const query = { ...currentRoute.query, ...filter.getOptionsWithStringValues() };

  delete query.type;
  if(query.archived === false) {
    delete query.archived;
  }

  router.replace({ path: currentRoute.path, query: query })
});

function setFilterFromRoute() {
  const currentRoute = router.currentRoute.value;
  filter.setOptions(currentRoute.query);
}

setFilterFromRoute();

function setTagFilter(tagId?: string) {
  filter.setOptions({ tagId });
}

const isArchivedFilter = computed({
  get: () => !!filter.option('archived'),
  set: (val: boolean) => filter.setOption('archived', val)
});

const commonButtonClassNames = 'secondary outlined mr-0.5 inline-flex items-center text-xs py-1 px-1 text-xs';
const pillButton = commonButtonClassNames + ' px-2 rounded';
const roundButton = commonButtonClassNames + ' px-1 rounded';
</script>

<template>
  <nav id="filter-nav" class="flex flex-row content-left clearfix ms-2 me-2 mb-2">
    <Button
      :class="roundButton"
      :active="dragActive"
      :aria-label="$t('calendar.plan.aria.drag-toggle-button')"
      @click="dragActive = !dragActive">
      <Icon name="drag"/>
    </Button>

    <SliderNavigation class="tag-filter-selection">
      <Button
          :class="pillButton"
          :active="!activeTagId"
          @click="setTagFilter(null)">
        {{ $t('filter.all') }}
      </Button>

      <Button
          v-for="tag in tags" :key="tag.id"
          :class="pillButton"
          :active="filter.option('tagId') === tag.id"
          role="tab"
          aria-controls="calendar-plan"
          :data-tag-id="tag.id"
          @click="setTagFilter(tag.id)">
        {{ tag.name }}
      </Button>
    </SliderNavigation>

    <div class="ml-auto flex flex-nowrap">
      <Button
          class="relative"
          data-filter-button :class="[roundButton, 'ml-auto']"
          :active="showFilterDrawer"
          @click="showFilterDrawer = !showFilterDrawer">
        <Icon name="filter" />
        <div v-if="!filter.isEmpty()" class="absolute w-1.5 h-1.5 bg-pop right-1 bottom-1.5 rounded-full">&nbsp;</div>
      </Button>
    </div>
  </nav>

  <Drawer v-model="showFilterDrawer" title="common.filter.title">
    <div class="relative inline-block">
      <input ref="search" v-model="filter.query" class="search w-full mb-4 py-1" :placeholder="$t('common.filter.search')" type="text" />
      <Icon name="search" class="absolute right-2.5 top-2 text-dimmed pointer-events-none"  />
    </div>

    <Checkbox v-model="isArchivedFilter" class="mb-4" label="common.filter.archive" />

    <Button class="primary float-right text-xs" text="common.filter.clear" @click="filter.reset()" />
  </Drawer>
</template>

<style scoped>
.slider-nav {
  transition-duration: 0.15s;
  transition-timing-function: cubic-bezier(0.05,0,0,1);
  will-change: transform;
  display: inline-block;
  white-space: nowrap;
}
</style>
