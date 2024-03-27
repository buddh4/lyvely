<script lang="ts" setup>
import { computed, toRefs, ref, watch, nextTick, onUnmounted } from 'vue';
import { t, Translatable } from '@/i18n';
import LyButton from '@/components/buttons/LyButton.vue';
import LyIcon from '@/components/icons/LyIcon.vue';
import LyConditionalWrapper from '../helpers/LyConditionalWrapper.vue';

export interface IModalProps {
  /* The model value setting the open/close state of the modal */
  modelValue: boolean;
  /* Whether to wrap the body and footer in a from for accessibility purpose */
  form?: boolean;
  showFooter?: boolean;
  width?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
  title: Translatable;
  icon?: string;
  isLoading?: boolean;
  iconClass?: string;
  closeOnEscape?: boolean;
  submitOnSave?: boolean;
  submitIcon?: string;
  cancelButton?: boolean;
  cancelButtonText?: Translatable;
  cancelButtonClass?: string;
  submitButton?: boolean;
  submitButtonText?: Translatable;
}

const props = withDefaults(defineProps<IModalProps>(), {
  showFooter: true,
  form: true,
  icon: '',
  width: 'lg',
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
  widths[props.width as keyof typeof widths]
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

onUnmounted(() => {
  if(modelValue.value) close();
});
</script>

<template>
  <dialog
    v-if="modelValue"
    ref="rootEl"
    tabindex="1"
    :class="dialogClass"
    @keyup.esc.stop.prevent="onEscape"
    @keydown="onKeyDown">
    <ly-conditional-wrapper :if="form" tag="form" @submit.prevent="$emit('submit')">
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
              class="flex text-md md:text-lg focus-hidden align-middle justify-center md:justify-start align-items-center flex-grow"
              tabindex="-1">
              <ly-icon
                v-if="icon"
                class="w-6 mr-2"
                :scale-to="24"
                :name="icon"
                :class="iconClass" />
              <slot name="title">
                {{ t(title) }}
              </slot>
            </h1>

            <ly-button
              class="float-right align-middle font-bold ml-auto px-2 py-0.5 border-none hidden md:inline"
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
              data-id="btn-modal-cancel"
              :loading="isLoading"
              :class="cancelButtonClass"
              @click="cancel">
              {{ t(cancelButtonText) }}
            </ly-button>

            <ly-button
              v-if="submitButton"
              data-id="btn-modal-submit"
              :disabled="isLoading"
              :loading="isLoading"
              data-modal-submit
              class="my-1 primary"
              @click="$emit('submit')">
              {{ t(submitButtonText) }}
            </ly-button>
          </slot>
        </div>
        <div v-else class="p-2" data-modal-footer></div>
      </div>
    </ly-conditional-wrapper>
  </dialog>
</template>

<style scoped>
dialog::backdrop {
  @apply bg-black opacity-50;
}
</style>
