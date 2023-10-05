import { ModelValidator, IValidatorOptions, getPropertyConstraints } from '@lyvely/common';
import { translate } from '@/i18n';

export interface I18nModelValidatorOptionsIF<T extends object = object>
  extends IValidatorOptions<T> {
  translationKey?: string;
}

export class I18nModelValidator<T extends object = object> extends ModelValidator<T> {
  constructor(model?: T, options?: I18nModelValidatorOptionsIF<T>) {
    options = options || {};
    options.translate =
      options.translate ||
      ((error) => {
        const constraints = getPropertyConstraints(error.model, <any>error.property);
        const translationVars = constraints.reduce((result, value, index) => {
          result[`c${index + 1}`] = value;
          return result;
        }, {});
        const translationKey = `validation.${error.rule}`;
        translationVars['property'] = options?.translationKey
          ? translate(`${options.translationKey}.${error.property}`)
          : error.property;
        return translate(translationKey, translationVars);
        //return translated !== translationKey ? translated : error.message;
      });
    super(model, options);
  }
}
