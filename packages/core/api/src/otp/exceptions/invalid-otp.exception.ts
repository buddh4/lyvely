import { FieldValidationException } from '@lyvely/interface';

export class InvalidOtpException extends FieldValidationException {
  constructor() {
    super([{ property: 'otp', errors: ['otp.errors.invalid'] }]);
  }
}
