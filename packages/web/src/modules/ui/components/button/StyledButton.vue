<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { ref, onMounted, Ref } from 'vue';
import { includesUtilityClass } from '@/modules/ui/utils';
import { RouteRecord } from 'vue-router';
import { IConfirmOptions } from '@/modules/ui/components/modal/IConfirmOptions';
import { isDevelopEnvironment } from '@/modules/core/environment';

export interface IProps {
  submit?: boolean;
  text?: string;
  active?: boolean;
  border?: boolean;
  disabled?: boolean;
  loading?: boolean;
  rounded?: boolean;
  isToggle?: boolean;
  route?: RouteRecord;
  confirm?: IConfirmOptions;
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
  confirm: undefined,
});

function getClassNames(attrClasses: any, isActive?: boolean, loading?: boolean) {
  return {
    'select-none': true,
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

const showConfirm = ref(false);

function onClick() {
  if (props.confirm) {
    showConfirm.value = true;
  } else {
    emit('click');
  }
}

const button = ref(null) as Ref<HTMLElement | null>;

if (isDevelopEnvironment()) {
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
    ['tab', 'option', 'menuitemradio', 'treeitem', 'gridcell', 'row', 'rowheader', 'columnheader'].includes(
      $attrs['role'],
    )
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
    @click.prevent="onClick"
  >
    <slot>{{ $t(text) }}</slot>
  </button>
  <router-link v-if="route" v-slot="{ navigate, isExactActive }" :to="route" custom>
    <button
      ref="button"
      :class="getClassNames($attrs.class, isExactActive)"
      :aria-selected="isExactActive ? 'true' : 'false'"
      v-bind="$attrs"
      :type="buttonType"
      :disabled="disabled"
      @click="navigate"
    >
      <slot>{{ $t(text) }}</slot>
    </button>
  </router-link>

  <ly-confirm v-if="confirm" v-model="showConfirm" :options="confirm" @submit="$emit('click')">
    <slot name="confirmBody"></slot>
  </ly-confirm>
</template>

<style lang="postcss">
@import '../../styles/buttons.css';
</style>
