import { validate, ValidationError, ValidatorOptions } from 'class-validator';
import { IFieldValidationResult } from '@/validation/interfaces/validation-result.interface';

interface IValidatorOptions<T extends object = object> {
  isFieldValidator?: boolean;
  rules?: Record<keyof T, [(value: any, result: IFieldValidationResult) => Promise<IFieldValidationResult>]> | {};
}

interface IValidationOptions<T extends object = object> extends ValidatorOptions {
  validationField?: keyof T;
}

export class ModelValidator<T extends object = object> {
  private errors = {} as Record<keyof T, string>;
  private model: T;
  private rules: Record<keyof T, [(value: any, result: IFieldValidationResult) => Promise<boolean>]> | {};
  private readonly fieldValidator;
  private isFieldValidator = false;

  constructor(model?: T, { isFieldValidator = false, rules = {} } = {} as IValidatorOptions<T>) {
    this.model = model;
    this.isFieldValidator = isFieldValidator;
    this.rules = rules;
    if (!this.isFieldValidator) {
      this.fieldValidator = new ModelValidator<T>(model, { isFieldValidator: true, rules });
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

  setErrors(errors: IFieldValidationResult[]) {
    for (const error of errors) {
      if (error.errors?.length) {
        this.errors[error.property] = error.errors[0];
      }
    }
  }

  getError(field: keyof T) {
    return this.errors[field];
  }

  async validate(options: IValidationOptions<T> = {}): Promise<boolean> {
    options.forbidUnknownValues = options.forbidUnknownValues !== false;
    this.setValidationErrors(await validate(this.model, options));
    await this.validateRules(options);
    return !this.hasErrors();
  }

  private async validateRules(options: IValidationOptions<T> = {}) {
    for (const property of Object.keys(this.rules)) {
      if (options.validationField && options.validationField !== property) continue;
      if (this.getError(<keyof T>property)) continue;

      const propRules = this.rules[property] || [];
      for (const rule of propRules) {
        const injectedResult: IFieldValidationResult = { property, errors: [] };
        const result = (await rule(this.model[property], injectedResult)) || injectedResult;
        if (!!result.errors?.length) {
          this.errors[property] = result.errors[0];
          break;
        }
      }
    }
  }

  private setValidationErrors(errors?: ValidationError[]) {
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

  async validateField(field: keyof T, options?: IValidationOptions<T>): Promise<boolean> {
    if (this.isFieldValidator || !this.fieldValidator) {
      throw new Error('Call of validateField is not supported for this validator type');
    }

    options = options || {};
    options.validationField = field;

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
