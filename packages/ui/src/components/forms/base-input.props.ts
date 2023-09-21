export interface IBaseInputProps {
  id?: string;
  label?: string;
  helpText?: string;
  name?: string;
  modelValue?: any;
  value?: string;
  property?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  inputClass?: any;
  wrapperClass?: string;
  autocomplete?: boolean | string;
  ariaDescribedby?: string;
  error?: string;
  loading?: boolean;
  autoValidation?: boolean;
}
