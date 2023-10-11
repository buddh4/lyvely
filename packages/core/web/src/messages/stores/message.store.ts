import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useMessageService } from '@/messages/services/message.service';
import { CreateMessage, MessageModel } from '@lyvely/core-interface';
import { I18nModelValidator } from '@/i18n';
import { loadingStatus, useStatus } from '@/core';
import { useContentStore } from '@/content/stores/content.store';

export const useCreateMessageStore = defineStore('create-message', () => {
  const model = ref(new CreateMessage(''));
  const validator = ref(new I18nModelValidator(model.value));
  const messageService = useMessageService();
  const status = useStatus();

  function reset() {
    model.value = new CreateMessage('');
    validator.value.setModel(model.value);
    status.resetStatus();
  }

  async function submit(parentId?: string) {
    // TODO: Show some error message
    if (!(await validator.value.validate())) return;
    const message = new CreateMessage(model.value.text, parentId);
    const response = await loadingStatus(messageService.create(message), status);
    reset();
    useContentStore().emitPostContentEvent(MessageModel.contentType, 'created', response.model);
    return response.model;
  }

  return {
    model,
    submit,
  };
});
