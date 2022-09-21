import { Ref, ref } from 'vue';

export enum Status {
  INIT,
  LOADING,
  SUCCESS,
  ERROR
}

type StatusStorePlugin = {
  status: Ref<Status>,
  statusError: Ref<string|undefined>,
  setError(msg: string): void,
  setStatus(status: Status): void,
  getStatus(): Status,
  isStatus(status: Status): boolean,
  isStatusError(): boolean,
  isStatusLoading(): boolean,
  isStatusInit(): boolean,
  isStatusSuccess(): boolean,
}

export function useStatus(status?: Ref<Status>): StatusStorePlugin {

  const s = status || ref(Status.INIT);

  return {
    status: s,
    statusError: ref(),

    setError(msg: string) {
      this.setStatus(Status.ERROR);
      this.statusError.value = msg;
    },

    setStatus(status: Status) {
      s.value = status;
      if(status === Status.ERROR) {
        this.statusError.value = undefined;
      }
    },

    getStatus(): Status {
      return s.value ?? Status.INIT;
    },

    isStatus(status: Status) {
      return this.getStatus() === status;
    },

    isStatusInit() {
      return this.isStatus(Status.INIT);
    },

    isStatusError() {
      return this.isStatus(Status.ERROR);
    },

    isStatusLoading() {
      return this.isStatus(Status.LOADING);
    },

    isStatusSuccess() {
      return this.isStatus(Status.SUCCESS);
    }
  }
}

export async function loadingStatus<T = any, R = T|void>(promise: Promise<T>, status: StatusStorePlugin, resolve: (result: T) => R, reject?: (e: any) => any): Promise<R extends void|undefined ? T : R> {
  status.setStatus(Status.LOADING);
  return promise.then(result => {
    status.setStatus(Status.SUCCESS);
    const successResult = resolve(result);
    return successResult !== undefined  ? successResult : result;
  }).catch(e => {
    console.error(e);
    if(reject) reject(e);
    else status.setError('error.unknown');
  }) as Promise<R extends void|undefined ? T : R>;
}
