<script lang="ts" setup>
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { ProfileType } from '@lyvely/common';
import { computed } from 'vue';

export interface IProps {
  modelValue: string;
}

const props = defineProps<IProps>();
const emit = defineEmits(['update:modelValue', 'submit']);

const message = computed({
  get: () => props.modelValue,
  set: (val: string) => emit('update:modelValue', val),
});

const profileStore = useProfileStore();
const placeholderKey =
  profileStore.profile!.type === ProfileType.User
    ? 'stream.editor.placeholder_single_user'
    : 'stream.editor.placeholder_multi_user';
</script>

<template>
  <div class="flex flex-col">
    <div class="flex gap-1">
      <ly-button class="primary rounded-full w-10 h-10 flex items-center"
        ><ly-icon name="plus"></ly-icon
      ></ly-button>
      <input
        v-model="message"
        type="text"
        class="rounded-full"
        :placeholder="$t(placeholderKey)"
        @keyup.enter="$emit('submit')" />
      <ly-button class="primary rounded-full w-10 h-10 flex items-center" @click="$emit('submit')">
        <ly-icon name="send"></ly-icon
      ></ly-button>
    </div>
  </div>
</template>

<style scoped></style>
