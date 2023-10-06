import { FieldValidationException } from '@lyvely/common';
export class InvalidDataPointValueTypeException extends FieldValidationException {
    constructor(error, msg) {
        error || (error = 'isValid');
        super([{ property: 'valueType', errors: [error] }], msg);
    }
}
