import { FieldValidationException } from '@/exceptions';

export class InvalidDataPointValueTypeException extends FieldValidationException {
  constructor(error?: string) {
    error ||= 'isValid';
    super([{ property: 'valueType', errors: [error] }]);
  }
}
