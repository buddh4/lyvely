<script lang="ts" setup>
import RelativeTime from '@/modules/calendar/components/RelativeTime.vue';
import TextTrimmed from '@/modules/ui/components/text/TextTrimmed.vue';
import { ContentModel } from '@lyvely/common';
import LyDropdown from '@/modules/ui/components/menu/DropdownMenu.vue';
import { computed } from 'vue';

export interface IProps {
  model: ContentModel;
}

const props = defineProps<IProps>();

const archiveLabel = computed(() => (props.model.meta.isArchived ? 'Restore' : 'Archive'));
function archive() {
  console.log('archive');
  //contentEditStore.archive()
  // contentEditStore.checks
}

function edit() {
  // contentEditStore.edit(content);
  // contentEditStore sets the editmodal or redirects to content edit component/route
}
</script>

<template>
  <div class="p-2 md:p-4 bg-shadow border-divide w-full">
    <div class="flex items-center justify-items-stretch gap-2">
      <slot name="image">
        <ly-user-avatar class="w-8 h-8" />
      </slot>
      <div class="flex flex-col">
        <slot name="title">
          <text-trimmed class="font-bold" :max="130" :text="model.getTitle()" />
          <relative-time :ts="model.meta.createdAt.getTime()"></relative-time>
        </slot>
      </div>
      <div class="flex ml-auto">
        <slot name="menu">
          <ly-dropdown>
            <ly-dropdown-link
              v-if="!model.meta.isArchived"
              icon="edit"
              label="Edit"
              @click="$emit('edit')" />
            <ly-dropdown-link :label="archiveLabel" icon="archive" @click="archive" />
            <slot name="menu-addition"></slot>
          </ly-dropdown>
        </slot>
      </div>
    </div>
  </div>
  <div class="p-2 md:p-4 bg-main border-divide rounded-b">
    <slot name="body">
      {{ model.content.text }}
    </slot>
  </div>
</template>

<style scoped></style>
