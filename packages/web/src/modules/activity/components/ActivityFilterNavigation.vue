<script lang="ts" setup>
import Icon from '@/modules/ui/components/icon/Icon.vue';
import Button from '@/modules/ui/components/button/Button.vue';
import Drawer from '@/modules/ui/components/drawer/Drawer.vue';
import { useProfileStore } from '@/modules/profile/stores/profile.store';
import { useActivityStore } from '@/modules/activity/store/activityStore';
import { useCalendarPlanStore } from '@/modules/calendar/store';
import { computed, ref, Ref, defineEmits } from 'vue';
import { TagFilter } from "@lyvely/common/src/tags/tag.filter";
import Checkbox from "@/modules/ui/components/form/Checkbox.vue";
import TextInput from "@/modules/ui/components/form/TextInput.vue";
import Index from "../../../../index.html";

const activityStore = useActivityStore();
const profileStore = useProfileStore();
const calendarPlanStore = useCalendarPlanStore();
const tags = computed(() => new TagFilter({ archived: false }).apply(profileStore.getTags()));
const activeTagId = computed(() => activityStore.filter.tagId);
const archiveFilterActive = computed(() => activityStore.filter.archived);
const { filter } = activityStore;
const dragActive = computed({
  get: () => calendarPlanStore.dragActive,
  set: (val: boolean) => calendarPlanStore.setDragActive(val)
});

defineEmits(['openDrawer']);

function isChecked(filter: string): boolean {
  if (filter === 'archive') {
    return activityStore.filter.archived;
  }

  return activeTagId.value === filter;
}

function setTagFilter(tagId: string) {
  activityStore.updateFilter({ tagId });
}

const commonButtonClassNames = 'secondary outlined mr-0.5 inline-flex items-center text-xs py-1 px-1 text-xs';
const pillButton = commonButtonClassNames + ' px-2 rounded';
const roundButton = commonButtonClassNames + ' px-1 rounded';

const slideActive = ref(false);
const slideX = ref(0);
const slideTransformX = ref(0);
const slider = ref(null) as Ref<HTMLElement|null>;
const container = ref(null) as Ref<HTMLElement|null>;

const getX = (evt: MouseEvent|TouchEvent) => evt instanceof MouseEvent ? evt.clientX : evt.touches[0].clientX;

function beginSlide(evt: MouseEvent|TouchEvent) {
  if(!container.value || !slider.value) {
    return;
  }

  const overflow = slider.value.offsetWidth - container.value.offsetWidth - 2;

  if(overflow <= 0) {
    return;
  }

  slideX.value= getX(evt);

  const slideHandler = (evt: MouseEvent|TouchEvent) => slide(evt, overflow);
  const endSlide = () => {
    slideActive.value = false;
    document.removeEventListener('mousemove', slideHandler);
    document.removeEventListener('touchmove', slideHandler);
  }

  document.addEventListener('mouseup', endSlide, { once: true });
  document.addEventListener('touchend', endSlide, { once: true });
  document.addEventListener('mousemove', slideHandler);
  document.addEventListener('touchmove', slideHandler);
}

function slide(evt: MouseEvent|TouchEvent, overflow: number) {
  const clientX = getX(evt);
  const diff = Math.abs(slideX.value - clientX);

  if(diff < 5) {
    return;
  } else if(!slideActive.value) {
    slideActive.value = true;
  }

  slideTransformX.value =(slideX.value > clientX)
      ? Math.max(slideTransformX.value - diff, -(overflow))
      : Math.min(0, slideTransformX.value + diff);

  slideX.value = clientX;
}

const sliderStyle = computed(() => {
  return { transform: `translateX(${slideTransformX.value}px)`, 'pointer-events': slideActive.value ? 'none' : 'all' };
});

const showFilterDrawer = ref(false);

const search = ref(null) as Ref<HTMLElement|null>;

function focusSearch() {
  search.value?.focus();
}
</script>

<template>
  <nav id="filter-nav" class="flex flex-row content-left clearfix ms-2 me-2 mb-2">
    <Button
      :class="[roundButton]"
      :active="dragActive"
      :aria-label="$t('calendar.plan.aria.drag-toggle-button')"
      @click="dragActive = !dragActive">
      <Icon name="drag"/>
    </Button>

    <div ref="container" class="flex tag-filter-selection overflow-x-hidden whitespace-nowrap relative mr-1">
      <div ref="slider" :style="sliderStyle" class="slider-nav  touch-pan-y" @mousedown="beginSlide" @touchstart="beginSlide" >
        <Button
          :class="pillButton"
          :active="!activeTagId"
          @click="setTagFilter(null)">
          {{ $t('filter.all') }}
        </Button>

        <template v-for="tag in tags" :key="tag.id">
          <Button
            :class="pillButton"
            :active="isChecked(tag.id)"
            role="tab"
            aria-controls="calendar-plan"
            :data-tag-id="tag.id"
             @click="setTagFilter(tag.id)">
            {{ tag.name }}
          </Button>
        </template>
      </div>
    </div>

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

    <Checkbox v-model="filter.archived" label="common.filter.archive" />
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
