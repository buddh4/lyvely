import { Translatable } from '@/i18n';

export interface IBaseInputProps {
  id?: string;
  name?: string;
  label?: Translatable;
  helpText?: Translatable;
  placeholder?: Translatable;
  error?: Translatable;
  modelValue?: any;
  value?: string;
  property?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  inputClass?: any;
  wrapperClass?: string;
  autocomplete?: boolean | string;
  ariaDescribedby?: string;
  loading?: boolean;
  autoValidation?: boolean;
}
