import { AxiosError, AxiosResponse } from 'axios';
import {
  IFieldValidationResponse,
  IModelValidationResponse,
  ServiceException,
  FieldValidationException,
  ModelValidationException,
  NetworkException,
  ForbiddenServiceException,
  UnauthenticatedServiceException,
} from '@lyvely/common';

export function isAxiosError(error: any): error is AxiosError {
  return error.isAxiosError;
}

export function isAxiosErrorWithResponse<T = any>(error: any): error is AxiosError<T> & { response: AxiosResponse<T> } {
  return isAxiosError(error) && !!error.response;
}

export function isAxiosErrorWithResponseData<T = any>(
  error: any,
): error is AxiosError<T> & { response: AxiosResponse<T> } {
  return isAxiosError(error) && !!error.response?.data;
}

export function isAxiosErrorWithoutResponseData<T = any>(error: any): error is AxiosError<T> & { response: undefined } {
  return isAxiosError(error) && !error.response;
}

export function isFieldValidationError(error: any): error is AxiosError<IFieldValidationResponse> & {
  response: AxiosResponse<IFieldValidationResponse>;
} {
  return (
    isAxiosErrorWithResponseData<IFieldValidationResponse>(error) &&
    error.response.status === 400 &&
    Array.isArray(error.response.data.fields)
  );
}

export function isForbiddenError(error: any): error is AxiosError {
  return isAxiosErrorWithResponseData(error) && error.response.status === 403;
}

export function isUnauthorizedForbidden(error: any): error is AxiosError {
  return isAxiosErrorWithResponseData(error) && error.response.status === 401;
}

export function isModelValidationError(error: any): error is AxiosError<IModelValidationResponse> & {
  response: AxiosResponse<IModelValidationResponse>;
} {
  return (
    isAxiosErrorWithResponseData<IModelValidationResponse>(error) &&
    error.response.status === 400 &&
    Array.isArray(error.response.data.result)
  );
}

/**
 * @throws ServiceException
 * @param error
 */
export function throwServiceException(error: any) {
  errorToServiceException(error, true);
}

export function errorToServiceException(error: any, throws = false): ServiceException {
  let result = new ServiceException(error?.message);

  if (isAxiosErrorWithoutResponseData(error)) {
    result = new NetworkException();
  } else if (isForbiddenError(error)) {
    result = new ForbiddenServiceException(error.response?.data);
  } else if (isUnauthorizedForbidden(error)) {
    result = new UnauthenticatedServiceException(error.response?.data);
  } else if (isFieldValidationError(error)) {
    result = new FieldValidationException(error.response.data.fields);
  } else if (isModelValidationError(error)) {
    result = new ModelValidationException(error.response.data.result);
  }

  if (throws) throw result;

  return result;
}
