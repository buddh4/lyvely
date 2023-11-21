import { Ref, ref } from 'vue';
import { ModelValidator, FieldValidationException } from '@lyvely/common';
import { errorToServiceException, isFieldValidationError, throwServiceException } from '../util';

export enum Status {
  INIT,
  LOADING,
  SUCCESS,
  ERROR,
}

export type StoreStatusPlugin = {
  status: Status;
  statusError: string | undefined;
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

export function useStatus(status?: Ref<Status>): StoreStatusPlugin {
  const s = status || ref(Status.INIT);
  const statusError = ref();

  return {
    // TODO: This is a dirty workaround due to issues pinia stripping the ref and complaining in components...
    status: <any>s,
    statusError: <any>statusError,

    setError(msg: string) {
      this.setStatus(Status.ERROR);
      statusError.value = msg;
    },

    resetStatus() {
      this.setStatus(Status.INIT);
    },

    setStatus(status: Status) {
      s.value = status;
      if (status !== Status.ERROR) {
        statusError.value = undefined;
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
  reject?: (e: any) => any,
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
      if (reject) reject(e);
      loading.value = false;
    }) as Promise<R extends void | undefined ? T : R>;
}

/**
 * This helper can be used to automatically manage a state object in combination with an asynchronous operation,
 * in most cases an api call.
 * The first argument is an either a promise or a function returning a promise. If you want to facilitate the validator
 * parameter, the first argument needs to be a function, otherwise we can not prevent the promise from running if the
 * validation fails.
 * This function automatically translates exceptions into service exceptions.
 * @param promise
 * @param status
 * @param validator
 * @param resolve
 * @param reject
 */
export async function loadingStatus<T = any, R = T | void>(
  promise: (() => Promise<T>) | Promise<T>,
  status: StoreStatusPlugin,
  validator?: ModelValidator<any>,
  resolve?: (result: T) => R,
  reject?: (e: any) => any,
): Promise<R extends void | undefined ? T : R> {
  if (typeof promise === 'function' && validator && !(await validator.validate())) {
    status.setStatus(Status.ERROR);
    return Promise.reject(new FieldValidationException(validator.getValidationResult()));
  }

  status.setStatus(Status.LOADING);
  return (typeof promise === 'function' ? promise() : promise)
    .then((result) => {
      status.setStatus(Status.SUCCESS);
      if (!resolve) return result;

      const successResult = resolve(result);
      return successResult !== undefined ? successResult : result;
    })
    .catch((e) => {
      if (reject) {
        reject(e);
      } else {
        handleError(e, status, validator);
        throw throwServiceException(e);
      }
    }) as Promise<R extends void | undefined ? T : R>;
}

export function handleError(err: any, status: StoreStatusPlugin, validator?: ModelValidator) {
  status.setStatus(Status.ERROR);
  if (validator && isFieldValidationError(err)) {
    validator.setErrors(err.response.data.fields);
  } else if (validator && err instanceof FieldValidationException) {
    validator.setErrors(err.getFields());
  } else {
    status.setError(getErrorMessage(err));
  }
}

export function getErrorMessage(err: any) {
  if (err?.isAxiosError && !err.response) {
    return 'error.network.message';
  }

  const errStatus = err.status || err.reponse?.status;
  return getErrorMessageByStatusCode(errStatus);
}

function getErrorMessageByStatusCode(status: number) {
  // TODO: add some more error codes...

  switch (status) {
    case 500:
      return 'error.500';
    case 403:
      return 'error.403';
    case 404:
      return 'error.404';
    case 429:
      return 'error.429';
    default:
      return 'error.unknown';
  }
}
