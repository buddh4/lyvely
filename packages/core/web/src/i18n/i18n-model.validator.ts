import { ModelValidator, IValidatorOptions, getPropertyConstraints } from '@lyvely/common';
import { translate, tryToTranslate } from './i18n';

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

      translationVars['property'] = translateProperty(error.property);

      // Now we try to find the right translation. If a label was set for this property we use it
      // otherwise we use the labelKey or fallback to the property name itself which is not translated.

      const result: string | null = error.message
        ? tryToTranslate(error.message, translationVars)
        : null;

      if (result) return result;

      return (
        tryToTranslate(error.rule, translationVars) ||
        tryToTranslate(`validation.${error.rule}`, translationVars) ||
        translate('validation.invalid')
      );
    };
  }
}
