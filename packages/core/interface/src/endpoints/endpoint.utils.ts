import { errorToServiceException } from '@/exceptions';
import { AxiosResponse } from 'axios';
import { assignRawDataToAndInitProps, Type } from '@lyvely/common';

type UnwrappedResponse<T extends Promise<AxiosResponse>> = T extends null | undefined | void
  ? T // special case for `null | undefined` when not in `--strictNullChecks` mode
  : Awaited<T> extends object & { data: infer V } // `await` only unwraps object types with a callable `then`. Non-object types are not unwrapped
  ? V
  : never; // non-object or non-thenable

export function unwrapResponse<T extends Promise<AxiosResponse>>(
  promise: T,
): Promise<UnwrappedResponse<T>> {
  return promise
    .then(({ data }) => data)
    .catch((err) => {
      throw errorToServiceException(err);
    });
}

export function unwrapAndTransformResponse<
  T extends Promise<AxiosResponse>,
  R extends UnwrappedResponse<T>,
>(promise: T, type: Type<R>): Promise<R> {
  return unwrapResponse(promise).then((rawResponse) => {
    return assignRawDataToAndInitProps(Object.create(type.prototype), rawResponse);
  });
}