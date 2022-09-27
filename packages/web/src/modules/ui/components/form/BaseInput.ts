import { ComponentOptions, computed, ref, SetupContext, inject } from 'vue';
import { merge, uniqueId } from 'lodash';
import { CssClassDefinition } from '@server/util/component.types';
import { ModelValidator } from "@lyvely/common";

export interface BaseInputProps {
  id?: string,
  label?: string,
  helpText?: string,
  name?: string,
  modelValue?: any,
  value?: string,
  property?: string,
  required?: boolean,
  disabled?: boolean,
  readonly?: boolean,
  cssClass?: string,
  wrapperClass?: string,
  autocomplete?: boolean,
  error?: string
}

export function useBaseInputProps() {
  return {
    id: {type: String, default: uniqueId('input')},
    label: {type: String},
    helpText: {type: String},
    name: {type: String},
    value: {type: String},
    property: { type: String },
    disabled: {type: Boolean, default: false},
    readonly: {type: Boolean, default: false},
    required: {type: Boolean, default: false},
    autocomplete: {type: Boolean, default: false},
    modelValue: {},
    cssClass: {},
    wrapperClass: {},
    error: undefined,
  }
}

export interface BaseInputSetupOptions {
  cssClass?: string
}

export function useBaseInputSetup<T = unknown>(props: BaseInputProps, { emit, }: SetupContext, options: BaseInputSetupOptions = {} ) {
  const root = ref<HTMLElement|null>(null);

  const editable = computed(() => !props.disabled && !props.readonly);

  const model = <any> inject('model', undefined);
  const property = props.property || '';

  const inputValue = model
    ? computed({
      get: () => model[property],
      set: (val:T) => model[property] = val
    })
    : computed({
    get: () => props.modelValue,
    set: (val:T) => emit("update:modelValue", val)
  });

  const labelKey = <any> inject('labelKey', undefined);

  const inputLabel = computed(() => {
    if(props.label) return props.label;
    if(labelKey && props.property) return labelKey+'.'+property;
    return '';
  });

  const cssClasses = computed(() => {
    let result: CssClassDefinition = [];

    result.push({"is-invalid": hasError()});

    if(props.cssClass) {
      result = result.concat(Array.isArray(props.cssClass) ? props.cssClass : [props.cssClass]);
    }

    if(options.cssClass) {
      result = result.concat(Array.isArray(options.cssClass) ? options.cssClass : [options.cssClass]);
    }

    return result;
  });

  const validator = <ModelValidator|undefined> inject('validator', undefined);

  function hasError() {
    return validator && props.property ? !!validator.getError(props.property) : !!props.error;
  }

  const inputError = computed(() => {
    return validator && props.property ? validator.getError(props.property) : props.error;
  });

  function hasFocus() {
    if (!root.value) {
      return false;
    }

    return document.activeElement && root.value.contains(document.activeElement);
  }

  return {
    errorClass: 'text-danger text-sm pl-1 pt-1',
    inputValue,
    inputError,
    cssClasses,
    editable,
    hasError,
    hasFocus,
    inputLabel
  }
}

export function baseInputDef(def?: ComponentOptions): ComponentOptions {
  const baseDef = {
    props: {
      label: {type: String},
      name: {type: String},
      disabled: {type: Boolean, default: false},
      readonly: {type: Boolean, default: false},
      modelValue: {},
      cssClass: {},
      wrapperClass: {},
      error: undefined,
    },
    emits: ["update:modelValue", "change"]
  };

  return (def ? merge({} , def, baseDef) : baseDef) as ComponentOptions;
}
