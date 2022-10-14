import { errorToServiceException } from "@/util";
import { AxiosResponse } from "axios";

type UnwrappedResponse<T extends Promise<AxiosResponse>> = T extends
  | null
  | undefined
  ? T // special case for `null | undefined` when not in `--strictNullChecks` mode
  : Awaited<T> extends object & { data: infer V } // `await` only unwraps object types with a callable `then`. Non-object types are not unwrapped
  ? V
  : never; // non-object or non-thenable

export function unwrapEndpointRequest<T extends Promise<AxiosResponse>>(
  promise: T
): Promise<UnwrappedResponse<T>> {
  return promise
    .then(({ data }) => data)
    .catch((err) => {
      throw errorToServiceException(err);
    });
}
