<script lang="ts" setup>
import TagList from '@/modules/calendar/components/TagList.vue';
import Icon from '@/modules/ui/components/icon/Icon.vue';
import TimingListEntryMenu from '@/modules/calendar/components/TimingListEntryMenu.vue';
import { useTimingStore } from '@/modules/calendar/store';
import { TimingModel } from '@lyvely/common';
import { computed, toRefs } from 'vue';

interface Props {
  model: TimingModel,
  draggable?: boolean,
}

const props = withDefaults(defineProps<Props>(), {draggable: true,});

defineEmits(['details', 'edit', 'archive']);

const timingStore = useTimingStore();

const dragActive = computed(() => props.draggable && timingStore.dragActive);
const classNames = computed(() => [
  'flex',
  'justify-between',
  'calendar-plan-item',
  {'list-group-item-draggable': dragActive.value},
  'align-items-start'
]);

const { model } = toRefs(props);
</script>

<template>
  <div :data-entry-id="model.id" :class="classNames">
    <Icon v-if="dragActive" name="drag" class="mr-2 text-secondary fill-current my-auto w-5 cursor-pointer"/>

    <div class="mr-auto">
      <div class="entry-title-bar flex items-center justify-center">
        <slot name="pre-title"></slot>
        <div class="whitespace-nowrap overflow-hidden overflow-ellipsis cursor-pointer" @click="$emit('details')">
          <slot name="title">{{ model.title }}</slot>
        </div>
      </div>
      <TagList :tag-ids="model.tagIds"/>
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
