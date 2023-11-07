<script setup lang="ts">
import { Translatable, t } from '@/i18n';
import { computed } from 'vue';
import LyIcon from '@/components/icons/LyIcon.vue';
import LyButton from '@/components/buttons/LyButton.vue';

export interface IProps {
  modelValue: boolean;
  message?: Translatable;
  type?: 'danger' | 'info' | 'warning' | 'success';
  manual?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  message: undefined,
  type: 'info',
  manual: false,
});

const emit = defineEmits(['update:modelValue']);

const styleMap = {
  danger: { icon: 'error', textClass: 'text-danger' },
  warning: { icon: 'warning', textClass: 'text-warning' },
  info: { icon: 'info', textClass: 'text-info' },
  success: { icon: 'check', textClass: 'text-success' },
};

const iconTextClass = computed(() => {
  return styleMap[props.type].textClass;
});

const iconName = computed(() => {
  return styleMap[props.type].icon;
});

const show = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val);
  },
});
</script>

<template>
  <teleport to="body">
    <transition
      name="flash"
      enter-active-class="animate__animated animate__faster animate__fadeInLeft"
      leave-active-class="animate__animated animate__faster animate__fadeOutLeft">
      <div
        v-if="show"
        class="flash-message flex items-center justify-start left-0 md:left-6 fixed bottom-12">
        <div
          class="flex items-center border border-divide px-4 py-3 rounded mb-1 bg-main text-sm gap-2">
          <ly-icon :name="iconName" :class="iconTextClass" />
          <slot>
            <template v-if="message"> {{ t(message) }}</template>
          </slot>
          <ly-button v-if="manual" class="text-xs px-1 py-1" @click="show = false">
            <ly-icon name="close" class="w-3 text-secondary hover:text-main" />
          </ly-button>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.flash-message {
  z-index: 100;
}
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
