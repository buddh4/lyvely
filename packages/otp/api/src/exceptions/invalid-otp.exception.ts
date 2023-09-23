import { FieldValidationException } from '@lyvely/common';

export class InvalidOtpException extends FieldValidationException {
  constructor() {
    super([{ property: 'otp', errors: ['otp.errors.invalid'] }]);
  }
}
