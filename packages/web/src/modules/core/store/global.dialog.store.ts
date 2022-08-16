import { defineStore } from 'pinia';

export interface ShowAlertOptions {
  title?: string,
  message: string,
  icon?: string,
  status?: boolean,
  iconColor?: string,
  iconClass?: string,
}

export enum DialogType {
  Success = 'success',
  Info = 'info',
  Warning = 'warning',
  Error = 'error'
}

const iconClassMapping = {
  [DialogType.Success]: 'success',
  [DialogType.Info]: 'info',
  [DialogType.Warning]: 'warning',
  [DialogType.Error]: 'danger',
}

export const useGlobalDialogStore = defineStore('global.dialog', {
  state: () => ({
    icon: undefined,
    iconClass: undefined,
    iconColor: undefined,
    title: '',
    message: '',
    visible: false
  }),
  actions: {
    showSuccess(options: ShowAlertOptions) {
      options.title = options.title || 'Success';
      this.show(DialogType.Success, options);
    },

    showInfo(options: ShowAlertOptions) {
      options.title = options.title || 'Info';
      this.show(DialogType.Info, options);
    },

    showWarning(options: ShowAlertOptions) {
      options.title = options.title || 'Warning';
      this.show(DialogType.Warning, options);
    },

    showError(options: ShowAlertOptions) {
      options.title = options.title || 'Error';
      this.show(DialogType.Error, options);
    },

    show(type: DialogType, options: ShowAlertOptions) {
      this.icon = options.icon || type;
      this.iconColor = options.iconColor || undefined;
      this.iconClass = options.iconColor || iconClassMapping[type];
      this.title = options.title;
      this.message = options.message;
      this.visible = true;
    },
  }
});
