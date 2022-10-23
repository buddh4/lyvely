<script lang="ts" setup>
import { computed, toRefs, ref, Ref, watch } from "vue";
import { suggestFocusElement } from "@/modules/ui/utils";
import { useAccessibilityStore } from "@/modules/accessibility/stores/accessibility.store";
import { useFocusTrap } from "@vueuse/integrations/useFocusTrap";

export interface IModalProps {
  modelValue: boolean;
  footerVisibility?: string;
  title: string;
  icon?: string;
  iconColor?: string;
  iconClass?: string;
  cancelButton?: boolean;
  cancelButtonText?: string;
  cancelButtonClass?: string;
  submitButton?: boolean;
  submitButtonText?: string;
  prevAutoFocus?: boolean;
  ariaLabel?: string;
}

const props = withDefaults(defineProps<IModalProps>(), {
  footerVisibility: "d-none d-sm-flex",
  icon: "",
  backButton: true,
  cancelButton: true,
  cancelButtonText: "common.cancel",
  submitButtonText: "common.submit",
  cancelButtonClass: "secondary",
  submitButton: true,
  iconColor: undefined,
  iconClass: undefined,
  prevAutoFocus: false,
  ariaLabel: undefined,
});

const cancelButtonClass = computed(() => [props.cancelButtonClass, "m-1"]);

const emit = defineEmits([
  "submit",
  "show",
  "hide",
  "cancel",
  "update:modelValue",
]);

function close() {
  emit("update:modelValue", false);
}

function cancel() {
  close();
  emit("cancel");
}

const rootEl = ref(null) as Ref<HTMLElement | null>;
const { modelValue } = toRefs(props);
const { activate, deactivate } = useFocusTrap(rootEl);

if (!props.prevAutoFocus) {
  watch([modelValue], () => {
    if (!modelValue.value) {
      deactivate();
      return;
    }

    useAccessibilityStore().setAriaHiddenApp(modelValue.value);
    setTimeout(() => {
      if (rootEl.value) {
        activate();
        suggestFocusElement(rootEl.value)?.focus();
      }
    }, 100);
  });
}
</script>

<template>
  <teleport to="body">
    <transition
      name="modal-transition"
      mode="out-in"
      enter-active-class="animate__animated animate__fadeIn animate__faster"
      leave-active-class="animate__animated animate__fadeOut animate__faster"
    >
      <div
        v-if="modelValue"
        ref="rootEl"
        class="min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover overflow-y-auto"
        tabindex="1"
        role="dialog"
        aria-hidden="false"
        :aria-label="ariaLabel || $t('modal.aria.root')"
        @keyup.esc="close"
      >
        <div class="fixed bg-black opacity-50 inset-0 z-0"></div>
        <div
          v-if="modelValue"
          class="w-full max-w-lg absolute mx-auto md:rounded-sm shadow-lg bg-main top-0 md:top-1/4 h-full md:h-auto"
        >
          <div
            class="flex items-center px-5 pt-5 pb-3 rounded-t-sm"
            data-modal-header
          >
            <slot name="header">
              <button
                v-if="cancelButton"
                aria-hidden="true"
                role="button"
                class="align-middle inline-block mr-2 md:hidden border-none"
                @click="cancel"
              >
                <ly-icon name="back" css-class="w-3.5" />
              </button>

              <h1
                class="text-lg inline-block align-middle flex align-items-center"
                tabindex="-1"
              >
                <ly-icon
                  v-if="icon"
                  class="w-6 mr-2"
                  :name="icon"
                  :class="iconClass"
                  :color="iconColor"
                />
                {{ $t(title) }}
              </h1>
              <ly-button
                v-if="submitButton"
                aria-hidden="true"
                class="primary rounded-full text-xs float-right align-middle ml-auto md:hidden px-2 py-0.5"
                @click="$emit('submit')"
              >
                {{ $t(submitButtonText) }}
              </ly-button>

              <ly-button
                class="float-right align-middle font-bold ml-auto hidden md:inline-block px-2 py-0.5 border-none"
                @click="cancel"
              >
                x
              </ly-button>
            </slot>
          </div>

          <section class="px-5 py-6" data-modal-body>
            <slot></slot>
          </section>

          <div
            class="flex px-5 pt-3 pb-5 justify-end invisible md:visible"
            data-modal-footer
          >
            <slot name="footer">
              <ly-button
                v-if="cancelButton"
                :class="cancelButtonClass"
                @click="cancel"
              >
                {{ $t(cancelButtonText) }}
              </ly-button>

              <ly-button
                v-if="submitButton"
                data-modal-submit
                class="m-1 primary"
                @click="$emit('submit')"
              >
                {{ $t(submitButtonText) }}
              </ly-button>
            </slot>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.modal-footer {
  padding: 10px;
}
</style>
