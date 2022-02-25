export enum Status {
  INIT,
  LOADING,
  SUCCESS,
  ERROR
}

type StatusStorePlugin = {
  status?: Status,
  setStatus(status: Status): void,
  getStatus(): Status,
  isStatus(status: Status): boolean,
  isStatusError(): boolean,
  isStatusLoading(): boolean,
  isStatusInit(): boolean,
  isStatusSuccess(): boolean,
}

export function useStatus(): StatusStorePlugin {
  return {
    setStatus(status: Status) {
      this.status = status;
    },
    getStatus(): Status {
      return this.status || Status.INIT;
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
