import { ComponentOptions, computed, ref, SetupContext } from 'vue';
import { merge, uniqueId } from 'lodash';
import { ErrorState } from '@/modules/ui/components/error/Error';
import { CssClassDefinition } from '@/util/component.types';

export interface BaseInputProps {
  id?: string,
  label?: string,
  name?: string,
  modelValue?: any,
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
    id: {type: String, default: uniqueId()},
    label: {type: String},
    name: {type: String},
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

  const value = computed({
    get: () => props.modelValue,
    set: (val:T) => emit("update:modelValue", val)
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
  })

  function hasError() {
    return !!props.error;
  }

  function hasFocus() {
    if (!root.value) {
      return false;
    }

    return document.activeElement && root.value.contains(document.activeElement);
  }

  return {
    errorClass: 'text-danger text-sm pl-1 pt-1',
    value,
    cssClasses,
    editable,
    hasError,
    hasFocus,
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
