import { ComponentOptions, computed, ComputedRef, ref, SetupContext, inject } from 'vue';
import { merge, uniqueId } from 'lodash';
import { CssClassDefinition } from '@/util/component.types';
import { ModelValidator } from '@lyvely/common';
import slugify from 'slugify';

export type AllowedInputValueTypes = string | number | string[] | boolean | undefined;

export interface IFormModelData<T extends object = any> {
  id?: string;
  model: T;
  labelKey?: string;
  validator?: ModelValidator<T>;
  autoValidation: boolean;
}

export interface IBaseInputProps {
  id?: string;
  label?: string;
  helpText?: string;
  name?: string;
  modelValue?: any;
  value?: string;
  property?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  inputClass?: string;
  wrapperClass?: string;
  autocomplete?: boolean | string;
  ariaDescribedby?: string;
  error?: string;
  loading?: boolean;
  autoValidation?: boolean;
}

export function useBaseInputProps() {
  return {
    id: { type: String },
    label: { type: String },
    helpText: { type: String },
    name: { type: String, default: undefined },
    value: { type: String },
    property: { type: String },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    autocomplete: { type: [Boolean, String], default: false },
    autofocus: { type: Boolean, default: undefined },
    autoValidation: { type: Boolean, default: true },
    loading: { type: Boolean, default: false },
    ariaDescribedby: { type: String, default: undefined },
    modelValue: {},
    inputClass: { type: String, default: undefined },
    wrapperClass: { type: String, default: undefined },
    error: { type: String, default: undefined },
  };
}

export interface IBaseInputSetupOptions {
  inputClass?: string;
}

function getComputedInputValue<T extends AllowedInputValueTypes = any>(
  props: IBaseInputProps,
  emit: any,
  formModelData?: IFormModelData,
) {
  const model = formModelData?.model;
  const property = props.property;

  return model && property
    ? computed<T>({
        get: () => model[property],
        set: (val: T) => (model[property] = val),
      })
    : computed<T>({
        get: () => props.modelValue,
        set: (val: T) => emit('update:modelValue', val),
      });
}

function getComputedInputLabel(props: IBaseInputProps, formModelData?: IFormModelData) {
  const labelKey = formModelData?.labelKey;
  const property = props.property;

  return computed(() => {
    if (props.label) return props.label;
    if (labelKey && props.property) return labelKey + '.' + property;
    return '';
  });
}

function getComputedCssClasses(
  props: IBaseInputProps,
  options: IBaseInputSetupOptions,
  inputError: ComputedRef<string | undefined>,
) {
  return computed(() => {
    let result: CssClassDefinition = [];

    result.push({ 'is-invalid': !!inputError.value?.length });

    if (props.inputClass) {
      result = result.concat(Array.isArray(props.inputClass) ? props.inputClass : [props.inputClass]);
    }

    if (options.inputClass) {
      result = result.concat(Array.isArray(options.inputClass) ? options.inputClass : [options.inputClass]);
    }

    if (!props.label && !props.property) {
      result.push('no-label');
    }

    if (props.loading) {
      result.push('loading');
    }

    return result;
  });
}

function getComputedInputError(props: IBaseInputProps, formModelData?: IFormModelData<any>) {
  return computed(() =>
    formModelData?.validator && props.property ? formModelData.validator.getError(props.property) : props.error,
  );
}

function getId(props: IBaseInputProps, formModelData?: IFormModelData) {
  if (props.id) {
    return props.id;
  }

  if (formModelData?.id && props.property) {
    return slugify(`${formModelData.id}-${props.property}`, { lower: true });
  }

  return uniqueId('input');
}

function getComputedAutoCompleteValue(props: IBaseInputProps) {
  return computed(() => {
    if (!props.autocomplete || props.autocomplete === 'false') {
      return 'off';
    }

    if (props.autocomplete === true || props.autocomplete === 'true') {
      return 'on';
    }

    return props.autocomplete;
  });
}

export function useBaseInputSetup<T extends AllowedInputValueTypes = any>(
  props: IBaseInputProps,
  { emit }: SetupContext,
  options: IBaseInputSetupOptions = {},
) {
  const root = ref<HTMLElement | null>(null);
  const formModelData = inject<IFormModelData | undefined>('formModelData', undefined);
  const validator = formModelData?.validator;
  const useAutoValidation =
    formModelData?.autoValidation !== false && props.autoValidation && validator && props.property?.length;

  const inputError = getComputedInputError(props, formModelData);

  return {
    showHelpText: ref(false),
    inputId: getId(props, formModelData),
    inputValue: getComputedInputValue<T>(props, emit, formModelData),
    inputClass: getComputedCssClasses(props, options, inputError),
    autoCompleteValue: getComputedAutoCompleteValue(props),
    inputError: inputError,
    label: getComputedInputLabel(props, formModelData),
    editable: computed(() => !props.disabled && !props.readonly),
    hasFocus: computed(() => root.value && document.activeElement && root.value.contains(document.activeElement)),
    onChange: (evt: any) => {
      if (useAutoValidation || inputError.value) {
        validator!.validateField(props.property!).then(() => {
          emit('change', evt);
        });
      } else {
        emit('change', evt);
      }
    },
    onFocusOut: () => {
      if (useAutoValidation) {
        validator.validateField(props.property!);
      }
    },
  };
}

export function baseInputDef(def?: ComponentOptions): ComponentOptions {
  const baseDef = {
    props: {
      label: { type: String },
      name: { type: String },
      disabled: { type: Boolean, default: false },
      readonly: { type: Boolean, default: false },
      modelValue: {},
      cssClass: {},
      wrapperClass: {},
      error: undefined,
    },
    emits: ['update:modelValue', 'change'],
  };

  return (def ? merge({}, def, baseDef) : baseDef) as ComponentOptions;
}
