<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script lang="ts" setup>
import { toRefs } from 'vue';
import { includesUtilityClass } from '@/modules/ui/utils';
import { RouteRecord } from 'vue-router';

defineEmits(['click']);

interface Props {
  submit?: boolean,
  label?: string,
  active?: boolean,
  border?: boolean,
  disabled?: boolean,
  rounded?: boolean,
  route?: RouteRecord
}

const props = withDefaults(defineProps<Props>(), {
  submit: false,
  label: undefined,
  active: false,
  border: true,
  disabled: false,
  rounded: true,
  route: undefined,
});

function getClassNames(attrClasses: any, isActive?: boolean) {
  return {
    'button': true,
    'no-underline': true,
    'text-center': true,
    'rounded': props.rounded,
    'inline-block': true,
    'border-0': !props.border,
    'active': props.active || isActive,
    'py-1.5' : !includesUtilityClass(attrClasses, 'py'),
    'px-2.5': !includesUtilityClass(attrClasses, 'px'),
  }
}

const buttonType = props.submit ? 'submit' : 'button';

const { label } = toRefs(props);
</script>

<template>
  <button v-if="!props.route" :class="getClassNames($attrs.class)" v-bind="$attrs" :type="buttonType" :disabled="props.disabled" @click="$emit('click')">
    <slot>{{ $t(label) }}</slot>
  </button>
  <router-link v-if="props.route" v-slot="{ navigate, isActive }" :to="props.route" custom>
    <button :class="getClassNames($attrs.class, isActive)" v-bind="$attrs" :type="buttonType" :disabled="props.disabled" @click="navigate">
      <slot>{{ $t(label) }}</slot>
    </button>
  </router-link>
</template>

<style lang="postcss">
@import "../../styles/buttons.css";
</style>
