<script setup lang="ts">
import { type Translatable, useTwMerge } from '@lyvely/ui';
import type { ContentPickerHandler, IContent } from '@lyvely/interface';
import { uniqueId } from '@lyvely/common';
import { computed, ref } from 'vue';
import { translation } from '@/i18n';

const props = withDefaults(
  defineProps<{
    modelValue: Array<string> | undefined;
    handler: ContentPickerHandler;
    label?: Translatable;
    max?: number;
    id?: string;
  }>(),
  {
    id: uniqueId('tag-picker'),
    label: translation('common.content'),
    max: 1,
  }
);

const searchResult = ref<IContent[]>([]);
const visible = ref(false);
const emit = defineEmits(['update:modelValue']);

const model = computed({
  get: () => props.modelValue || [],
  set: (value: Array<string>) => emit('update:modelValue', value),
});
</script>

<template>
  <ly-floating-input-layout
    :id="id"
    :data-id="id"
    tabindex="0"
    class="floating-input h-auto cursor-pointer"
    :label="label"
    @click="visible = true"
    @keyup.enter.prevent="visible = true">
    <div class="flex pt-2">
      <template v-for="option in selection" :key="getOptionKey(option)">
        <ly-badge
          v-if="option"
          :text="{ plain: getLabel(option) }"
          :color="getColor(option)"
          :class="getBadgeClass(option)"
          :avatar="getAvatar(option)" />
      </template>
    </div>
  </ly-floating-input-layout>
</template>

<style scoped></style>
