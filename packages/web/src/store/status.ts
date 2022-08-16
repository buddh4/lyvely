import { Ref, ref } from 'vue';

export enum Status {
  INIT,
  LOADING,
  SUCCESS,
  ERROR
}

type StatusStorePlugin = {
  status?: Ref<Status>,
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

    setStatus(status: Status) {
      s.value = status;
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
