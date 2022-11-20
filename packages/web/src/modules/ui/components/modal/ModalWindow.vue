<script lang="ts" setup>
import { computed, toRefs, ref, Ref, watch } from 'vue';
import { suggestFocusElement } from '@/modules/ui/utils';
import { useAccessibilityStore } from '@/modules/accessibility/stores/accessibility.store';
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap';
import { accessibilityFocus } from '@/modules/accessibility';
import { usePageStore } from '@/modules/core/store/page.store';
import { uniqueId } from 'lodash';

export interface IModalProps {
  modelValue: boolean;
  showFooter?: boolean;
  width?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
  title: string;
  icon?: string;
  isLoading?: boolean;
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
  showFooter: true,
  icon: '',
  width: 'lg',
  backButton: true,
  cancelButton: true,
  cancelButtonText: 'common.cancel',
  submitButtonText: 'common.submit',
  cancelButtonClass: 'secondary',
  isLoading: false,
  submitButton: true,
  iconClass: undefined,
  prevAutoFocus: false,
  ariaLabel: undefined,
});

const cancelButtonClass = computed(() => [props.cancelButtonClass, 'm-1']);

const emit = defineEmits(['submit', 'show', 'hide', 'cancel', 'update:modelValue']);

const modalId = uniqueId('modal');
const zIndex = ref(1000);

const { modelValue } = toRefs(props);

const pageStore = usePageStore();

watch(modelValue, (value) => {
  if (value) {
    zIndex.value = pageStore.pushModal(modalId) + 1000;
  } else {
    pageStore.popModal(modalId);
    zIndex.value = 1000;
  }
});

function close() {
  emit('update:modelValue', false);
}

function cancel() {
  close();
  emit('cancel');
}

const rootEl = ref<HTMLElement>();
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
        accessibilityFocus(suggestFocusElement(rootEl.value));
      }
    }, 100);
  });
}

const widths = {
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  full: 'max-w-full',
};

const modalWindowClass = `w-full ${
  widths[props.width]
} flex flex-col max-h-full relative md:rounded-sm shadow-lg bg-main md:h-auto`;

// absolute mx-auto md:rounded-sm shadow-lg bg-main top-0 md:top-1/4 h-full md:h-auto
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
        :style="{ 'z-index': zIndex }"
        :aria-label="ariaLabel || $t('modal.aria.root')"
      >
        <div class="fixed bg-black opacity-50 inset-0 z-0"></div>
        <div :class="modalWindowClass">
          <div class="flex items-center p-5 md:rounded-t-sm shadow z-10" data-modal-header>
            <slot name="header">
              <h1 class="text-lg inline-block align-middle flex align-items-center" tabindex="-1">
                <ly-icon v-if="icon" class="w-6 mr-2" :name="icon" :class="iconClass" />
                <slot name="title">
                  {{ $t(title) }}
                </slot>
              </h1>

              <ly-button
                class="float-right align-middle font-bold ml-auto inline-block px-2 py-0.5 border-none"
                @click="cancel"
              >
                x
              </ly-button>
            </slot>
          </div>

          <section class="p-5 pb-0 overflow-auto scrollbar-thin" data-modal-body>
            <slot></slot>
          </section>

          <div v-if="showFooter" class="flex p-5 justify-end shadow z-10" data-modal-footer>
            <slot name="footer">
              <ly-button v-if="cancelButton" :loading="isLoading" :class="cancelButtonClass" @click="cancel">
                {{ $t(cancelButtonText) }}
              </ly-button>

              <ly-button
                v-if="submitButton"
                :disabled="isLoading"
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
