<script lang="ts" setup>
import { computed } from 'vue';
import Icon from '@/modules/ui/components/icon/Icon.vue';

interface Props {
  message?:string,
}

const props = defineProps<Props>();

const show = computed(() => {
  return (typeof props.message === 'string' && props.message.length);
});

</script>

<template>
  <div v-if="show" class="bg-red-100 border border-danger text-danger px-4 py-3 rounded relative dark:bg-main">
    <slot><Icon name="error" /> <span v-if="message && message.length">{{ $t(message) }}</span></slot>
  </div>
</template>

<style lang="postcss">
  @import "../../styles/alerts.css";
</style>
