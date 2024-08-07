import { ComponentOptions, computed, ref, inject } from 'vue';
import { merge, uniqueId, ModelValidator } from '@lyvely/common';
import slugify from 'slugify';
import { t, Translatable } from '@/i18n';

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
  label?: Translatable;
  helpText?: Translatable | boolean;
  name?: string;
  trim?: boolean;
  modelValue?: any;
  value?: string;
  property?: string;
  placeholder?: Translatable;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  inputClass?: any;
  wrapperClass?: string;
  autocomplete?: boolean | string;
  ariaDescribedby?: string;
  error?: Translatable;
  loading?: boolean;
  autoValidation?: boolean;
}

export interface IBaseInputSetupOptions {
  inputClass?: string;
}

function getComputedInputValue<T extends AllowedInputValueTypes = any>(
  props: IBaseInputProps,
  emit: any,
  formModelData?: IFormModelData
) {
  const model = formModelData?.model;
  const property = props.property;

  return model && property
    ? computed<T>({
        get: () => model[property],
        set: (val: T) =>
          setTimeout(
            () => (model[property] = typeof val === 'string' && props.trim ? val.trim() : val)
          ),
      })
    : computed<T>({
        get: () => props.modelValue,
        set: (val: T) =>
          emit('update:modelValue', typeof val === 'string' && props.trim ? val.trim() : val),
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

function getComputedHelpText(props: IBaseInputProps, formModelData?: IFormModelData) {
  const labelKey = formModelData?.labelKey;
  const property = props.property;

  return computed(() => {
    if (typeof props.helpText === 'string') return props.helpText;
    if (props.helpText === true && labelKey && props.property)
      return labelKey + '.help.' + property;
    return '';
  });
}

function getComputedCssClasses(
  props: IBaseInputProps,
  options: IBaseInputSetupOptions,
  inputError: string
) {
  return computed(() => {
    let result: any = [];

    result.push({ 'is-invalid': !!inputError?.length });

    if (props.inputClass) {
      result = result.concat(
        Array.isArray(props.inputClass) ? props.inputClass : [props.inputClass]
      );
    }

    if (options.inputClass) {
      result = result.concat(
        Array.isArray(options.inputClass) ? options.inputClass : [options.inputClass]
      );
    }

    if (!props.label && !props.property) {
      result.push('no-label');
    }

    result.push('text-sm');

    // This was deactivated since most loading durations are too quick for the animation to look good
    // Was replaced with loader animation in right top corner in LyFloatingInputLayout
    /*if (props.loading) {
      result.push('loading');
    }*/

    return result;
  });
}

function getComputedInputError(props: IBaseInputProps, formModelData?: IFormModelData) {
  return computed(() =>
    formModelData?.validator && props.property
      ? formModelData.validator.getError(props.property)
      : props.error
  );
}

function getId(props: IBaseInputProps, formModelData?: IFormModelData): string | undefined {
  if (props.id) {
    return props.id;
  }

  if (formModelData?.id && props.property) {
    return slugify(`${formModelData.id}-${props.property}`, { lower: true });
  }

  return uniqueId('input');
}

function getDataId(
  props: IBaseInputProps,
  inputId?: string,
  formModelData?: IFormModelData
): string | undefined {
  if (formModelData?.id && props.property) {
    return slugify(`${formModelData.id}-${props.property}`, { lower: true });
  }

  return inputId || uniqueId('input');
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
  emit: (event: any, ...args: any[]) => void,
  options: IBaseInputSetupOptions = {}
) {
  const root = ref<HTMLElement | null>(null);
  const formModelData = inject<IFormModelData | undefined>('formModelData', undefined);
  const validator = formModelData?.validator;

  if (
    props.property &&
    typeof props.label === 'string' &&
    validator &&
    !validator.getPropertyLabel(props.property)
  ) {
    validator.setPropertyLabel(props.property, props.label);
  }

  const useAutoValidation =
    formModelData?.autoValidation !== false &&
    props.autoValidation &&
    validator &&
    props.property?.length;

  const inputError = getComputedInputError(props, formModelData);
  const inputId = getId(props, formModelData);
  return {
    showHelpText: ref(false),
    inputId: inputId,
    dataId: getDataId(props, inputId, formModelData),
    inputValue: getComputedInputValue<T>(props, emit, formModelData),
    inputClass: getComputedCssClasses(props, options, t(inputError.value)),
    autoCompleteValue: getComputedAutoCompleteValue(props),
    inputError: inputError,
    label: getComputedInputLabel(props, formModelData),
    helpText: getComputedHelpText(props, formModelData),
    editable: computed(() => !props.disabled && !props.readonly),
    hasFocus: computed(
      () => root.value && document.activeElement && root.value.contains(document.activeElement)
    ),
    onChange: (evt: any) => {
      if (useAutoValidation || inputError.value) {
        validator!.validateField(props.property!).then(() => {
          emit('change', evt);
        });
      }
    },
    onFocusOut: () => {
      if (useAutoValidation) {
        setTimeout(() => validator.validateField(props.property!), 50);
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
