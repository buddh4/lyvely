import { ShowAlertOptions, useGlobalDialogStore } from '@/modules/core/store/global.dialog.store';
import { Status } from '@/store/status';

type StatusSetter = {setStatus: {(s: Status): void}} & any;

export function LogExceptionHandler(msg: string, context?: StatusSetter) {
  return (err: any) => {
    console.error(msg, err);
    if(status) {
      context.setStatus(Status.ERROR);
    }
  }
}

export function DialogExceptionHandler(options: ShowAlertOptions | string, context?: StatusSetter) {
  return (err: any) => {
    options = typeof options === 'string' ?  { message: options } : options;
    useGlobalDialogStore().showError(options);
    LogExceptionHandler(options.message)(err);
    if(status) {
      context.setStatus(Status.ERROR);
    }
  }
}
