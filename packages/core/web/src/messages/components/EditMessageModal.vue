<script lang="ts" setup>
import {
  CreateMessageModel,
  MessageModel,
  UpdateMessageModel,
  useMessageClient,
} from '@lyvely/interface';
import { computed } from 'vue';
import { ContentEditModalEmits, useContentEditModal, ICreateContentInitOptions } from '@/content';
import { TagPicker } from '@/tags';
import { isTouchScreen, LyModal, LyFormModel } from '@lyvely/ui';

export interface IProps {
  modelValue: boolean;
  content?: MessageModel;
  type: string;
  initOptions?: ICreateContentInitOptions;
}

const props = defineProps<IProps>();
const emit = defineEmits(ContentEditModalEmits);

const { isCreate, showModal, model, validator, submit, status } = useContentEditModal<
  MessageModel,
  CreateMessageModel,
  UpdateMessageModel
>(props, emit, {
  client: useMessageClient(),
});

const modalTitle = computed(() => {
  return isCreate.value ? `messages.create.title` : `messages.update.title`;
});
</script>

<template>
  <ly-modal v-model="showModal" :title="modalTitle" @submit="submit" @cancel="$emit('cancel')">
    <template #preHeader><slot name="navigation"></slot></template>
    <ly-form-model
      id="edit-message"
      v-model="model"
      :validator="validator"
      :status="status"
      label-key="messages.fields">
      <fieldset>
        <ly-textarea
          property="text"
          :required="true"
          :autofocus="isCreate || !isTouchScreen()"
          :auto-validation="false" />
      </fieldset>

      <fieldset>
        <tag-picker id="edit-message-tag-picker" v-model="model.tagNames" option-key="name" />
      </fieldset>
    </ly-form-model>
  </ly-modal>
</template>

<style scoped></style>
