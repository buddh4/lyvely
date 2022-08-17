<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script lang="ts" setup>
import Icon from '@/modules/ui/components/icon/Icon.vue';
import { toRefs } from 'vue';

interface Props {
  label: string,
  route?: string,
  icon?: string,
  closeOnClick?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  route: undefined,
  icon: undefined,
  closeOnClick: true,
});

defineEmits(['click']);

const evt = props.closeOnClick ? 'click': 'click.stop';
// TODO: implement switch

const classNames = 'block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-gray-200 no-underline';
const {route, label, icon} = toRefs(props);
</script>

<template>
  <router-link v-if="route" v-bind="$attrs" :to="route" :class="classNames" active-class="active" @click="$emit('click')">
    <Icon v-if="icon" :name="icon" class="align-middle"></Icon>
    <span class="align-middle">
      <slot>{{ $t(label) }}</slot>
    </span>
  </router-link>
  <a v-if="!route" v-bind="$attrs" href="#" :class="classNames" @click="$emit('click')">
    <Icon v-if="icon" :name="icon" class="align-middle"></Icon>
    <span class="align-middle">
      <slot>{{ $t(label) }}</slot>
    </span>
  </a>
</template>

<style scoped>
a {
  text-decoration: none !important;
}

svg {
  @apply mr-2
}
</style>
