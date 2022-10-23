<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { toRefs } from 'vue';

export interface IProps {
  label: string;
  route?: string;
  icon?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  route: undefined,
  icon: undefined,
});

defineEmits(['click']);

const classNames =
  'dropdown-link block px-4 py-2 text-sm capitalize hover:bg-highlight dark:hover:bg-main no-underline flex no-wrap min-w-48';
const { route, label, icon } = toRefs(props);
</script>

<template>
  <router-link
    v-if="route"
    v-bind="$attrs"
    :to="route"
    :class="classNames"
    active-class="active"
    @click="$emit('click')"
  >
    <ly-icon v-if="icon" :name="icon" class="align-middle"></ly-icon>
    <span class="align-middle">
      <slot>{{ $t(label) }}</slot>
    </span>
  </router-link>
  <a v-if="!route" v-bind="$attrs" href="#" :class="classNames" @click="$emit('click')">
    <ly-icon v-if="icon" :name="icon" class="align-middle"></ly-icon>
    <span class="align-middle">
      <slot>{{ $t(label) }}</slot>
    </span>
  </a>
</template>

<style scoped>
.dropdown-link {
  min-width: 8rem;
}

a {
  text-decoration: none !important;
}

svg {
  @apply mr-2;
}
</style>
