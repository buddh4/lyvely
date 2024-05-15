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
      const constraints = [...getPropertyConstraints(error.model, <any>error.property)];

      const translateProperty = (prop: keyof T) => {
        const labelKey = this.getLabelKey();
        const propertyLabel = this.getPropertyLabel(prop);
        return propertyLabel
          ? translate(this.getPropertyLabel(prop)!)
          : labelKey
            ? translate(`${labelKey}.${prop as string}`)
            : prop;
      };

      // Dirty workaround but meh...
      if (error.rule === 'sameAs') {
        constraints[0] = translateProperty(constraints[0]);
      }

      const translationVars = constraints.reduce((result, value, index) => {
        result[`c${index + 1}`] = value;
        return result;
      }, {});

      // Now we try to find the right translation. If a label was set for this property we use it
      // otherwise we use the labelKey or fallback to the property name itself which is not translated.

      const translationKey = `validation.${error.rule}`;

      translationVars['property'] = translateProperty(error.property);
      return translate(error.message || translationKey, translationVars);
    };
  }
}
