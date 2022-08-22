<script lang="ts" setup>
import Icon from '@/modules/ui/components/icon/Icon.vue';
import Button from '@/modules/ui/components/button/Button.vue';
import { useProfileStore } from '@/modules/user/store/profile.store';
import { useActivityStore } from '@/modules/activity/store/activityStore';
import { useTimingStore } from '@/modules/calendar/store';
import { computed, ref, Ref } from 'vue';

const activityStore = useActivityStore();
const profileStore = useProfileStore();
const timingStore = useTimingStore();
const tags = computed(() => profileStore.getTags('activity.filter'));
const activeTagId = computed(() => activityStore.filter.tagId);
const archiveFilterActive = computed(() => activityStore.filter.archived);
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

</script>

<template>
  <div id="filter-nav" class="flex flex-row content-left clearfix ms-2 me-2 mb-2">
    <Button
      :class="[roundButton]"
      :active="dragActive"
      @click="dragActive = !dragActive">
      <Icon name="drag"/>
    </Button>

    <div ref="container" class="flex tag-filter-selection overflow-hidden whitespace-nowrap relative mr-1">
      <div ref="slider" :style="sliderStyle" class="slider-nav touch-pan-y" @mousedown="beginSlide" @touchstart="beginSlide" >
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
            :data-tag-id="tag.id"
             @click="setTagFilter(tag.id)">
            {{ tag.name }}
          </Button>
        </template>
      </div>
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

<style scoped>
.slider-nav {
  transition-duration: 0.15s;
  transition-timing-function: cubic-bezier(0.05,0,0,1);
  will-change: transform;
  display: inline-block;
  white-space: nowrap;
}


</style>
