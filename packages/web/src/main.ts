import 'reflect-metadata';
import { LyvelyApp } from '@/lyvely.app';
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
import BadgeChooser from '@/modules/ui/components/form/BadgeChooser.vue';
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
import AvatarImage from '@/modules/ui/components/avatar/AvatarImage.vue';
import ContentPanel from '@/modules/ui/components/panels/ContentPanel.vue';
import ScreenReaderValidationError from '@/modules/ui/components/error/ScreenReaderValidationError.vue';
import AppComponent from '@/App.vue';
import { createApp } from 'vue';
import TimeNumberInput from '@/modules/ui/components/form/TimeNumberInput.vue';
import ButtonUpdateIndicator from '@/modules/ui/components/button/ButtonUpdateIndicator.vue';
import { registerSW } from 'virtual:pwa-register';

const app = new LyvelyApp();
app.init().then(() => app.mount('#app'));

const updateSW = registerSW({
  onNeedRefresh() {
    app.events.emit('app.need.refresh', updateSW);
  },
  onOfflineReady() {
    app.events.emit('app.offline.ready');
  },
});

function justForWebstorm() {
  const vueApp = createApp(AppComponent);
  vueApp.component('LyModal', ModalWindow);
  app.vueApp.component('LyConfirm', ConfirmModal);
  app.vueApp.component('LyDrawer', DrawerMenu);
  app.vueApp.component('LyBadge', BadgeText);
  app.vueApp.component('LyBadgeChooser', BadgeChooser);
  app.vueApp.component('LyTag', TagBadge);
  app.vueApp.component('LyDividedList', DividedList);
  app.vueApp.component('LyTextDimmed', TextDimmed);
  app.vueApp.component('LyListItem', ListItem);
  app.vueApp.component('LyDropdown', DropdownMenu);
  app.vueApp.component('LyFormModel', FormModel);
  app.vueApp.component('LyDropdownLink', DropdownLink);
  app.vueApp.component('LyIcon', Icon);
  app.vueApp.component('LyButton', StyledButton);
  app.vueApp.component('LyUpdateIndicator', ButtonUpdateIndicator);
  app.vueApp.component('LyAddButton', AddButton);
  app.vueApp.component('LyInputCheckbox', CheckboxInput);
  app.vueApp.component('LyInputRadio', RadioInput);
  app.vueApp.component('LyInputText', TextInput);
  app.vueApp.component('LyInputTimeNumber', TimeNumberInput);
  app.vueApp.component('LyInputSelect', SelectInput);
  app.vueApp.component('LyInputNumber', NumberInput);
  app.vueApp.component('LyInputTextarea', TextareaInput);
  app.vueApp.component('LyInputRange', RangeInput);
  app.vueApp.component('LyInputCaptcha', CaptchaInput);
  app.vueApp.component('LyAlert', AlertBlock);
  app.vueApp.component('LyProfileAvatar', ProfileAvatar);
  app.vueApp.component('LyAvatar', AvatarImage);
  app.vueApp.component('LyUserAvatar', UserAvatar);
  app.vueApp.component('LyLoader', LoaderBlock);
  app.vueApp.component('LyTabMenu', TabMenu);
  app.vueApp.component('LyTabMenuLink', TabMenuLink);
  app.vueApp.component('LyFormattedDate', FormattedDate);
  app.vueApp.component('LyContentPanel', ContentPanel);
  app.vueApp.component('LyScreenReaderValidationError', ScreenReaderValidationError);
}
