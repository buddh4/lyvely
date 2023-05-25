import './styles/index.css';
import resetStore from '@/util/reset-store.plugin';
import { markRaw, App, createApp } from 'vue';
import { createPinia, Pinia } from 'pinia';
import router from '@/router';
import AppComponent from '@/App.vue';
import { ModuleLoader } from '@/module.loader';
import { setupI18n } from '@/i18n';
import { I18n } from 'vue-i18n';
import LyvelyModal from '@/modules/ui/components/modal/LyvelyModal.vue';
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
import ButtonUpdateIndicator from '@/modules/ui/components/button/ButtonUpdateIndicator.vue';
import AddButton from '@/modules/ui/components/button/AddButton.vue';
import CheckboxInput from '@/modules/ui/components/form/CheckboxInput.vue';
import RadioInput from '@/modules/ui/components/form/RadioInput.vue';
import TextInput from '@/modules/ui/components/form/TextInput.vue';
import TimeNumberInput from '@/modules/ui/components/form/TimeNumberInput.vue';
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
import { eventBus, AppEvents } from '@/modules/core/events/global.emitter';
import AvatarImage from '@/modules/ui/components/avatar/AvatarImage.vue';
import BadgeChooser from '@/modules/ui/components/form/BadgeChooser.vue';

export class LyvelyApp {
  vueApp: App;
  pinia: Pinia;
  i18n: I18n;
  events: AppEvents;

  async init() {
    this.events = eventBus;
    this.events.emit('app.init.pre');
    this.setupPinia();
    await this.setupI18n();
    this.createApp();
    this.events.emit('app.init.post', this);
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
    this.vueApp = createApp(AppComponent);
    this.vueApp.use(this.pinia);
    this.vueApp.use(router);
    this.vueApp.use(ModuleLoader);
    this.vueApp.use(this.i18n);
    this.initDirectives();
    this.setGlobalComponents();
    useDayJsDateTimeAdapter();
  }

  mount(selector: string) {
    this.events.emit('app.mount.pre', this);
    this.vueApp.mount(selector);
    this.events.emit('app.mount.post', this);
  }

  private initDirectives() {
    this.vueApp.directive('mobile-scrollbar', {
      mounted: (el) => {
        const isInitialized = false;

        const hide = (timeout = 0) =>
          window.setTimeout(() => el.classList.add('scrollbar-hidden'), timeout);

        hide();
        // ContentStream requires this
        hide(500);

        el.addEventListener('scroll', function () {
          if (!isInitialized) el.classList.remove('scrollbar-hidden');
        });
      },
    });
  }

  private setGlobalComponents() {
    this.vueApp.component('LyModal', LyvelyModal);
    this.vueApp.component('LyConfirm', ConfirmModal);
    this.vueApp.component('LyDrawer', DrawerMenu);
    this.vueApp.component('LyBadge', BadgeText);
    this.vueApp.component('LyBadgeChooser', BadgeChooser);
    this.vueApp.component('LyTag', TagBadge);
    this.vueApp.component('LyDividedList', DividedList);
    this.vueApp.component('LyTextDimmed', TextDimmed);
    this.vueApp.component('LyListItem', ListItem);
    this.vueApp.component('LyDropdown', DropdownMenu);
    this.vueApp.component('LyFormModel', FormModel);
    this.vueApp.component('LyDropdownLink', DropdownLink);
    this.vueApp.component('LyIcon', Icon);
    this.vueApp.component('LyButton', StyledButton);
    this.vueApp.component('LyUpdateIndicator', ButtonUpdateIndicator);
    this.vueApp.component('LyAddButton', AddButton);
    this.vueApp.component('LyInputCheckbox', CheckboxInput);
    this.vueApp.component('LyInputRadio', RadioInput);
    this.vueApp.component('LyInputText', TextInput);
    this.vueApp.component('LyInputSelect', SelectInput);
    this.vueApp.component('LyInputNumber', NumberInput);
    this.vueApp.component('LyInputTextarea', TextareaInput);
    this.vueApp.component('LyInputRange', RangeInput);
    this.vueApp.component('LyInputCaptcha', CaptchaInput);
    this.vueApp.component('LyInputTimeNumber', TimeNumberInput);
    this.vueApp.component('LyAlert', AlertBlock);
    this.vueApp.component('LyProfileAvatar', ProfileAvatar);
    this.vueApp.component('LyAvatar', AvatarImage);
    this.vueApp.component('LyUserAvatar', UserAvatar);
    this.vueApp.component('LyLoader', LoaderBlock);
    this.vueApp.component('LyTabMenu', TabMenu);
    this.vueApp.component('LyTabMenuLink', TabMenuLink);
    this.vueApp.component('LyFormattedDate', FormattedDate);
    this.vueApp.component('LyContentPanel', ContentPanel);
    this.vueApp.component('LyScreenReaderValidationError', ScreenReaderValidationError);
  }
}
