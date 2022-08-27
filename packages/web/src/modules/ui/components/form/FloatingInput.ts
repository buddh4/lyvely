import { BaseInputProps, useBaseInputSetup } from '@/modules/ui/components/form/BaseInput';
import { SetupContext } from 'vue';

export function useFloatingInputSetup<T = unknown>(props: BaseInputProps, context: SetupContext) {
  return  {
    wrapperClass: ['form-input relative', {'required': props.required}],
    labelClass: 'absolute inline-block inset-0 h-full opacity-60 pointer-events-none text-xs px-3 py-2',
    ...useBaseInputSetup<T>(props, context, { cssClass: 'floating-input' })
  }
}

