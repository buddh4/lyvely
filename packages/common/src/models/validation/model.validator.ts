import { validate, ValidationError, ValidatorOptions } from 'class-validator';

interface IValidatorOptions {
  isFieldValidator?: boolean;
}

export class ModelValidator<T extends object = object> {
  private errors = {} as Record<keyof T, string>;
  private model: T;
  private readonly fieldValidator;
  private isFieldValidator = false;

  constructor(model?: T, { isFieldValidator = false } = {} as IValidatorOptions) {
    this.model = model;
    this.isFieldValidator = isFieldValidator;
    if (!this.isFieldValidator) {
      this.fieldValidator = new ModelValidator(model, { isFieldValidator: true });
    }
  }

  setModel(model: T) {
    this.reset();
    this.model = model;
    this.fieldValidator?.setModel(model);
  }

  hasErrors(): boolean {
    return !!this.getErrors().length;
  }

  reset() {
    this.errors = {} as Record<keyof T, string>;
  }

  getErrors() {
    return Object.values(this.errors);
  }

  getError(field: keyof T) {
    return this.errors[field];
  }

  async validate(options?: ValidatorOptions): Promise<boolean> {
    this.setErrors(await validate(this.model, options));
    return !this.hasErrors();
  }

  private setErrors(errors?: ValidationError[]) {
    this.reset();

    for (const error of errors) {
      this.setFirstError(error);
    }
  }

  private setFirstError(error: ValidationError) {
    const constraints = error.constraints as Record<string, string>;
    const firstError = constraints?.isNotEmpty || constraints?.isDefined || constraints[Object.keys(constraints)[0]];
    if (firstError) {
      this.errors[error.property] = firstError;
    }
  }

  async validateField(field: keyof T, options?: ValidatorOptions): Promise<boolean> {
    if (this.isFieldValidator || !this.fieldValidator) {
      throw new Error('Call of validateField is not supported for this validator type');
    }

    await this.fieldValidator.validate(options);
    const error = this.fieldValidator.getError(field);
    if (error) {
      this.errors[field] = error;
    } else {
      delete this.errors[field];
    }
    this.fieldValidator.reset();
    return typeof error !== 'string';
  }
}
