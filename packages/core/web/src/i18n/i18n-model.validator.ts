import { ModelValidator, IValidatorOptions, getPropertyConstraints } from '@lyvely/common';
import { translate } from './i18n';

export class I18nModelValidator<
  T extends object = object,
  TOptions extends IValidatorOptions<T> = IValidatorOptions<T>,
> extends ModelValidator<T, TOptions> {
  constructor(model?: T, options?: TOptions) {
    options = options || <any>{};
    super(model, options);
    this.options.translate ||= (error) => {
      // First we extract our constraints for this property from our model.
      const constraints = getPropertyConstraints(error.model, <any>error.property);
      const translationVars = constraints.reduce((result, value, index) => {
        result[`c${index + 1}`] = value;
        return result;
      }, {});

      // Now we try to find the right translation. If a label was set for this property we use it
      // otherwise we use the labelKey or fallback to the property name itself which is not translated.
      const translationKey = `validation.${error.rule}`;
      const propertyLabel = this.getPropertyLabel(error.property);
      const labelKey = this.getLabelKey();
      translationVars['property'] = propertyLabel
        ? translate(propertyLabel)
        : labelKey
        ? translate(`${labelKey}.${error.property}`)
        : error.property;
      return translate(translationKey, translationVars);
    };
  }
}
