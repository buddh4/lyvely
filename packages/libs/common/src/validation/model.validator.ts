import { validate, ValidationError, ValidatorOptions } from 'class-validator';
import { IFieldValidationResult } from './interfaces/validation-result.interface';
import { getFirstValidationError } from './validation.utils';

interface ITranslationError<T> {
  model: T;
  value: any;
  property: keyof T & string;
  rule: string;
  message: string;
  context: any;
}

export interface IValidatorOptions<T extends object = object> {
  isFieldValidator?: boolean;
  rules?:
    | Record<
        keyof T,
        [(value: any, result: IFieldValidationResult) => Promise<IFieldValidationResult>]
      >
    | any;
  translate?: (error: ITranslationError<T>) => string | undefined;
}

export interface IValidationOptions<T extends object = object> extends ValidatorOptions {
  validationField?: keyof T;
}

export class ModelValidator<T extends object = object> {
  protected errors: { [k in keyof T]?: string };
  protected model?: T;
  protected readonly fieldValidator: ModelValidator<T>;
  protected options: IValidatorOptions<T>;

  constructor(model?: T, options?: IValidatorOptions<T>) {
    this.options = options || {};
    this.errors = {};
    this.options.rules = this.options.rules || <any>{};
    this.model = model as T | undefined;
    if (!this.options.isFieldValidator) {
      this.fieldValidator = new ModelValidator<T>(
        model,
        Object.assign({}, options, { isFieldValidator: true }),
      );
    }
  }

  addRule(
    property: keyof T,
    validator: (value: any, result: IFieldValidationResult) => Promise<IFieldValidationResult>,
  ) {
    if (!this.options.rules[property]) {
      this.options.rules[property] = [validator];
    } else {
      this.options.rules[property].push(validator);
    }
  }

  setModel(model: T) {
    this.reset();
    this.model = model;
    this.fieldValidator?.setModel(model);
  }

  hasErrors(): boolean {
    return !!this.getErrorSummary().length;
  }

  reset() {
    this.errors = {} as Record<keyof T, string>;
  }

  getErrorSummary(): string[] {
    return Object.values(this.errors);
  }

  getValidationResult(): IFieldValidationResult[] {
    return Object.keys(this.errors).map((property) => ({
      property: property,
      errors: [this.errors[property as keyof T]!],
    }));
  }

  setErrors(errors: IFieldValidationResult[]) {
    for (const error of errors) {
      if (error.errors?.length) {
        this.errors[error.property as keyof T] = error.errors[0];
      }
    }
  }

  setError(property: keyof T, message: string) {
    this.errors[property] = message;
  }

  deleteError(property: keyof T) {
    delete this.errors[property];
  }

  getError(field: keyof T) {
    return this.errors[field];
  }

  async validate(options: IValidationOptions<T> = {}): Promise<boolean> {
    if (!this.model) return false;

    options.forbidUnknownValues = options.forbidUnknownValues !== false;
    options.validationError = { target: true, value: true };
    this.setValidationErrors(await validate(this.model, options));
    await this.validateRules(options);
    return !this.hasErrors();
  }

  private async validateRules(options: IValidationOptions<T> = {}) {
    if (!this.model) return false;

    for (const property of Object.keys(this.options.rules)) {
      if (options.validationField && options.validationField !== property) continue;
      if (this.getError(<keyof T>property)) continue;

      const propRules = this.options.rules[property] || [];
      for (const rule of propRules) {
        const injectedResult: IFieldValidationResult = { property, errors: [] };
        const result =
          (await rule(this.model[property as keyof T], injectedResult)) || injectedResult;
        if (result.errors?.length) {
          this.errors[property as keyof T] = result.errors[0];
          break;
        }
      }
    }
  }

  private setValidationErrors(errors?: ValidationError[]) {
    this.reset();

    if (!errors?.length) return;

    for (const error of errors) {
      this.setFirstError(error);
    }
  }

  private setFirstError(error: ValidationError) {
    const { message, rule } = getFirstValidationError(error);
    if (message) {
      this.errors[error.property as keyof T] = this.options.translate
        ? this.options.translate({
            model: error.target as T,
            value: error.value,
            property: error.property as keyof T & string,
            message: message,
            rule: rule,
            context: error.contexts,
          }) || message
        : message;
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
