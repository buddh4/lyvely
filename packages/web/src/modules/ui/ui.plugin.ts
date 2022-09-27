import { App } from 'vue';
import Modal from "@server/modules/ui/components/modal/Modal.vue";
import Button from "@server/modules/ui/components/button/Button.vue";
import Icon from "@server/modules/ui/components/icon/Icon.vue";
import TextInput from "@server/modules/ui/components/form/TextInput.vue";

export const UiPlugin = {
  install(app: App) {
    app.component('Modal', Modal);
    app.component('Icon', Icon);
    app.component('Button', Button);
    app.component('TextInput', TextInput);
  }
}
