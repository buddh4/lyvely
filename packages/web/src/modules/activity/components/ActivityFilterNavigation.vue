<script lang="ts" setup>
import Icon from '@/modules/ui/components/icon/Icon.vue';
import Button from '@/modules/ui/components/button/Button.vue';
import { useProfileStore } from '@/modules/user/store/profile.store';
import { useActivityStore } from '@/modules/activity/store/activityStore';
import { useTimingStore } from '@/modules/calendar/store';
import { computed } from 'vue';

const activityStore = useActivityStore();
const profileStore = useProfileStore();
const timingStore = useTimingStore();
const tags = computed(() => profileStore.getTags('activity.filter'));
const activeTagId = computed(() => activityStore.filter.tagId);
const archiveFilterActive = computed(() => activityStore.filter.tagId);
const dragActive = computed({
  get: () => timingStore.dragActive,
  set: (val: boolean) => timingStore.setDragActive(val)
});

function isChecked(filter: string): boolean {
  if (filter === 'archive') {
    return activityStore.filter.archived;
  }

  return activeTagId.value === filter;
}

function setTagFilter(tagId: string) {
  activityStore.updateFilter({ tagId });
}

function toggleArchiveFilter() {
  activityStore.updateFilter({ archived: !archiveFilterActive.value })
}

const commonButtonClassNames = 'secondary outlined mr-0.5 inline-flex items-center text-xs py-1 px-1 text-xs';
const pillButton = commonButtonClassNames + ' px-2 rounded';
const roundButton = commonButtonClassNames + ' px-1 rounded';
</script>

<template>
  <div id="filter-nav" class="flex flex-row content-left clearfix ms-2 me-2 mb-2">
    <Button
      :class="[roundButton]"
      :active="dragActive"
      @click="dragActive = !dragActive">
      <Icon name="drag"/>
    </Button>

    <div class="flex overflow-auto mr-1">
      <Button
        :class="pillButton"
        :active="!activeTagId"
        @click="setTagFilter(null)">
        All
      </Button>

      <template v-for="tag in tags" :key="tag.id">
        <Button
          :class="pillButton"
          :active="isChecked(tag.id)"
          :data-tag-id="tag.id"
           @click="setTagFilter(tag.id)">
          {{ tag.name }}
        </Button>
      </template>
    </div>

    <div class="ml-auto flex flex-nowrap">
      <Button
data-filter-button :class="[roundButton, 'ml-auto']"
              :active="archiveFilterActive"
              @click="toggleArchiveFilter()">
        <Icon name="filter" />
      </Button>
    </div>
  </div>
</template>

<style scoped></style>
