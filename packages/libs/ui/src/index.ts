import LyCenteredPanel from './components/layouts/LyCenteredPanel.vue';
import LyContentRoot from './components/layouts/LyContentRoot.vue';
import LyListPage from './components/layouts/LyListPage.vue';
import LyAlert from './components/alerts/LyAlert.vue';
import LyIcon from './components/icons/LyIcon.vue';
import LyMainContainer from './components/layouts/LyMainContainer.vue';
import LyBadge from './components/badges/LyBadge.vue';
import LyModal from './components/modals/LyModal.vue';
import LyConfirmModal from './components/modals/LyConfirmModal.vue';
import LyAddButton from './components/buttons/LyAddButton.vue';
import LyButton from './components/buttons/LyButton.vue';
import LyUpdateIndicator from './components/buttons/LyUpdateIndicator.vue';
import LyFloatingAddButton from './components/buttons/LyFloatingAddButton.vue';
import LyDialog from './components/dialogs/LyDialog.vue';
import LyDrawer from './components/drawers/LyDrawer.vue';
import LyDropdown from './components/menus/LyDropdown.vue';
import LyDropdownLink from './components/menus/LyDropdownLink.vue';
import LyTabMenu from './components/menus/LyTabMenu.vue';
import LyTabMenuLink from './components/menus/LyTabMenuLink.vue';
import LySliderMenu from './components/menus/LySliderMenu.vue';
import LyAvatar from './components/avatars/LyAvatar.vue';
import LyFormattedDate from './components/intl/LyFormattedDate.vue';
import LyScreenReaderValidationError from './components/errors/LyScreenReaderValidationError.vue';
import LyDividedList from './components/lists/LyDividedList.vue';
import LyListItem from './components/lists/LyListItem.vue';
import LyLoader from './components/loaders/LyLoader.vue';
import LyAppLoader from './components/loaders/LyAppLoader.vue';
import LyContentPanel from './components/panels/LyContentPanel.vue';
import LyProgressBar from './components/progress/LyProgressBar.vue';
import LyDimmed from './components/texts/LyDimmed.vue';
import LyTrim from './components/texts/LyTrim.vue';
import LyBadgeChooser from './components/forms/LyBadgeChooser.vue';
import LyCheckboxRange from './components/forms/LyCheckboxRange.vue';
import LyEditableText from './components/forms/LyEditableText.vue';
import LyFloatingInputLayout from './components/forms/LyFloatingInputLayout.vue';
import LyFormModel from './components/forms/LyFormModel.vue';
import LyCheckbox from './components/forms/LyCheckbox.vue';
import LyNumberField from './components/forms/LyNumberField.vue';
import LyRadio from './components/forms/LyRadio.vue';
import LyRange from './components/forms/LyRange.vue';
import LySelect from './components/forms/LySelect.vue';
import LyTextField from './components/forms/LyTextField.vue';
import LyTextarea from './components/forms/LyTextarea.vue';
import LyTimeNumberInput from './components/forms/LyTimeNumberInput.vue';
import LyPasswordStrengthMeter from './components/forms/LyPasswordStrengthMeter.vue';
import LyResponsive from './components/helpers/LyResponsive.vue';
import LyTable from './components/tables/LyTable.vue';
import { App } from 'vue';
import { Icons } from './components/icons/Icons';
import { LyvelyUiOptions, setConfigOptions } from './config';
import { Translatable, TranslationAdapter } from './i18n';

const createLyvelyUi = (options?: LyvelyUiOptions) => {
  setConfigOptions(options);

  return {
    install(Vue: App) {
      Vue.component('LyResponsive', LyResponsive);
      Vue.component('LyTable', LyTable);
      Vue.component('LyContentRoot', LyContentRoot);
      Vue.component('LyListPage', LyListPage);
      Vue.component('LyMainContainer', LyMainContainer);
      Vue.component('LyAlert', LyAlert);
      Vue.component('LyBadge', LyBadge);
      Vue.component('LyModal', LyModal);
      Vue.component('LyConfirmModal', LyConfirmModal);
      Vue.component('LyButton', LyButton);
      Vue.component('LyUpdateIndicator', LyUpdateIndicator);
      Vue.component('LyFloatingAddButton', LyFloatingAddButton);
      Vue.component('LyAddButton', LyAddButton);
      Vue.component('LyDialog', LyDialog);
      Vue.component('LyDrawer', LyDrawer);
      Vue.component('LyIcon', LyIcon);
      Vue.component('LyDropdown', LyDropdown);
      Vue.component('LyDropdownLink', LyDropdownLink);
      Vue.component('LyTabMenu', LyTabMenu);
      Vue.component('LyTabMenuLink', LyTabMenuLink);
      Vue.component('LyAvatar', LyAvatar);
      Vue.component('LyFormattedDate', LyFormattedDate);
      Vue.component('LyListItem', LyListItem);
      Vue.component('LyScreenReaderValidationError', LyScreenReaderValidationError);
      Vue.component('LyDividedList', LyDividedList);
      Vue.component('LyLoader', LyLoader);
      Vue.component('LyAppLoader', LyAppLoader);
      Vue.component('LyContentPanel', LyContentPanel);
      Vue.component('LyProgressBar', LyProgressBar);
      Vue.component('LySliderMenu', LySliderMenu);
      Vue.component('LyDimmed', LyDimmed);
      Vue.component('LyTrim', LyTrim);
      Vue.component('LyBadgeChooser', LyBadgeChooser);
      Vue.component('LyCheckboxRange', LyCheckboxRange);
      Vue.component('LyEditableText', LyEditableText);
      Vue.component('LyFloatingInputLayout', LyFloatingInputLayout);
      Vue.component('LyFormModel', LyFormModel);
      Vue.component('LyCheckbox', LyCheckbox);
      Vue.component('LyNumberField', LyNumberField);
      Vue.component('LyRadio', LyRadio);
      Vue.component('LyRange', LyRange);
      Vue.component('LySelect', LySelect);
      Vue.component('LyTextField', LyTextField);
      Vue.component('LyTextarea', LyTextarea);
      Vue.component('LyTimeNumberInput', LyTimeNumberInput);
      Vue.component('LyPasswordStrengthMeter', LyPasswordStrengthMeter);
    },
  };
};

export type { IConfirmOptions } from './components/modals/interfaces';
export * from './types';
export * from './interfaces';

export type { Translatable, TranslationAdapter };
export {
  createLyvelyUi,
  Icons,
  LyPasswordStrengthMeter,
  LyTimeNumberInput,
  LyTextarea,
  LyTextField,
  LySelect,
  LyRange,
  LyCheckbox,
  LyRadio,
  LyNumberField,
  LyFormModel,
  LyFloatingInputLayout,
  LyBadgeChooser,
  LySliderMenu,
  LyDimmed,
  LyTrim,
  LyCheckboxRange,
  LyEditableText,
  LyScreenReaderValidationError,
  LyListItem,
  LyProgressBar,
  LyContentPanel,
  LyAppLoader,
  LyTabMenuLink,
  LyLoader,
  LyFormattedDate,
  LyDividedList,
  LyTabMenu,
  LyDropdownLink,
  LyDropdown,
  LyDrawer,
  LyIcon,
  LyDialog,
  LyButton,
  LyUpdateIndicator,
  LyFloatingAddButton,
  LyAddButton,
  LyCenteredPanel,
  LyContentRoot,
  LyListPage,
  LyMainContainer,
  LyAlert,
  LyBadge,
  LyModal,
  LyConfirmModal,
  LyAvatar,
};
