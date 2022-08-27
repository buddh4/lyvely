<script lang="ts" setup>
import TagList from '@/modules/tag/components/TagList.vue';
import Icon from '@/modules/ui/components/icon/Icon.vue';
import TimingListEntryMenu from '@/modules/calendar/components/CalendarPlanItemMenu.vue';
import { useCalendarPlanStore } from '@/modules/calendar/store';
import { TimingModel } from '@lyvely/common';
import { computed, toRefs } from 'vue';

interface Props {
  model: TimingModel,
  draggable?: boolean,
}

const props = withDefaults(defineProps<Props>(), {draggable: true,});

const emit = defineEmits(['details', 'edit', 'archive', 'selectTag', 'moveUp', 'moveDown']);

const calendarPlanStore = useCalendarPlanStore();

const dragActive = computed(() => props.draggable && calendarPlanStore.dragActive);
const classNames = computed(() => [
  'flex',
  'justify-between',
  'calendar-plan-item',
  'bg-main',
  'last:rounded-b',
  {'list-group-item-draggable': dragActive.value},
  'align-items-start'
]);

function selectTag(tagId: string) {
  emit('selectTag', tagId);
}

const { model } = toRefs(props);
</script>

<template>
  <div role="listitem" :data-entry-id="model.id" :class="classNames">
    <button
        v-if="dragActive" class="item-drag-button mr-2 my-auto w-5 cursor-move text-secondary"
        @keyup.shift.up="$emit('moveUp', model, $el)"
        @keyup.shift.down="$emit('moveDown', model, $el)">
      <Icon  name="drag" class="fill-current w-5 "/>
    </button>

    <div class="mr-auto">
      <div class="entry-title-bar flex items-center">
        <slot name="pre-title"></slot>
        <div class="whitespace-nowrap overflow-hidden overflow-ellipsis cursor-pointer" @click="$emit('details')">
          <slot name="title">{{ model.title }}</slot>
        </div>
      </div>
      <TagList :tag-ids="model.tagIds" @select="selectTag"/>
    </div>

    <div>
      <div class="flex flex-col">
        <slot name="menu">
          <TimingListEntryMenu :model="model" @edit="$emit('edit')" @archive="$emit('archive')"/>
        </slot>
        <slot name="rating"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.icon-drag {
  margin-left: -5px;
}
</style>
