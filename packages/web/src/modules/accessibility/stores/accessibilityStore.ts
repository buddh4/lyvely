import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isDevelopEnvironment } from "@/modules/core/environment";

export const useAccessibilityStore = defineStore('accessibility', () => {
  const messages = ref<string[]>([]);

  function setMessages(messages: string[]) {
    this.messages.value = messages;
  }

  function addMessage(message: string) {
    if(isDevelopEnvironment()) console.log('Aria Live Update: ', message);
    messages.value.push(message);
  }

  function addMessages(messages: string[]) {
    if(isDevelopEnvironment()) console.log('Aria Live Update: ', messages);
    messages.push(...messages);
  }

  return {
    messages,
    setMessages,
    addMessages,
    addMessage
  }
});
