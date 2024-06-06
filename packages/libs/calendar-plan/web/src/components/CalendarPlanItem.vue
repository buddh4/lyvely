<script lang="ts" setup>
import { useCalendarPlanStore } from '../stores';
import { ICalendarPlanEntry } from '@lyvely/calendar-plan-interface';
import { computed, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { toContentDetails, translate, TagList } from '@lyvely/web';
import { LyIcon, LyBadge } from '@lyvely/ui';

export interface IProps {
  model: ICalendarPlanEntry;
  draggable?: boolean;
}

const props = withDefaults(defineProps<IProps>(), { draggable: true });

const emit = defineEmits(['details', 'selectTag', 'moveUp', 'moveDown']);

const calendarPlanStore = useCalendarPlanStore();

const dragActive = computed(() => props.draggable && calendarPlanStore.dragActive);
const classNames = computed(() => [
  'flex',
  'justify-between',
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
  <div
    class="calendar-plan-item px-3 py-2"
    role="listitem"
    :data-cid="model.id"
    :data-sort-order="model.meta.sortOrder">
    <div :class="classNames">
      <button
        v-if="dragActive"
        type="button"
        class="item-drag-button my-auto mr-2 w-5 cursor-move text-secondary"
        @keyup.shift.up="$emit('moveUp', model, $el)"
        @keyup.shift.down="$emit('moveDown', model, $el)">
        <ly-icon name="drag" class="w-5 fill-current" />
      </button>

      <div class="relative flex-grow">
        <div class="entry-title-bar flex items-center">
          <slot name="pre-title"></slot>
          <div class="cursor-pointer" @click="showDetails">
            <slot name="title">
              <div class="flex items-center">
                <span>
                  {{ model.content.title }}
                </span>
                <ly-badge v-if="model.meta.archived" class="ml-2 bg-danger">
                  {{ translate('common.archived') }}
                </ly-badge>
              </div>
            </slot>
          </div>
          <slot name="post-title"></slot>
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

    <slot name="body"></slot>
    <slot name="footer"></slot>
  </div>
</template>
