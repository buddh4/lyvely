import { AxiosError, AxiosResponse } from 'axios';
import {
  ServiceException,
  FieldValidationException,
  ModelValidationException,
  NetworkException,
  ForbiddenServiceException,
  UnauthorizedServiceException,
  RateLimitException,
  DocumentNotFoundException,
} from './exceptions';
import { IFieldValidationResult, IModelValidationResult } from '@lyvely/common';

export interface IFieldValidationResponse {
  fields: IFieldValidationResult[];
}

export interface IModelValidationResponse {
  result: IModelValidationResult[];
}

export function isAxiosError(error: any): error is AxiosError {
  return !!error?.isAxiosError;
}

export function isAxiosErrorWithResponse<T = any>(
  error: any
): error is AxiosError<T> & { response: AxiosResponse<T> } {
  return isAxiosError(error) && !!error.response;
}

export function isAxiosErrorWithResponseData<T = any>(
  error: any
): error is AxiosError<T> & { response: AxiosResponse<T> } {
  return isAxiosError(error) && !!error.response?.data;
}

export function isAxiosErrorWithoutResponseData<T = any>(
  error: any
): error is AxiosError<T> & { response: undefined } {
  return isAxiosError(error) && !error.response;
}

export function isFieldValidationError(
  error: any
): error is AxiosError<IFieldValidationResponse> & {
  response: AxiosResponse<IFieldValidationResponse>;
} {
  return (
    isAxiosErrorWithResponseData<IFieldValidationResponse>(error) &&
    error.response.status === 400 &&
    Array.isArray(error.response.data?.fields)
  );
}

export function isForbiddenError(error: any): error is AxiosError {
  return isAxiosErrorWithResponseData(error) && error.response.status === 403;
}

export function isUnauthorizedForbidden(error: any): error is AxiosError {
  return isAxiosErrorWithResponseData(error) && error.response.status === 401;
}

export function isModelValidationError(
  error: any
): error is AxiosError<IModelValidationResponse> & {
  response: AxiosResponse<IModelValidationResponse>;
} {
  return (
    isAxiosErrorWithResponseData<IModelValidationResponse>(error) &&
    error.response.status === 400 &&
    Array.isArray(error.response.data.result)
  );
}

export function isRateLimitError(error: any): error is AxiosError {
  return isAxiosErrorWithResponse(error) && error.response.status === 429;
}

export function isNotFoundError(error: any): error is AxiosError {
  return isAxiosErrorWithResponse(error) && error.response.status === 404;
}

/**
 * @throws ServiceException
 * @param error
 */
export function throwServiceException(error: any) {
  errorToServiceException(error, true);
}

export function errorToServiceException(error: any, throws = false): ServiceException {
  if (error instanceof ServiceException) {
    if (throws) throw error;
    return error;
  }

  let result: ServiceException = new ServiceException(error?.message);

  if (error instanceof ServiceException) {
    result = error;
  } else if (isAxiosErrorWithoutResponseData(error)) {
    result = new NetworkException();
  } else if (isForbiddenError(error)) {
    result = new ForbiddenServiceException(error.response?.data);
  } else if (isUnauthorizedForbidden(error)) {
    result = new UnauthorizedServiceException(error.response?.data);
  } else if (isFieldValidationError(error)) {
    result = new FieldValidationException(error.response.data.fields);
  } else if (isModelValidationError(error)) {
    result = new ModelValidationException(error.response.data.result);
  } else if (isRateLimitError(error)) {
    result = new RateLimitException(
      error,
      parseInt(error.response?.headers['Retry-After'] || '20')
    );
  } else if (isNotFoundError(error)) {
    result = new DocumentNotFoundException(error.response?.data);
  }

  if (throws) throw result;

  return result;
}
