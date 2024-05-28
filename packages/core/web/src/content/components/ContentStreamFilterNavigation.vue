<script lang="ts" setup>
import { useProfileStore } from '@/profiles/stores/profile.store';
import { t } from '@/i18n';
import { computed, ref, watch } from 'vue';
import { TagFilter } from '@lyvely/interface';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import { useDebounceFn } from '@vueuse/core';
import { useContentStreamFilter } from '../stores';

const { filter } = useContentStreamFilter();
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

const commonButtonClassNames = 'secondary outlined inline-flex items-center py-1 px-1 text-xs';
const pillButton = commonButtonClassNames + ' px-2 rounded';
const roundButton = commonButtonClassNames + ' px-1 rounded';

onBeforeRouteLeave(unwatchFilter);
</script>

<template>
  <nav data-id="stream-filter-nav" class="content-left clearfix flex flex-row gap-0.5">
    <ly-slider-menu class="tag-filter-selection">
      <ly-button :class="pillButton" :active="!activeTagId" @click="setTagFilter()">
        {{ t('filter.all') }}
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
        data-id="btn-stream-filter-toggle"
        class="relative"
        :class="[roundButton, 'ml-auto']"
        :active="showFilterDrawer"
        @click="showFilterDrawer = !showFilterDrawer">
        <ly-icon name="filter" />
        <ly-update-indicator v-if="!filter.isEmpty()" />
      </ly-button>
    </div>
  </nav>

  <ly-drawer v-model="showFilterDrawer" title="content.stream.filter.title">
    <div class="p-4">
      <div class="relative inline-block">
        <input
          ref="search"
          v-model.trim="query"
          class="search mb-4 w-full py-1"
          :placeholder="t('common.filter.search')"
          type="text" />
        <ly-icon name="search" class="pointer-events-none absolute right-2.5 top-2 text-dimmed" />
      </div>

      <ly-checkbox v-model="filter.archived" class="mb-4" label="common.filter.archive" />

      <ly-button
        class="primary float-right text-xs"
        text="common.filter.clear"
        @click="filter.reset()" />
    </div>
  </ly-drawer>
</template>

<style scoped></style>
