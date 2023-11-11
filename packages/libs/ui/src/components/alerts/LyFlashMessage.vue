<script setup lang="ts">
import { Translatable, t } from '@/i18n';
import { computed } from 'vue';
import LyAlert from './LyAlert.vue';

export interface IProps {
  modelValue: boolean;
  text?: Translatable;
  type?: 'danger' | 'info' | 'warning' | 'success';
  manual?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  text: undefined,
  type: 'info',
  manual: false,
});

const emit = defineEmits(['update:modelValue']);

const show = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});
</script>

<template>
  <teleport to="body">
    <ly-alert
        v-model="show"
        aria-live="assertive"
        aria-atomic="true"
        class="left-0 md:left-6 fixed bottom-12 max-w-prose"
        :icon="true"
        :text="text"
        :type="type"
        :closable="manual"
        enter-active-class="animate__animated animate__faster animate__fadeInLeft"
        leave-active-class="animate__animated animate__faster animate__fadeOutLeft">
    </ly-alert>
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
