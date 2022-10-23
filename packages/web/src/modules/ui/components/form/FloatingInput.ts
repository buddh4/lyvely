import {
  AllowedInputValueTypes,
  IBaseInputProps,
  useBaseInputSetup,
} from "@/modules/ui/components/form/BaseInput";
import { SetupContext } from "vue";

export function useFloatingInputSetup<T extends AllowedInputValueTypes = any>(
  props: IBaseInputProps,
  context: SetupContext
) {
  return {
    ...useBaseInputSetup<T>(props, context, { inputClass: "floating-input" }),
  };
}
