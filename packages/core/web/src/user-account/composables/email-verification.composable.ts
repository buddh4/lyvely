import { ref } from 'vue';
import {
  UnauthenticatedServiceException,
  FieldValidationException,
  IValidatorOptions,
} from '@lyvely/common';
import { VerifyEmailDto, ResendOtp, OtpInfo } from '@lyvely/interface';
import { I18nModelValidator } from '@/i18n';

interface IEmailVerificationOptions {
  verify: (dto: VerifyEmailDto) => Promise<boolean>;
  resend: (dto: ResendOtp) => Promise<OtpInfo>;
  validatorOptions?: IValidatorOptions<VerifyEmailDto>;
}

export function useEmailVerificationStore(options: IEmailVerificationOptions) {
  const model = ref(new VerifyEmailDto());
  const validator = ref(
    new I18nModelValidator<VerifyEmailDto>(model.value, options.validatorOptions),
  );
  const attempts = ref(0);
  const errorMsg = ref<undefined | string>();
  const otpInfo = ref(new OtpInfo());

  const startVerificationOf = async (
    emailOrUsername: string,
    otpOrRemember?: OtpInfo | boolean,
  ) => {
    model.value.emailOrUsername = emailOrUsername;
    if (otpOrRemember instanceof OtpInfo) {
      otpInfo.value = otpOrRemember;
    } else {
      await resendOtp(otpOrRemember);
    }
  };

  const reset = () => {
    softReset();
    model.value = new VerifyEmailDto();
    validator.value.setModel(model.value);
  };

  const softReset = () => {
    model.value.otp = '';
    validator.value.reset();
    otpInfo.value = new OtpInfo();
    attempts.value = 0;
    errorMsg.value = undefined;
  };

  async function verifyEmail() {
    try {
      if (!(await validate())) return false;

      errorMsg.value = undefined;
      otpInfo.value.attempts++;

      const result = await options.verify(model.value);
      reset();
      return result;
    } catch (e) {
      handleError(e);
    }
  }

  async function validate() {
    if (!(await validator.value.validate())) {
      errorMsg.value = validator.value.getError('otp');
      return false;
    }

    if (!otpInfo.value.hasAttemptsLeft()) {
      errorMsg.value = 'otp.errors.maxAttempts';
      return false;
    }

    if (otpInfo.value.isExpired()) {
      errorMsg.value = 'otp.errors.expired';
      return false;
    }

    return true;
  }

  async function resendOtp(remember?: boolean) {
    try {
      softReset();
      otpInfo.value = await options.resend(
        new ResendOtp({ emailOrUsername: model.value.emailOrUsername, remember: remember }),
      );
    } catch (e: any) {
      handleError(e);
    }
  }

  function handleError(e: any) {
    if (e instanceof UnauthenticatedServiceException || FieldValidationException) {
      errorMsg.value = !otpInfo.value.hasAttemptsLeft()
        ? 'otp.errors.maxAttempts'
        : otpInfo.value.isExpired()
        ? 'otp.errors.expired'
        : 'otp.errors.invalid';
    } else {
      errorMsg.value = e?.message || 'error.unknown';
    }
  }

  return {
    model,
    startVerificationOf,
    verifyEmail,
    resendOtp,
    validator,
    attempts,
    otpInfo,
    errorMsg,
    reset,
    validate,
  };
}
