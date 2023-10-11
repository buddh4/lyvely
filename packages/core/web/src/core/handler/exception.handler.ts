import { IShowAlertOptions, useGlobalDialogStore, Status } from '../store';

type StatusSetter = { setStatus: { (s: Status): void } } & any;

export function LogExceptionHandler(msg: string, status?: boolean, context?: StatusSetter) {
  return (err?: any) => {
    console.error(msg, err);
    if (status) context.setStatus(Status.ERROR);
  };
}

export function DialogExceptionHandler(
  options: IShowAlertOptions | string,
  context?: StatusSetter,
) {
  return (err?: any) => {
    options = typeof options === 'string' ? { message: options } : options;
    useGlobalDialogStore().showError(options);
    LogExceptionHandler(options.message, options.status, context)(err);
  };
}
