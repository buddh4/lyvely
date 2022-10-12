import { ModelValidator, IValidatorOptions } from "@lyvely/common";
import { translate } from "@/i18n";

export interface I18nModelValidatorOptionsIF<T extends object = object>
  extends IValidatorOptions<T> {
  translationKey: string;
}

export class I18nModelValidator<
  T extends object = object
> extends ModelValidator<T> {
  constructor(model?: T, options?: I18nModelValidatorOptionsIF<T>) {
    if (options?.translationKey) {
      options.translate =
        options.translate ||
        ((error) => {
          const translationKey = `validation.${error.rule}`;
          const translated = translate(translationKey, {
            property: translate(`${options.translationKey}.${error.property}`),
          });

          return translated !== translationKey ? translated : error.message;
        });
    }

    super(model, options);
  }
}
