<script lang="ts" setup>
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { computed, ref, watch } from 'vue';
import { TagFilter } from '@lyvely/profiles-interface';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import { useDebounceFn } from '@vueuse/core';
import { useContentStreamFilterStore } from '@/modules/content-stream/stores/content-stream-filter.store';
import { storeToRefs } from 'pinia';

const { filter } = storeToRefs(useContentStreamFilterStore());
const query = ref(filter.value.query);

const updateQuery = useDebounceFn((value: string) => {
  filter.value.query = value;
}, 600);

watch(query, (newValue) => {
  updateQuery(newValue as string);
});

const profileStore = useProfileStore();
const tags = computed(() => new TagFilter({ archived: false }).apply(profileStore.getTags()));

const router = useRouter();
const showFilterDrawer = ref(false);

const activeTagId = computed(() => !!filter.value.tagIds?.length);

function setTagFilter(id?: string) {
  if (id) {
    filter.value.toggleTag(id);
  } else {
    filter.value.setTagIds([]);
  }
}

const unwatchFilter = watch(
  filter,
  () => {
    const currentRoute = router.currentRoute.value;
    const query = filter.value.mergeQuery(currentRoute.query);
    const route = router.resolve({ path: currentRoute.path, query });

    if (route.fullPath !== currentRoute.fullPath) {
      router.replace({ path: currentRoute.path, query: query });
    }
  },
  { deep: true },
);

const commonButtonClassNames =
  'secondary outlined inline-flex items-center text-xs py-1 px-1 text-xs';
const pillButton = commonButtonClassNames + ' px-2 rounded';
const roundButton = commonButtonClassNames + ' px-1 rounded';

onBeforeRouteLeave(unwatchFilter);
</script>

<template>
  <nav id="stream-filter-nav" class="flex flex-row gap-0.5 content-left clearfix mb-2">
    <ly-slider-menu class="tag-filter-selection">
      <ly-button :class="pillButton" :active="!activeTagId" @click="setTagFilter()">
        {{ $t('filter.all') }}
      </ly-button>

      <ly-button
        v-for="tag in tags"
        :key="tag.id"
        :class="pillButton"
        :active="filter.isActiveTag(tag.id)"
        role="tab"
        aria-controls="contentStreamRoot"
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
          v-model.trim="query"
          class="search w-full mb-4 py-1"
          :placeholder="$t('common.filter.search')"
          type="text" />
        <ly-icon name="search" class="absolute right-2.5 top-2 text-dimmed pointer-events-none" />
      </div>

      <ly-input-checkbox v-model="filter.archived" class="mb-4" label="common.filter.archive" />

      <ly-button
        class="primary float-right text-xs"
        label="common.filter.clear"
        @click="filter.reset()" />
    </div>
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
