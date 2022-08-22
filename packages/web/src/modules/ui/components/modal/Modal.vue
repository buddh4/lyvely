<script lang="ts" setup>
import Icon from '@/modules/ui/components/icon/Icon.vue';
import Button from '@/modules/ui/components/button/Button.vue';
import { computed } from 'vue';

const emit = defineEmits([
  'submit',
  'show',
  'hide',
  'cancel',
  'update:modelValue'
]);

export interface ModalProps {
  modelValue: boolean,
  footerVisibility?: string,
  title: string,
  icon?: string,
  iconColor?: string,
  iconClass?: string,
  backButton?: boolean,
  cancelButton?: boolean,
  cancelButtonText?: string,
  cancelButtonClass?: string,
  submitButton?: boolean,
  submitButtonText?: string,
  submitOnEnter?: boolean,
}

const props = withDefaults(defineProps<ModalProps>(), {
  footerVisibility: 'd-none d-sm-flex',
  icon: '',
  backButton: true,
  cancelButton: true,
  cancelButtonText: 'Cancel',
  cancelButtonClass: 'secondary',
  submitButton: true,
  submitButtonText: 'common.submit',
  iconColor: undefined,
  iconClass: undefined,
  submitOnEnter: true
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
</script>

<template>
  <transition
      name="modal-transition"
      mode="out-in"
      enter-active-class="animate__animated animate__fadeIn animate__faster"
      leave-active-class="animate__animated animate__fadeOut animate__faster">

    <div
        v-if="props.modelValue"
        class="min-w-screen
    h-screen animated
    fadeIn faster
    fixed
    left-0 top-0 flex justify-center items-center inset-0
     z-50 outline-none focus:outline-none bg-no-repeat bg-center
     bg-cover overflow-y-auto" tabindex="-1" @keyup.esc="close" @keyup.enter="submitOnEnter">

      <div class="fixed bg-black opacity-50 inset-0 z-0"></div>
      <div
v-if="props.modelValue"
           class="w-full max-w-lg absolute mx-auto md:rounded-sm shadow-lg bg-white top-0 md:top-1/4 h-full md:h-auto">
        <div>
          <div class="flex items-center px-5 pt-5 pb-3 rounded-t-sm bg-white" data-modal-header>
            <slot name="header">
              <button
                  v-if="props.backButton"
                  role="button"
                  data-bs-dismiss="modal"
                  aria-label="Back"
                  class="align-middle inline-block mr-2"
                  @click="cancel">
                <Icon name="back" css-class="w-3.5"/>
              </button>

              <h5 class="text-lg inline-block align-middle flex align-items-center">
                <Icon
v-if="icon" class="w-6 mr-2" :name="icon" :class="props.iconClass"
                      :color="props.iconColor"></Icon>
                {{ $t(props.title) }}
              </h5>
            </slot>

            <Button
v-if="props.submitButton" data-modal-submit
                    class="primary rounded-full text-xs float-right align-middle ml-auto md:invisible px-2 py-0.5"
                    @click="$emit('submit')">
              {{ $t(props.submitButtonText) }}
            </Button>

          </div>

          <div class="px-5 py-6" data-modal-body>
            <slot name="body"></slot>
          </div>

          <div class="flex px-5 pt-3 pb-5 justify-end invisible md:visible" data-modal-footer>
            <slot name="footer">

              <Button v-if="props.cancelButton" :class="cancelButtonClass" @click="cancel">
                {{ $t(props.cancelButtonText) }}
              </Button>

              <Button v-if="props.submitButton" data-modal-submit class="m-1 primary" @click="$emit('submit')">
                {{ $t(submitButtonText) }}
              </Button>

            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>


<style scoped>
.modal-footer {
  padding: 10px;
}
</style>
