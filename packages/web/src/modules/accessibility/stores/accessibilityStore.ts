import { defineStore } from "pinia";
import { ref } from "vue";
import { isDevelopEnvironment } from "@/modules/core/environment";
import { findFocusable, suggestFocusElement } from "@/modules/ui/utils";

export const useAccessibilityStore = defineStore("accessibility", () => {
  const messages = ref<string[]>([]);
  let focusContextElement: HTMLElement;

  function setMessages(messages: string[]) {
    this.messages.value = messages;
  }

  function addMessage(message: string) {
    if (isDevelopEnvironment()) console.log("Aria Live Update: ", message);
    messages.value.push(message);
  }

  function addMessages(messages: string[]) {
    if (isDevelopEnvironment()) console.log("Aria Live Update: ", messages);
    messages.push(...messages);
  }

  function setAriaHiddenApp(value: boolean) {
    const app = document.getElementById("app");
    app?.setAttribute("aria-hidden", value ? "yes" : "no");

    if (value && document.activeElement?.closest("#app")) {
      focusContextElement =
        document.activeElement.closest<HTMLElement>(".dropdown") ||
        (document.activeElement as HTMLElement);
    } else {
      const activeAppElement = findFocusable(focusContextElement);

      if (!activeAppElement) {
        console.warn(
          "Could not find focusable element after app changed to aria-hidden to true",
          focusContextElement
        );
      }

      activeAppElement?.focus();
    }
  }

  return {
    messages,
    setAriaHiddenApp,
    setMessages,
    addMessages,
    addMessage,
  };
});
