import repository from "@/repository";
import {
  UserRegistrationDto,
  ENDPOINT_USER_REGISTRATION,
  IUserRegistrationService,
  EndpointResult,
  VerifyEmailDto,
  ResendOtpDto,
} from "@lyvely/common";

const endpoint = ENDPOINT_USER_REGISTRATION;

type SimpleAwaited<T> = T extends null | undefined
  ? T // special case for `null | undefined` when not in `--strictNullChecks` mode
  : T extends object & { then(onfulfilled: infer F): any } // `await` only unwraps object types with a callable `then`. Non-object types are not unwrapped
  ? F extends (value: infer V, ...args: any) => any // if the argument to `then` is callable, extracts the first argument
    ? Awaited<V> // recursively unwrap the value
    : never // the argument to `then` was not callable
  : T; // non-object or non-thenable

export default {
  register(data: UserRegistrationDto) {
    return repository.post<
      EndpointResult<IUserRegistrationService["register"]>
    >(`${endpoint}/`, data);
  },

  verifyEmail(data: VerifyEmailDto) {
    return repository.post<
      EndpointResult<IUserRegistrationService["verifyEmail"]>
    >(`${endpoint}/verify-email`, data);
  },

  resendVerifyEmail(data: ResendOtpDto) {
    return repository.post<
      EndpointResult<IUserRegistrationService["resendVerifyEmail"]>
    >(`${endpoint}/resend-verify-email`, data);
  },
};
