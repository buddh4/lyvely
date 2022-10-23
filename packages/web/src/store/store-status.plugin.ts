import { Ref, ref } from 'vue';
import { AxiosError } from 'axios';
import { IFieldValidationResult, ModelValidator, FieldValidationException } from '@lyvely/common';
import { isFieldValidationError } from '@/util';
import { translate } from '@/i18n';

export enum Status {
  INIT,
  LOADING,
  SUCCESS,
  ERROR,
}

export type StoreStatusPlugin = {
  status: Ref<Status>;
  statusError: Ref<string | undefined>;
  toRefs(): { statusState: Ref<Status>; statusError: Ref<string | undefined> };
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
    status: s,
    statusError: statusError,

    toRefs() {
      return {
        statusState: this.status,
        statusError: this.statusError,
      };
    },

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

export async function loadingStatus<T = any, R = T | void>(
  promise: Promise<T>,
  status: StoreStatusPlugin,
  validator?: ModelValidator,
  resolve?: (result: T) => R,
  reject?: (e: any) => any,
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
      if (reject) {
        reject(e);
      } else {
        handleError(e, status, validator);
        throw e;
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

function translateFields(fields: IFieldValidationResult[]) {
  return fields.map((field) => ({
    property: field.property,
    errors: field.errors?.map((err) => translate(err)),
  }));
}

export function getErrorMessage(err: any) {
  if (err?.isAxiosError) {
    if (!err.response) {
      return 'error.network.message';
    } else {
      const fieldError = getFieldError(err);
      return fieldError || getErrorMessageByStatusCode(err.response.status);
    }
  }

  return 'error.unknown';
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
      return 'error.500';
    case 403:
      return 'error.403';
    case 404:
      return 'error.404';
    default:
      return 'error.unknown';
  }
}
