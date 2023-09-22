import { FieldValidationException } from '@lyvely/core';

export class InvalidOtpException extends FieldValidationException {
  constructor() {
    super([{ property: 'otp', errors: ['otp.errors.invalid'] }]);
  }
}
