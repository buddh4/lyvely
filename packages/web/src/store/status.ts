import { Ref, ref } from "vue";
import { AxiosError } from "axios";
import { IFieldValidationResult, ModelValidator } from "@lyvely/common";

export enum Status {
  INIT,
  LOADING,
  SUCCESS,
  ERROR,
}

export type StatusStorePlugin = {
  status: Ref<Status>;
  statusError: Ref<string | undefined>;
  setError(msg: string): void;
  resetStatus(): void;
  setStatus(status: Status): void;
  getStatus(): Status;
  isStatus(status: Status): boolean;
  isStatusError(): boolean;
  isStatusLoading(): boolean;
  isStatusInit(): boolean;
  isStatusSuccess(): boolean;
};

export function useStatus(status?: Ref<Status>): StatusStorePlugin {
  const s = status || ref(Status.INIT);

  return {
    status: s,
    statusError: ref(),

    setError(msg: string) {
      this.setStatus(Status.ERROR);
      this.statusError.value = msg;
    },

    resetStatus() {
      this.setStatus(Status.INIT);
    },

    setStatus(status: Status) {
      s.value = status;
      if (status !== Status.ERROR) {
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
    },
  };
}

export async function loadingState<T = any, R = T | void>(
  promise: Promise<T>,
  loading: Ref<boolean>,
  resolve?: (result: T) => R,
  reject?: (e: any) => any
): Promise<R extends void | undefined ? T : R> {
  loading.value = true;
  return promise
    .then((result) => {
      loading.value = false;
      if (!resolve) return result;

      const successResult = resolve(result);
      return successResult !== undefined ? successResult : result;
    })
    .catch((e) => {
      console.error(e);
      if (reject) reject(e);
      loading.value = false;
    }) as Promise<R extends void | undefined ? T : R>;
}

export async function loadingStatus<T = any, R = T | void>(
  promise: Promise<T>,
  status: StatusStorePlugin,
  validator?: ModelValidator,
  resolve?: (result: T) => R,
  reject?: (e: any) => any
): Promise<R extends void | undefined ? T : R> {
  status.setStatus(Status.LOADING);
  return promise
    .then((result) => {
      status.setStatus(Status.SUCCESS);
      if (!resolve) return result;

      const successResult = resolve(result);
      return successResult !== undefined ? successResult : result;
    })
    .catch((e) => {
      console.error(e);
      if (reject) {
        reject(e);
      } else {
        handleError(e, status, validator);
        throw e;
      }
    }) as Promise<R extends void | undefined ? T : R>;
}

export function handleError(
  err: any,
  status: StatusStorePlugin,
  validator?: ModelValidator
) {
  status.setStatus(Status.ERROR);
  if (
    validator &&
    err?.isAxiosError &&
    err?.response?.status === 400 &&
    err?.response?.data?.fields?.length
  ) {
    handleFieldValidationError(validator, err?.response?.data?.fields);
  } else {
    status.setError(getErrorMessage(err));
  }
}

function handleFieldValidationError(
  validator: ModelValidator,
  fields: IFieldValidationResult[]
) {
  validator.setErrors(fields);
}

export function getErrorMessage(err: any) {
  if (err?.isAxiosError) {
    if (!err.response) {
      return "error.network.message";
    } else {
      const fieldError = getFieldError(err);
      return fieldError || getErrorMessageByStatusCode(err.response.status);
    }
  }

  return "error.unknown";
}

function getFieldError(err: AxiosError) {
  if (err?.response?.status !== 400 || !err?.response?.data?.fields) {
    return undefined;
  }
}

function getErrorMessageByStatusCode(status: number) {
  // TODO: add some more error codes...

  switch (status) {
    case 500:
      return "error.500";
    case 403:
      return "error.403";
    case 404:
      return "error.404";
    default:
      return "error.unknown";
  }
}
