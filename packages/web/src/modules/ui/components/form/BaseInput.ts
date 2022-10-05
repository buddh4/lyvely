import { ComponentOptions, computed, ref, SetupContext, inject } from "vue";
import { merge, uniqueId } from "lodash";
import { CssClassDefinition } from "@/util/component.types";
import { ModelValidator } from "@lyvely/common";

export interface FormModelData<T extends object = any> {
  model: T;
  labelKey?: string;
  validator?: ModelValidator<T>;
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
  cssClass?: string;
  wrapperClass?: string;
  autocomplete?: boolean;
  error?: string;
  autoValidation: boolean;
}

export function useBaseInputProps() {
  return {
    id: { type: String, default: uniqueId("input") },
    label: { type: String },
    helpText: { type: String },
    name: { type: String },
    value: { type: String },
    property: { type: String },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    autocomplete: { type: Boolean, default: false },
    autoValidation: { type: Boolean, default: true },
    modelValue: {},
    cssClass: {},
    wrapperClass: {},
    error: undefined,
  };
}

export interface IBaseInputSetupOptions {
  cssClass?: string;
}

function getComputedInputValue<T>(
  props: IBaseInputProps,
  emit: any,
  formModelData?: FormModelData
) {
  const model = formModelData?.model;
  const property = props.property;

  return model && property
    ? computed({
        get: () => model[property],
        set: (val: T) => (model[property] = val),
      })
    : computed({
        get: () => props.modelValue,
        set: (val: T) => emit("update:modelValue", val),
      });
}

function getComputedInputLabel(
  props: IBaseInputProps,
  formModelData?: FormModelData
) {
  const labelKey = formModelData?.labelKey;
  const property = props.property;

  return computed(() => {
    if (props.label) return props.label;
    if (labelKey && props.property) return labelKey + "." + property;
    return "";
  });
}

function getComputedCssClasses(
  props: IBaseInputProps,
  options: IBaseInputSetupOptions,
  hasError: () => boolean
) {
  return computed(() => {
    let result: CssClassDefinition = [];

    result.push({ "is-invalid": hasError() });

    if (props.cssClass) {
      result = result.concat(
        Array.isArray(props.cssClass) ? props.cssClass : [props.cssClass]
      );
    }

    if (options.cssClass) {
      result = result.concat(
        Array.isArray(options.cssClass) ? options.cssClass : [options.cssClass]
      );
    }

    return result;
  });
}

function getComputedInputError(
  props: IBaseInputProps,
  formModelData?: FormModelData<any>
) {
  return computed(() =>
    formModelData?.validator && props.property
      ? formModelData.validator.getError(props.property)
      : props.error
  );
}

export function useBaseInputSetup<T = unknown>(
  props: IBaseInputProps,
  { emit }: SetupContext,
  options: IBaseInputSetupOptions = {}
) {
  const root = ref<HTMLElement | null>(null);
  const formModelData = inject<FormModelData<any>>("formModelData");
  const validator = formModelData?.validator;
  const useAutoValidation =
    props.autoValidation && validator && props.property?.length;

  const hasError = () =>
    validator && props.property
      ? !!validator.getError(props.property)
      : !!props.error;

  return {
    inputValue: getComputedInputValue<T>(props, emit, formModelData),
    cssClasses: getComputedCssClasses(props, options, hasError),
    errorClass: "text-danger text-sm pl-1 pt-1",
    inputError: getComputedInputError(props, formModelData),
    inputLabel: getComputedInputLabel(props, formModelData),
    editable: computed(() => !props.disabled && !props.readonly),
    hasFocus: computed(
      () =>
        root.value &&
        document.activeElement &&
        root.value.contains(document.activeElement)
    ),
    hasError,
    onChange: (evt: any) => {
      if (useAutoValidation) {
        validator.validateField(props.property!).then(() => {
          emit("change", evt);
        });
      } else {
        emit("change", evt);
      }
    },
    onFocusOut: (evt: any) => {
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
    emits: ["update:modelValue", "change"],
  };

  return (def ? merge({}, def, baseDef) : baseDef) as ComponentOptions;
}
