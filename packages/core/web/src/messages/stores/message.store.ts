import { defineStore } from 'pinia';
import { ref } from 'vue';
import { CreateMessageModel, MessageModel, useMessageClient } from '@lyvely/interface';
import { I18nModelValidator } from '@/i18n';
import { loadingStatus, useStatus } from '@/core';
import { useContentStore } from '@/content/stores/content.store';

export const useCreateMessageStore = defineStore('create-message', () => {
  const model = ref(new CreateMessageModel({ text: '' }));
  const validator = ref(new I18nModelValidator(model.value));
  const messageClient = useMessageClient();
  const status = useStatus();

  function reset() {
    model.value = new CreateMessageModel({ text: '' });
    validator.value.setModel(model.value);
    status.resetStatus();
  }

  async function submit(parentId?: string) {
    // TODO: Error handling
    if (!(await validator.value.validate())) return;
    const message = new CreateMessageModel({
      text: model.value.text,
      parentId: parentId,
    });
    const response = await loadingStatus(messageClient.create(message), status);
    reset();
    useContentStore().emitPostContentEvent(MessageModel.contentType, 'created', response.model);
    return response.model;
  }

  return {
    model,
    submit,
  };
});
