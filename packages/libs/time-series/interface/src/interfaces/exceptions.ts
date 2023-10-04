import { FieldValidationException } from '@lyvely/common';

export class InvalidDataPointValueTypeException extends FieldValidationException {
  constructor(error?: string, msg?: string) {
    error ||= 'isValid';
    super([{ property: 'valueType', errors: [error] }], msg);
  }
}
