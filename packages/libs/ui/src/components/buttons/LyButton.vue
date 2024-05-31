<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { ref, onMounted, Ref } from 'vue';
import { includesUtilityClass } from '@/helpers';
import { RouteLocationRaw } from 'vue-router';
import { isDevelopmentEnvironment } from '@/config';
import { t, Translatable } from '@/i18n';

export interface IProps {
  submit?: boolean;
  text?: Translatable;
  active?: boolean;
  border?: boolean;
  disabled?: boolean;
  loading?: boolean;
  rounded?: boolean;
  isToggle?: boolean;
  outlined?: boolean;
  route?: RouteLocationRaw;
}

const props = withDefaults(defineProps<IProps>(), {
  submit: false,
  active: false,
  border: true,
  text: '',
  disabled: false,
  loading: false,
  rounded: true,
  route: undefined,
  isToggle: false,
  outlined: false,
});

function getClassNames(attrClasses: any, isActive?: boolean, loading?: boolean) {
  return {
    'select-none': true,
    outlined: props.outlined,
    button: true,
    loading: loading,
    'no-underline': true,
    'text-center': true,
    rounded: props.rounded && !includesUtilityClass(attrClasses, 'rounded'),
    'inline-block': true,
    'border-0': !props.border,
    active: props.active || isActive,
    'py-1.5': !includesUtilityClass(attrClasses, 'py'),
    'px-2.5': !includesUtilityClass(attrClasses, 'px'),
  };
}

const buttonType: 'submit' | 'button' = props.submit ? 'submit' : 'button';

const emit = defineEmits(['click']);

const button = ref<HTMLElement>() as Ref<HTMLElement>;

if (isDevelopmentEnvironment()) {
  onMounted(() => {
    if (!button.value) return;
    const buttonEl = button.value;
    const title = buttonEl.getAttribute('title') || '';
    const ariaLabel = buttonEl.getAttribute('aria-label') || '';
    const textContent = buttonEl.textContent || '';
    if (
      title.length <= 3 &&
      ariaLabel.length <= 3 &&
      textContent.length <= 3 &&
      buttonEl.getAttribute('aria-hidden') !== 'true'
    ) {
      console.warn('Button without aria information detected');
      console.warn({ ariaMissingIn: buttonEl });
    }
  });
}

function getAriaSelected($attrs: any) {
  if ($attrs['aria-selected']) {
    return $attrs['aria-selected'];
  }

  if (
    $attrs['role'] &&
    [
      'tab',
      'option',
      'menuitemradio',
      'treeitem',
      'gridcell',
      'row',
      'rowheader',
      'columnheader',
    ].includes($attrs['role'])
  ) {
    return props.active ? 'yes' : 'no';
  }
}

function getAriaPressed($attrs: any) {
  if ($attrs['aria-pressed']) {
    return $attrs['aria-pressed'];
  }

  if (props.isToggle) {
    return props.active ? 'yes' : 'no';
  }
}
</script>

<template>
  <button
    v-if="!route"
    ref="button"
    :aria-pressed="getAriaPressed($attrs)"
    :aria-selected="getAriaSelected($attrs)"
    :class="getClassNames($attrs.class, false, loading)"
    v-bind="$attrs"
    :type="buttonType"
    :disabled="disabled || loading"
    :data-loading="loading"
    @click.prevent="$emit('click')">
    <slot :active="active">{{ t(text) }}</slot>
  </button>
  <router-link v-if="route" v-slot="{ navigate, isActive }" :to="route" custom>
    <button
      ref="button"
      :class="getClassNames($attrs.class, isActive)"
      :aria-selected="isActive ? 'true' : 'false'"
      v-bind="$attrs"
      :type="buttonType"
      :disabled="disabled"
      @click="navigate">
      <slot :active="isActive">{{ t(text) }}</slot>
    </button>
  </router-link>
</template>

<style>
.button {
  transition: background 0.5s;
}
.button.disabled,
.button:disabled {
  cursor: not-allowed;
}

.button.primary,
.button.secondary,
.button.warning,
.button.info,
.button.success,
.button.secondary,
.button.danger {
  @apply border text-inverted;
}

.button.loading {
  animation-duration: 1.8s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: placeHolderShimmer;
  animation-timing-function: linear;
}

.button.primary.loading {
  background: linear-gradient(
    to right,
    var(--color-primary) 8%,
    var(--color-primary-light) 38%,
    var(--color-primary) 54%
  );
  background-size: 1000px 640px;
  position: relative;
}

.button.secondary.loading {
  background: linear-gradient(
    to right,
    var(--color-secondary) 8%,
    var(--color-secondary-light) 38%,
    var(--color-secondary) 54%
  );
  background-size: 1000px 640px;
  position: relative;
}

