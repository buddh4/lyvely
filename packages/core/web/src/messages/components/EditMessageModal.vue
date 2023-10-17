<script lang="ts" setup>
import { CreateMessageModel, MessageModel, UpdateMessageModel } from '@lyvely/core-interface';
import { computed } from 'vue';
import { ContentEditModalEmits, useContentEditModal, ICreateContentInitOptions } from '@/content';
import { TagChooser } from '@/tags';
import { isTouchScreen } from '@/ui';
import { useMessageService } from '../services';
import { LyModal, LyFormModel, LyTextField } from '@lyvely/ui';

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
  service: useMessageService(),
});

const modalTitle = computed(() => {
  return isCreate.value ? `messages.create.title` : `messages.update.title`;
});
</script>

<template>
  <ly-modal v-model="showModal" :title="modalTitle" @submit="submit" @cancel="$emit('cancel')">
    <template #preHeader><slot name="navigation"></slot></template>
    <ly-form-model
      v-model="model"
      :validator="validator"
      :status="status"
      label-key="messages.fields">
      <fieldset>
        <ly-text-field
          property="text"
          :required="true"
          :autofocus="isCreate || !isTouchScreen()"
          :auto-validation="false" />
      </fieldset>

      <fieldset>
        <tag-chooser v-model="model.tagNames" />
      </fieldset>
    </ly-form-model>
  </ly-modal>
</template>

<style scoped></style>
