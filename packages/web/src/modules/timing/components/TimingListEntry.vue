<script lang="ts" setup>
import CategoryList from '@/modules/timing/components/CategoryList.vue';
import Icon from '@/modules/ui/components/icon/Icon.vue';
import TimingListEntryMenu from '@/modules/timing/components/TimingListEntryMenu.vue';
import { useTimingStore } from '@/modules/timing/store';
import { TimingModel } from 'lyvely-common';
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
  'timing-list-item',
  {'list-group-item-draggable': dragActive.value},
  'align-items-start'
]);

const { model } = toRefs(props);
</script>

<template>
  <li :data-entry-id="model.id" :class="classNames">
    <Icon v-if="dragActive" name="drag" class="mr-2 text-secondary fill-current my-auto w-5 cursor-pointer"/>

    <div class="mr-auto">
      <div class="entry-title-bar">
        <div class="float-left">
          <slot name="pre-title"></slot>
        </div>
        <div class="whitespace-nowrap overflow-hidden overflow-ellipsis cursor-pointer" @click="$emit('details')">
          <slot name="title">{{ model.title }}</slot>
        </div>
      </div>
      <CategoryList :categories="model.categories"/>
    </div>

    <div class="self-end">
      <div class="flex flex-col">
        <slot name="menu">
          <TimingListEntryMenu :model="model" @edit="$emit('edit')" @archive="$emit('archive')"/>
        </slot>
        <slot name="rating"></slot>
      </div>
    </div>
  </li>
</template>

<style scoped>
.icon-drag {
  margin-left: -5px;
}
</style>
