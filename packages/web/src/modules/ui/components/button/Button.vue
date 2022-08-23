<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script lang="ts" setup>
import { toRefs, ref } from 'vue';
import { includesUtilityClass } from '@/modules/ui/utils';
import { RouteRecord } from 'vue-router';
import { ConfirmOptions } from "@/modules/ui/components/modal/ConfirmOptions";
import ConfirmModal from "@/modules/ui/components/modal/ConfirmModal.vue";

interface Props {
  submit?: boolean,
  label?: string,
  active?: boolean,
  border?: boolean,
  disabled?: boolean,
  rounded?: boolean,
  route?: RouteRecord,
  confirm?: ConfirmOptions
}

const props = withDefaults(defineProps<Props>(), {
  submit: false,
  label: undefined,
  active: false,
  border: true,
  disabled: false,
  rounded: true,
  route: undefined,
  confirm: undefined,
});

function getClassNames(attrClasses: any, isActive?: boolean) {
  return {
    'select-none': true,
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

const emit = defineEmits(['click']);

const showConfirm = ref(false);

function onClick() {
  if(props.confirm) {
    showConfirm.value = true;
  } else {
    emit('click');
  }
}

const { label } = toRefs(props);
</script>

<template>
  <button v-if="!route" :class="getClassNames($attrs.class)" v-bind="$attrs" :type="buttonType" :disabled="disabled" @click.prevent="onClick">
    <slot>{{ $t(label) }}</slot>
  </button>
  <router-link v-if="route" v-slot="{ navigate, isActive }" :to="route" custom>
    <button :class="getClassNames($attrs.class, isActive)" v-bind="$attrs" :type="buttonType" :disabled="disabled" @click="navigate">
      <slot>{{ $t(label) }}</slot>
    </button>
  </router-link>

  <ConfirmModal v-if="confirm"  v-model="showConfirm" :options="confirm" @submit="$emit('click')">
    <slot name="confirmBody"></slot>
  </ConfirmModal>
</template>

<style lang="postcss">
@import "../../styles/buttons.css";
</style>
