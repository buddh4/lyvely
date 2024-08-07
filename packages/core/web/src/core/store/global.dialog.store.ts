import { defineStore } from 'pinia';
import { nextTick } from 'vue';

export interface IShowAlertOptions {
  title?: string;
  message: string;
  icon?: string;
  buttonType?: ButtonType;
  status?: boolean;
  iconColor?: string;
  iconClass?: string;
}

export enum DialogType {
  Success = 'success',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
}

export type ButtonType = 'close' | 'reload';

const iconClassMapping = {
  [DialogType.Success]: 'success',
  [DialogType.Info]: 'info',
  [DialogType.Warning]: 'warning',
  [DialogType.Error]: 'danger',
};

export const useGlobalDialogStore = defineStore('global.dialog', {
  state: () => ({
    icon: undefined,
    iconClass: undefined,
    iconColor: undefined,
    buttonType: undefined,
    title: '',
    message: '',
    visible: false,
  }),
  actions: {
    showSuccess(options: IShowAlertOptions) {
      options.title = options.title || 'status.success';
      this.show(DialogType.Success, options);
    },

    showInfo(options: IShowAlertOptions) {
      options.title = options.title || 'status.info';
      this.show(DialogType.Info, options);
    },

    showWarning(options: IShowAlertOptions) {
      options.title = options.title || 'status.warning';
      this.show(DialogType.Warning, options);
    },

    showError(options: IShowAlertOptions) {
      options.title = options.title || 'status.error';
      this.show(DialogType.Error, options);
    },

    showUnknownError(options = {} as IShowAlertOptions) {
      options.title = options.title || 'error.title';
      options.message = options.message || 'error.unknown';
      this.show(DialogType.Error, options);
    },

    show(type: DialogType, options: IShowAlertOptions) {
      nextTick(() => {
        this.icon = options.icon || type;
        this.iconColor = options.iconColor || undefined;
        this.iconClass = options.iconColor || iconClassMapping[type];
        this.buttonType = options.buttonType || 'close';
        this.title = options.title;
        this.message = options.message;
        this.visible = true;
      });
    },
  },
});
