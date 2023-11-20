import { ModelValidator, IValidatorOptions, getPropertyConstraints } from '@lyvely/common';
import { translate } from './i18n';

export interface I18nModelValidatorOptionsIF<T extends object = object>
  extends IValidatorOptions<T> {
  labelKey?: string;
}

export class I18nModelValidator<
  T extends object = object,
  TOptions extends I18nModelValidatorOptionsIF<T> = I18nModelValidatorOptionsIF<T>,
> extends ModelValidator<T, TOptions> {
  constructor(model?: T, options?: TOptions) {
    options = options || <any>{};
    super(model, options);
    this.options.translate ||= (error) => {
      const constraints = getPropertyConstraints(error.model, <any>error.property);
      const translationVars = constraints.reduce((result, value, index) => {
        result[`c${index + 1}`] = value;
        return result;
      }, {});
      const translationKey = `validation.${error.rule}`;
      translationVars['property'] = this.labelKey
        ? translate(`${this.labelKey}.${error.property}`)
        : error.property;
      return translate(translationKey, translationVars);
    };
  }

  get labelKey(): string | undefined {
    return this.options.labelKey;
  }

  set labelKey(labelKey: string | undefined) {
    this.options.labelKey = labelKey;
  }
}
