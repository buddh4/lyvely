<script lang="ts" setup>
import Icon from '@/modules/ui/components/icon/Icon.vue';
import Button from '@/modules/ui/components/button/Button.vue';
import { useProfileStore } from '@/modules/user/store/profile.store';
import { useActivityStore } from '@/modules/activity/store/activityStore';
import { useTimingStore } from '@/modules/timing/store';
import { computed } from 'vue';

const activityStore = useActivityStore();
const profileStore = useProfileStore();
const timingStore = useTimingStore();
const categories = computed(() => profileStore.categoryOptions);
const activeCategory = computed(() => activityStore.filter.category);
const archiveFilterActive = computed(() => activityStore.filter.category);
const dragActive = computed({
  get: () => timingStore.dragActive,
  set: (val: boolean) => timingStore.setDragActive(val)
});

function isChecked(filter: string): boolean {
  if (filter === 'archive') {
    return activityStore.filter.archived;
  }

  return activeCategory.value === filter;
}

function setCategoryFilter(category: string) {
  activityStore.updateFilter({ category: category });
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
        :active="!activeCategory"
        @click="setCategoryFilter(null)">
        All
      </Button>


      <template v-for="category in categories" :key="category">
        <Button :class="pillButton"
                :active="isChecked(category)"
                @click="setCategoryFilter(category)">
          {{ category }}
        </Button>
      </template>
    </div>

    <div class="ml-auto flex flex-nowrap">


    <Button data-filter-button :class="[roundButton, 'ml-auto']"
            :active="archiveFilterActive"
            @click="toggleArchiveFilter()">
      <Icon name="filter" />
    </Button>
    </div>
  </div>
</template>

<style scoped></style>
