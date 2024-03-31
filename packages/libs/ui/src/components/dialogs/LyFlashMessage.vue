<script setup lang="ts">
import { Translatable } from '@/i18n';
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
    <div class="flash-message fixed w-full bottom-5 px-5 z-50">
    <ly-alert
        v-model="show"
        aria-live="assertive"
        aria-atomic="true"
        :icon="true"
        :text="text"
        :type="type"
        :closable="manual"
        enter-active-class="animate__animated animate__faster animate__fadeInUp"
        leave-active-class="animate__animated animate__faster animate__fadeOutDown">
    </ly-alert>
    </div>
  </teleport>
</template>

<style scoped>
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
