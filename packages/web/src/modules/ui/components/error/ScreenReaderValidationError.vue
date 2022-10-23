<script lang="ts" setup>
import { computed } from 'vue';

export interface IProps {
  errors?: string[];
}

const props = defineProps<IProps>();

const show = computed(() => {
  return !!props.errors?.length;
});
</script>

<template>
  <div v-if="show" class="sr-only">
    <ul>
      <li v-for="error in errors" :key="error">{{ error }}</li>
    </ul>
  </div>
</template>
