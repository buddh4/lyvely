import "reflect-metadata";

import { createApp, markRaw, App } from "vue";
import AppComponent from "./App.vue";
import router from "./router";
import defineLocales from "./util/locales";

import "./styles/index.css";

import { setupI18n } from "./i18n";
import { createPinia } from "pinia";
import { eventBus } from "@/modules/core/events/global.emitter";
import { ModuleLoader } from "@/module.loader";
import ModalWindow from "@/modules/ui/components/modal/ModalWindow.vue";
import ContentPanel from "@/modules/ui/components/panels/ContentPanel.vue";
import TabMenu from "@/modules/ui/components/menu/TabMenu.vue";
import TabMenuLink from "@/modules/ui/components/menu/TabMenuLink.vue";
import DrawerMenu from "@/modules/ui/components/drawer/DrawerMenu.vue";
import ConfirmModal from "@/modules/ui/components/modal/ConfirmModal.vue";
import Icon from "@/modules/ui/components/icon/UIIcon.vue";
import StyledButton from "@/modules/ui/components/button/StyledButton.vue";
import TextInput from "@/modules/ui/components/form/TextInput.vue";
import CheckboxInput from "@/modules/ui/components/form/CheckboxInput.vue";
import SelectInput from "@/modules/ui/components/form/SelectInput.vue";
import NumberInput from "@/modules/ui/components/form/NumberInput.vue";
import TextareaInput from "@/modules/ui/components/form/TextareaInput.vue";
import RadioInput from "@/modules/ui/components/form/RadioInput.vue";
import RangeInput from "@/modules/ui/components/form/RangeInput.vue";
import AlertBlock from "@/modules/ui/components/alert/AlertBlock.vue";
import BadgeText from "@/modules/ui/components/badge/BadgeText.vue";
import DropdownMenu from "@/modules/ui/components/menu/DropdownMenu.vue";
import DropdownLink from "@/modules/ui/components/menu/DropdownLink.vue";
import AddButton from "@/modules/ui/components/button/AddButton.vue";
import ProfileAvatar from "@/modules/profiles/components/ProfileAvatar.vue";
import UserAvatar from "@/modules/users/components/UserAvatar.vue";
import DividedList from "@/modules/ui/components/list/DividedList.vue";
import ListItem from "@/modules/ui/components/list/ListItem.vue";
import TextDimmed from "@/modules/ui/components/text/TextDimmed.vue";
import LoaderBlock from "@/modules/ui/components/loader/LoaderBlock.vue";
import FormModel from "@/modules/ui/components/form/FormModel.vue";
import FormattedDate from "@/modules/ui/components/intl/FormattedDate.vue";
import TagBadge from "@/modules/tags/components/TagBadge.vue";
import CaptchaInput from "@/modules/captcha/components/CaptchaInput.vue";
import ScreenReaderValidationError from "@/modules/ui/components/error/ScreenReaderValidationError.vue";
import { useDayJsDateTimeAdapter } from "@lyvely/common";
import resetStore from "@/util/reset-store.plugin";

console.log("Starting...");

defineLocales();
useDayJsDateTimeAdapter();

console.log("Initializing app...");

eventBus.emit("app.create.pre");

const pinia = createPinia();
pinia.use(resetStore);
pinia.use(({ store }) => {
  store.router = markRaw(router);
});

eventBus.on("auth.logout", () => {
  console.log("logout");
});

const app = createApp(AppComponent);
app.use(pinia);
app.use(router);
app.use(ModuleLoader);
const i18n = await setupI18n();
app.use(i18n);

/**
 * We register the components here due to:
 * https://youtrack.jetbrains.com/issue/WEB-56978/Global-components-are-not-recognised-when-registered-via-plugins
 */
setGlobalComponents(app);

eventBus.emit("app.create.post", app);

eventBus.emit("app.mount.pre", app);

app.mount("#app");

eventBus.emit("app.mount.post", app);

if (window.Cypress) {
  // only available during E2E tests
  window.app = app;
}

function setGlobalComponents(app: App) {
  app.component("LyModal", ModalWindow);
  app.component("LyConfirm", ConfirmModal);
  app.component("LyDrawer", DrawerMenu);
  app.component("LyBadge", BadgeText);
  app.component("LyTag", TagBadge);
  app.component("LyDividedList", DividedList);
  app.component("LyTextDimmed", TextDimmed);
  app.component("LyListItem", ListItem);
  app.component("LyDropdown", DropdownMenu);
  app.component("LyFormModel", FormModel);
  app.component("LyDropdownLink", DropdownLink);
  app.component("LyIcon", Icon);
  app.component("LyButton", StyledButton);
  app.component("LyAddButton", AddButton);
  app.component("LyInputCheckbox", CheckboxInput);
  app.component("LyInputRadio", RadioInput);
  app.component("LyInputText", TextInput);
  app.component("LyInputSelect", SelectInput);
  app.component("LyInputNumber", NumberInput);
  app.component("LyInputTextarea", TextareaInput);
  app.component("LyInputRange", RangeInput);
  app.component("LyInputCaptcha", CaptchaInput);
  app.component("LyAlert", AlertBlock);
  app.component("LyProfileAvatar", ProfileAvatar);
  app.component("LyUserAvatar", UserAvatar);
  app.component("LyLoader", LoaderBlock);
  app.component("LyTabMenu", TabMenu);
  app.component("LyTabMenuLink", TabMenuLink);
  app.component("LyFormattedDate", FormattedDate);
  app.component("LyContentPanel", ContentPanel);
  app.component("LyScreenReaderValidationError", ScreenReaderValidationError);
}

console.log("App initialized");
