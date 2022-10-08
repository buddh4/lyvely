import { validate, ValidationError, ValidatorOptions } from 'class-validator';
import { IFieldValidationResult } from './interfaces/validation-result.interface';

interface TranslationError {
  property: string;
  rule: string;
  message: string;
  context: any;
}

export interface IValidatorOptions<T extends object = object> {
  isFieldValidator?: boolean;
  rules?: Record<keyof T, [(value: any, result: IFieldValidationResult) => Promise<IFieldValidationResult>]> | {};
  translate?: (error: TranslationError) => string | undefined;
}

interface IValidationOptions<T extends object = object> extends ValidatorOptions {
  validationField?: keyof T;
}

export class ModelValidator<T extends object = object> {
  private errors = {} as Record<keyof T, string>;
  private model: T;
  private readonly fieldValidator;
  private options: IValidatorOptions<T>;

  constructor(model?: T, options?: IValidatorOptions<T>) {
    this.options = options || {};
    this.options.rules = this.options.rules || {};
    this.model = model;
    if (!this.options.isFieldValidator) {
      this.fieldValidator = new ModelValidator<T>(model, Object.assign({}, options, { isFieldValidator: true }));
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
    for (const property of Object.keys(this.options.rules)) {
      if (options.validationField && options.validationField !== property) continue;
      if (this.getError(<keyof T>property)) continue;

      const propRules = this.options.rules[property] || [];
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
    const rules = Object.keys(constraints);

    if (!rules.length) return;

    const firstRule = constraints?.isNotEmpty ? 'isNotEmpty' : constraints?.isDefined ? 'isDefined' : rules[0];

    const firstErrorMessage = constraints[firstRule];
    if (firstErrorMessage) {
      this.errors[error.property] = this.options.translate
        ? this.options.translate({
            property: error.property,
            message: firstErrorMessage,
            rule: firstRule,
            context: error.contexts,
          }) || firstErrorMessage
        : firstErrorMessage;
    }
  }

  async validateField(field: keyof T, options?: IValidationOptions<T>): Promise<boolean> {
    if (this.options.isFieldValidator || !this.fieldValidator) {
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
