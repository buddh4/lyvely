<script lang="ts" setup>
import Icon from '@/modules/ui/components/icon/Icon.vue';
import Button from '@/modules/ui/components/button/Button.vue';
import { computed, toRefs, ref, Ref, watch } from 'vue';
import { suggestFocusElement } from "@/modules/ui/utils";
import { useAccessibilityStore } from "@/modules/accessibility/stores/accessibilityStore";
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'

const emit = defineEmits([
  'submit',
  'show',
  'hide',
  'cancel',
  'update:modelValue'
]);

interface ModalProps {
  modelValue: boolean,
  footerVisibility?: string,
  title: string,
  icon?: string,
  iconColor?: string,
  iconClass?: string,
  cancelButton?: boolean,
  cancelButtonText?: string,
  cancelButtonClass?: string,
  submitButton?: boolean,
  submitButtonText?: string,
  submitOnEnter?: boolean,
  prevAutoFocus?: boolean,
  ariaLabel?: string,
}

const props = withDefaults(defineProps<ModalProps>(), {
  footerVisibility: 'd-none d-sm-flex',
  icon: '',
  backButton: true,
  cancelButton: true,
  cancelButtonText: 'common.cancel',
  submitButtonText: 'common.submit',
  cancelButtonClass: 'secondary',
  submitButton: true,
  iconColor: undefined,
  iconClass: undefined,
  submitOnEnter: true,
  prevAutoFocus: false,
  ariaLabel: undefined
});

const cancelButtonClass = computed(() => [props.cancelButtonClass, 'm-1']);

function close() {
  emit('update:modelValue', false);
}

function cancel() {
  close();
  emit('cancel');
}

function submitOnEnter() {
  if(props.submitOnEnter) {
    emit('submit')
  }
}

const rootEl = ref(null) as Ref<HTMLElement|null>;
const { modelValue } = toRefs(props);
const { activate, deactivate } = useFocusTrap(rootEl);

if(!props.prevAutoFocus) {
  watch([modelValue], () => {
    console.log('Modal state: '+modelValue.value);

    if(!modelValue.value) {
      deactivate();
    }

    useAccessibilityStore().setAriaHiddenApp(modelValue.value);
    setTimeout(() => {
      if(rootEl.value) {
        activate();
        suggestFocusElement(rootEl.value)?.focus();
      }
    },100);
  });
}

</script>

<template>
  <Teleport to="body">
  <transition
      name="modal-transition"
      mode="out-in"
      enter-active-class="animate__animated animate__fadeIn animate__faster"
      leave-active-class="animate__animated animate__fadeOut animate__faster">

    <div
        v-if="modelValue"
        ref="rootEl"
        class="min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0
        z-50 outline-none focus:outline-none bg-no-repeat bg-center
        bg-cover overflow-y-auto"
        tabindex="1"
        aria-hidden="false"
        :aria-label="ariaLabel || $t('modal.aria.root')"
        @keyup.esc="close">

      <div class="fixed bg-black opacity-50 inset-0 z-0"></div>
      <div
          v-if="modelValue"
          class="w-full max-w-lg absolute mx-auto md:rounded-sm shadow-lg bg-main top-0 md:top-1/4 h-full md:h-auto">
        <div>
          <div class="flex items-center px-5 pt-5 pb-3 rounded-t-sm" data-modal-header>
            <slot name="header">
              <button
                  v-if="cancelButton"
                  aria-hidden="true"
                  role="button"
                  class="align-middle inline-block mr-2 md:hidden border-none"
                  @click="cancel">
                <Icon name="back" css-class="w-3.5"/>
              </button>

              <h1 class="text-lg inline-block align-middle flex align-items-center" tabindex="-1">
                <Icon
                    v-if="icon" class="w-6 mr-2" :name="icon" :class="iconClass"
                    :color="iconColor" />
                   {{ $t(title) }}
              </h1>
            </slot>

            <Button
                v-if="submitButton"
                aria-hidden="true"
                class="primary rounded-full text-xs float-right align-middle ml-auto md:hidden px-2 py-0.5"
                @click="$emit('submit')">
              {{ $t(submitButtonText) }}
            </Button>

            <Button class="float-right align-middle font-bold ml-auto hidden md:inline-block px-2 py-0.5 border-none" @click="cancel">
              x
            </Button>

          </div>

          <div class="px-5 py-6" data-modal-body>
            <slot name="body"></slot>
          </div>

          <div class="flex px-5 pt-3 pb-5 justify-end invisible md:visible" data-modal-footer>
            <slot name="footer">

              <Button v-if="cancelButton" :class="cancelButtonClass" @click="cancel">
                {{ $t(cancelButtonText) }}
              </Button>

              <Button v-if="submitButton" data-modal-submit class="m-1 primary" @click="$emit('submit')">
                {{ $t(submitButtonText) }}
              </Button>

            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
  </Teleport>
</template>


<style scoped>
.modal-footer {
  padding: 10px;
}
</style>