.button.info.loading {
  background: linear-gradient(
    to right,
    var(--color-info) 8%,
    var(--color-info-light) 38%,
    var(--color-info) 54%
  );
  background-size: 1000px 640px;
  position: relative;
}

.button.success.loading {
  background: linear-gradient(
    to right,
    var(--color-success) 8%,
    var(--color-success-light) 38%,
    var(--color-success) 54%
  );
  background-size: 1000px 640px;
  position: relative;
}

.button.warning.loading {
  background: linear-gradient(
    to right,
    var(--color-warning) 8%,
    var(--color-warning-light) 38%,
    var(--color-warning) 54%
  );
  background-size: 1000px 640px;
  position: relative;
}

.button.danger.loading {
  animation-duration: 1.8s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: placeHolderShimmer;
  animation-timing-function: linear;
  background: linear-gradient(
    to right,
    var(--color-danger) 8%,
    var(--color-danger-light) 38%,
    var(--color-danger) 54%
  );
  background-size: 1000px 640px;
  position: relative;
}

.dark .button {
  @apply text-main;
}

.button.attachment-l {
  @apply rounded-l-none;
}

.button.attachment-r {
  @apply rounded-r-none;
}

.button.primary {
  @apply border-primary bg-primary;
}

.button.outlined {
  @apply border;
}

.button.primary.outlined:not(.loading, .active, :hover, :disabled) {
  @apply border-primary bg-transparent text-primary;
}

.button.primary:hover,
.button.primary.active {
  @apply border-primary-dark bg-primary-dark;
}

.button.primary:disabled,
.button.primary.disabled {
  @apply border-primary-light bg-primary-light;
}

.button.primary.outlined:hover,
.button.primary.outlined.active {
  @apply border-primary bg-primary;
}

.button.secondary {
  @apply border-secondary bg-secondary dark:border-gray-600 dark:bg-gray-600;
}

.button.secondary:hover {
  @apply border-secondary-dark bg-secondary-dark dark:border-gray-700 dark:bg-gray-700;
}

.button.secondary:disabled,
.button.secondary.disabled {
  @apply border-secondary-light bg-secondary-light;
}

.button.secondary.outlined:not(.loading, .active, :hover, :disabled) {
  @apply border-secondary-light bg-transparent text-secondary dark:border-gray-600;
}

.button.secondary.outlined:hover,
.button.secondary.outlined.active {
  @apply border-secondary-light bg-secondary dark:border-gray-600 dark:bg-gray-700;
}

.button.info {
  @apply border-info bg-blue-400;
}

.button.info:hover {
  @apply border-info bg-blue-500;
}

.button.info.outlined:not(.loading, .active, :hover, :disabled) {
  @apply border-info bg-transparent text-info-dark;
}

.button.info.outlined:hover {
  @apply border-info bg-blue-400;
}

.button.info:disabled,
.button.info.disabled {
  @apply border-info-light bg-blue-300;
}

.button.success {
  @apply border border-success bg-success;
}

.button.success.outlined:not(.loading, .active, :hover, :disabled) {
  @apply border-success bg-transparent text-success;
}

.button.success:hover,
.button.success.active {
  @apply border-success-dark bg-success-dark;
}

.button.success:disabled,
.button.success.disabled {
  @apply border-success-light bg-success-light;
}

.button.success.outlined:hover,
.button.success.outlined.active {
  @apply border-success bg-success;
}

.button.warning {
  @apply border-warning bg-warning;
}

.button.warning.outlined:not(.loading, .active, :hover, :disabled) {
  @apply border-warning bg-transparent text-warning;
}

.button.warning:hover,
.button.warning.active {
  @apply border-warning-dark bg-warning-dark;
}

.button.warning:disabled,
.button.warning.disabled {
  @apply border-warning-light bg-warning-light;
}

.button.warning.outlined:hover,
.button.warning.outlined.active {
  @apply border-warning bg-warning;
}

.button.danger {
  @apply border-danger bg-danger;
}

.button.danger.outlined:not(.loading, .active, :hover, :disabled) {
  @apply border-danger bg-transparent text-danger;
}

.button.danger:hover,
.button.danger.active {
  @apply border-danger-dark bg-danger-dark;
}

.button.danger:disabled,
.button.danger.disabled {
  @apply border-danger-light bg-danger-light;
}

.button.danger.outlined:hover,
.button.danger.outlined.active {
  @apply border-danger bg-danger;
}

.button-group .button:not(:first-child) {
  border-left: 0 !important;
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}

.button-group .button:not(:last-child) {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.button-group .button:first-child {
  @apply rounded-l;
}

.button-group .button:last-child {
  @apply rounded-r;
}
</style>
