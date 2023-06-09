import { AllowedInputValueTypes, IBaseInputProps, useBaseInputSetup } from './BaseInput';

export function useFloatingInputSetup<T extends AllowedInputValueTypes = any>(
  props: IBaseInputProps,
  emit: (event: string, ...args: any[]) => void,
) {
  return {
    ...useBaseInputSetup<T>(props, emit, { inputClass: 'floating-input' }),
  };
}
