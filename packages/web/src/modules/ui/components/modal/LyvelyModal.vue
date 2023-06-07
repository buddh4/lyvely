<script lang="ts" setup>
import { computed, toRefs, ref, watch, nextTick } from 'vue';

export interface IModalProps {
  modelValue: boolean;
  showFooter?: boolean;
  width?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
  title: string;
  icon?: string;
  isLoading?: boolean;
  iconClass?: string;
  closeOnEscape?: boolean;
  submitOnSave?: boolean;
  submitIcon?: string;
  cancelButton?: boolean;
  cancelButtonText?: string;
  cancelButtonClass?: string;
  submitButton?: boolean;
  submitButtonText?: string;
  ariaLabel?: string;
}

const props = withDefaults(defineProps<IModalProps>(), {
  showFooter: true,
  icon: '',
  width: 'lg',
  backButton: true,
  cancelButton: true,
  closeOnEscape: true,
  submitOnSave: true,
  submitIcon: 'send',
  cancelButtonText: 'common.cancel',
  submitButtonText: 'common.submit',
  cancelButtonClass: 'secondary',
  isLoading: false,
  submitButton: true,
  iconClass: undefined,
  ariaLabel: undefined,
});

const cancelButtonClass = computed(() => [props.cancelButtonClass, 'm-1']);

const emit = defineEmits(['submit', 'show', 'hide', 'cancel', 'update:modelValue']);

const { modelValue } = toRefs(props);

const rootEl = ref<HTMLDialogElement>();

watch(
  modelValue,
  (value) => {
    if (value) {
      nextTick(() => {
        rootEl.value?.scrollIntoView();
        rootEl.value?.showModal();
      });
    }
  },
  { immediate: true },
);

function close() {
  emit('update:modelValue', false);
}

function cancel() {
  close();
  emit('cancel');
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

const dialogClass = `w-full ${
  widths[props.width]
} h-screen-s max-h-screen-s md:h-fit md:max-h overflow-hidden md:min-h-0 my-0 md:my-auto p-0 bg-main text-main md:rounded-sm shadow-lg md:justify-center md:items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat`;

function onEscape(evt: KeyboardEvent) {
  if (props.closeOnEscape) {
    evt.preventDefault();
    evt.stopPropagation();
    evt.stopImmediatePropagation();
    cancel();
  }
}

function onKeyDown(evt: KeyboardEvent) {
  if (props.submitOnSave && evt.ctrlKey && evt.code === 'KeyS') {
    evt.preventDefault();
    evt.stopPropagation();
    evt.stopImmediatePropagation();
    emit('submit');
  }
}
</script>

<template>
  <teleport to="body">
    <dialog
      v-if="modelValue"
      ref="rootEl"
      tabindex="1"
      :class="dialogClass"
      :aria-label="ariaLabel || $t('modal.aria.root')"
      @keyup.esc.stop.prevent="onEscape"
      @keydown="onKeyDown">
      <div class="flex flex-col h-screen-s max-h-screen-s md:h-auto md:min-h-0">
        <slot name="preHeader"></slot>
        <div
          class="flex items-center p-3 px-4 pb-5 md:p-5 md:px-5 md:rounded-t-sm md:shadow z-10"
          data-modal-header>
          <slot name="header">
            <ly-button class="text-sm md:hidden pl-0" @click="cancel">
              <ly-icon name="arrow-left" class="w-3" />
            </ly-button>
            <h1
              class="flex text-md md:text-lg focus-hidden inline-block align-middle justify-center md:justify-start align-items-center flex-grow"
              tabindex="-1">
              <ly-icon
                v-if="icon"
                class="w-6 mr-2"
                :scale-to="24"
                :name="icon"
                :class="iconClass" />
              <slot name="title">
                {{ $t(title) }}
              </slot>
            </h1>

            <ly-button
              class="float-right align-middle font-bold ml-auto inline-block px-2 py-0.5 border-none hidden md:inline"
              @click="cancel">
              x
            </ly-button>

            <ly-button
              v-if="submitButton"
              class="float-right align-middle font-bold ml-auto inline-block px-1 md:px-2 py-0.5 border-none md:hidden"
              @click="$emit('submit')">
              <ly-icon :name="submitIcon" class="w-3.5"></ly-icon>
            </ly-button>
          </slot>
        </div>

        <section
          class="p-2 pt-1 md:p-5 pb-1 overflow-auto scrollbar-thin flex-grow"
          data-modal-body>
          <slot></slot>
        </section>

        <div
          v-if="showFooter"
          class="flex gap-1 p-2 px-4 md:p-5 md:px-5 justify-end shadow z-10"
          data-modal-footer>
          <slot name="footer">
            <ly-button
              v-if="cancelButton"
              :loading="isLoading"
              :class="cancelButtonClass"
              @click="cancel">
              {{ $t(cancelButtonText) }}
            </ly-button>

            <ly-button
              v-if="submitButton"
              :disabled="isLoading"
              :loading="isLoading"
              data-modal-submit
              class="my-1 primary"
              @click="$emit('submit')">
              {{ $t(submitButtonText) }}
            </ly-button>
          </slot>
        </div>
        <div v-else class="p-2" data-modal-footer></div>
      </div>
    </dialog>
  </teleport>
</template>

<style scoped>
dialog::backdrop {
  @apply bg-black opacity-50;
}
</style>
