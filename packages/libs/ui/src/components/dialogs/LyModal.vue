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
  showHeader?: boolean;
  width?: 'auto' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
  title?: Translatable;
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
  showHeader: true,
  form: true,
  title: '',
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
  { immediate: true }
);

function close() {
  emit('update:modelValue', false);
}

function cancel() {
  close();
  emit('cancel');
}

const widths = {
  auto: '',
  md: 'w-full max-w-md',
  lg: 'w-full max-w-lg',
  xl: 'w-full max-w-xl',
  '2xl': 'w-full max-w-2xl',
  '3xl': 'w-full max-w-3xl',
  '4xl': 'w-full max-w-4xl',
  full: 'w-full max-w-full',
};

const dialogClass = `${
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
  if (modelValue.value) close();
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
      <div class="flex h-screen-s max-h-screen-s flex-col md:h-auto md:min-h-0">
        <slot name="preHeader"></slot>
        <div
          v-if="showHeader"
          class="z-10 flex items-center p-3 px-4 pb-5 md:rounded-t-sm md:p-5 md:px-5 md:shadow"
          data-modal-header>
          <slot name="header">
            <ly-button class="pl-0 text-sm md:hidden" @click="cancel">
              <ly-icon name="arrow-left" class="w-3" />
            </ly-button>
            <h1
              class="text-md focus-hidden align-items-center flex flex-grow justify-center align-middle md:justify-start md:text-lg"
              tabindex="-1">
              <ly-icon
                v-if="icon"
                class="mr-2 w-6"
                :scale-to="24"
                :name="icon"
                :class="iconClass" />
              <slot name="title">
                {{ t(title) }}
              </slot>
            </h1>

            <ly-button
              class="float-right ml-auto hidden border-none px-2 py-0.5 align-middle font-bold md:inline"
              @click="cancel">
              x
            </ly-button>

            <ly-button
              v-if="submitButton"
              class="float-right ml-auto inline-block border-none px-1 py-0.5 align-middle font-bold md:hidden md:px-2"
              @click="$emit('submit')">
              <ly-icon :name="submitIcon" class="w-3.5"></ly-icon>
            </ly-button>
          </slot>
        </div>

        <section
          class="scrollbar-thin flex-grow overflow-auto p-2 pb-1 pt-1 md:p-5"
          data-modal-body>
          <slot></slot>
        </section>

        <div
          v-if="showFooter"
          class="z-10 flex justify-end gap-1 p-2 px-4 shadow md:p-5 md:px-5"
          data-modal-footer>
          <slot name="pre-footer"></slot>
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
              class="primary my-1"
              @click="$emit('submit')">
              {{ t(submitButtonText) }}
            </ly-button>
          </slot>
          <slot name="post-footer"></slot>
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
