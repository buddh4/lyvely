<script lang="ts" setup>
import TagList from '@/modules/tags/components/TagList.vue';

import { useCalendarPlanStore } from '@/modules/calendar/stores/calendar-plan.store';
import { TimeSeriesContentModel } from '@lyvely/common';
import { computed, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { toContentDetails } from '@/modules/content-stream';

export interface IProps {
  model: TimeSeriesContentModel;
  draggable?: boolean;
}

const props = withDefaults(defineProps<IProps>(), { draggable: true });

const emit = defineEmits(['details', 'selectTag', 'moveUp', 'moveDown']);

const calendarPlanStore = useCalendarPlanStore();

const dragActive = computed(() => props.draggable && calendarPlanStore.dragActive);
const classNames = computed(() => [
  'flex',
  'justify-between',
  'calendar-plan-item',
  'bg-main',
  'last:rounded-b',
  { 'list-group-item-draggable': dragActive.value },
  'align-items-start',
]);

function selectTag(tagId: string) {
  emit('selectTag', tagId);
}

const router = useRouter();

function showDetails() {
  router.push(toContentDetails(model.value));
}

const { model } = toRefs(props);
</script>

<template>
  <div role="listitem" :data-entry-id="model.id" :class="classNames">
    <button
      v-if="dragActive"
      class="item-drag-button mr-2 my-auto w-5 cursor-move text-secondary"
      @keyup.shift.up="$emit('moveUp', model, $el)"
      @keyup.shift.down="$emit('moveDown', model, $el)">
      <ly-icon name="drag" class="fill-current w-5" />
    </button>

    <div class="overflow-hidden relative flex-grow">
      <div class="entry-title-bar flex items-center">
        <slot name="pre-title"></slot>
        <div
          class="whitespace-nowrap overflow-hidden overflow-ellipsis cursor-pointer"
          @click="showDetails">
          <slot name="title">
            <div class="flex items-center">
              <span class="whitespace-nowrap overflow-hidden">
                {{ model.content.title }}
              </span>
              <ly-badge v-if="model.meta.isArchived" class="bg-danger ml-2">
                {{ $t('common.archived') }}
              </ly-badge>
            </div>
          </slot>
        </div>
        <div class="overflow-item"></div>
      </div>
      <tag-list class="mt-2" :tag-ids="model.tagIds" @select="selectTag" />
    </div>

    <div>
      <div class="flex flex-col items-end">
        <div class="ml-auto pb-3">
          <slot name="menu"></slot>
        </div>
        <slot name="rating"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#ffffff+0,000000+100&0+0,1+100 */
.overflow-item {
  position: absolute;
  top: 0;
  right: 0;
  width: 32px;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    var(--elements-main) 72%,
    var(--elements-main) 100%
  ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
}
</style>
