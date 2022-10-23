import './styles/index.css';
import resetStore from '@/util/reset-store.plugin';
import { markRaw, App, createApp } from 'vue';
import { createPinia, Pinia } from 'pinia';
import router from '@/router';
import AppComponent from '@/App.vue';
import { ModuleLoader } from '@/module.loader';
import { setupI18n } from '@/i18n';
import { I18n } from 'vue-i18n';
import ModalWindow from '@/modules/ui/components/modal/ModalWindow.vue';
import ConfirmModal from '@/modules/ui/components/modal/ConfirmModal.vue';
import DrawerMenu from '@/modules/ui/components/drawer/DrawerMenu.vue';
import BadgeText from '@/modules/ui/components/badge/BadgeText.vue';
import TagBadge from '@/modules/tags/components/TagBadge.vue';
import DividedList from '@/modules/ui/components/list/DividedList.vue';
import TextDimmed from '@/modules/ui/components/text/TextDimmed.vue';
import ListItem from '@/modules/ui/components/list/ListItem.vue';
import DropdownMenu from '@/modules/ui/components/menu/DropdownMenu.vue';
import FormModel from '@/modules/ui/components/form/FormModel.vue';
import DropdownLink from '@/modules/ui/components/menu/DropdownLink.vue';
import Icon from '@/modules/ui/components/icon/UIIcon.vue';
import StyledButton from '@/modules/ui/components/button/StyledButton.vue';
import AddButton from '@/modules/ui/components/button/AddButton.vue';
import CheckboxInput from '@/modules/ui/components/form/CheckboxInput.vue';
import RadioInput from '@/modules/ui/components/form/RadioInput.vue';
import TextInput from '@/modules/ui/components/form/TextInput.vue';
import SelectInput from '@/modules/ui/components/form/SelectInput.vue';
import NumberInput from '@/modules/ui/components/form/NumberInput.vue';
import TextareaInput from '@/modules/ui/components/form/TextareaInput.vue';
import RangeInput from '@/modules/ui/components/form/RangeInput.vue';
import CaptchaInput from '@/modules/captcha/components/CaptchaInput.vue';
import AlertBlock from '@/modules/ui/components/alert/AlertBlock.vue';
import ProfileAvatar from '@/modules/profiles/components/ProfileAvatar.vue';
import UserAvatar from '@/modules/users/components/UserAvatar.vue';
import LoaderBlock from '@/modules/ui/components/loader/LoaderBlock.vue';
import TabMenu from '@/modules/ui/components/menu/TabMenu.vue';
import TabMenuLink from '@/modules/ui/components/menu/TabMenuLink.vue';
import FormattedDate from '@/modules/ui/components/intl/FormattedDate.vue';
import ContentPanel from '@/modules/ui/components/panels/ContentPanel.vue';
import ScreenReaderValidationError from '@/modules/ui/components/error/ScreenReaderValidationError.vue';
import { useDayJsDateTimeAdapter } from '@lyvely/common';

export class LyvelyApp {
  app: App;
  pinia: Pinia;
  i18n: I18n;

  async init() {
    this.setupPinia();
    await this.setupI18n();
    this.createApp();
    return this;
  }

  private setupPinia() {
    this.pinia = createPinia();
    this.pinia.use(resetStore);
    this.pinia.use(({ store }) => {
      store.router = markRaw(router);
    });
  }

  private async setupI18n() {
    this.i18n = await setupI18n();
  }

  private createApp() {
    this.app = createApp(AppComponent);
    this.app.use(this.pinia);
    this.app.use(router);
    this.app.use(ModuleLoader);
    this.app.use(this.i18n);
    this.setGlobalComponents();
    useDayJsDateTimeAdapter();
  }

  mount(selector: string) {
    this.app.mount(selector);
  }

  private setGlobalComponents() {
    this.app.component('LyModal', ModalWindow);
    this.app.component('LyConfirm', ConfirmModal);
    this.app.component('LyDrawer', DrawerMenu);
    this.app.component('LyBadge', BadgeText);
    this.app.component('LyTag', TagBadge);
    this.app.component('LyDividedList', DividedList);
    this.app.component('LyTextDimmed', TextDimmed);
    this.app.component('LyListItem', ListItem);
    this.app.component('LyDropdown', DropdownMenu);
    this.app.component('LyFormModel', FormModel);
    this.app.component('LyDropdownLink', DropdownLink);
    this.app.component('LyIcon', Icon);
    this.app.component('LyButton', StyledButton);
    this.app.component('LyAddButton', AddButton);
    this.app.component('LyInputCheckbox', CheckboxInput);
    this.app.component('LyInputRadio', RadioInput);
    this.app.component('LyInputText', TextInput);
    this.app.component('LyInputSelect', SelectInput);
    this.app.component('LyInputNumber', NumberInput);
    this.app.component('LyInputTextarea', TextareaInput);
    this.app.component('LyInputRange', RangeInput);
    this.app.component('LyInputCaptcha', CaptchaInput);
    this.app.component('LyAlert', AlertBlock);
    this.app.component('LyProfileAvatar', ProfileAvatar);
    this.app.component('LyUserAvatar', UserAvatar);
    this.app.component('LyLoader', LoaderBlock);
    this.app.component('LyTabMenu', TabMenu);
    this.app.component('LyTabMenuLink', TabMenuLink);
    this.app.component('LyFormattedDate', FormattedDate);
    this.app.component('LyContentPanel', ContentPanel);
    this.app.component('LyScreenReaderValidationError', ScreenReaderValidationError);
  }
}
