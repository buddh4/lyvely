<script lang="ts" setup>
interface Props {
  label?: string;
  inputId: string;
  inputError?: string;
  wrapperClass?: string;
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  inputError: undefined,
  wrapperClass: undefined,
  required: false,
});

const wrapperClass = [
  "form-input relative",
  { required: props.required },
  props.wrapperClass,
];
</script>

<template>
  <section :class="wrapperClass">
    <slot name="label">
      <label
        v-if="label"
        :for="inputId"
        class="absolute inline-block inset-0 h-full opacity-60 pointer-events-none text-xs px-3 py-2"
      >
        {{ $t(label) }}
      </label>
    </slot>
    <slot></slot>
    <slot name="error">
      <transition name="fade">
        <div v-if="inputError" class="text-danger text-sm pl-1 pt-1">
          {{ inputError }}
        </div>
      </transition>
    </slot>
  </section>
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
