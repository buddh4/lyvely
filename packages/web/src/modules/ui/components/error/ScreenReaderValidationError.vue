<script lang="ts" setup>
import { computed } from 'vue';

interface Props {
  errors: string[],
}

const props = defineProps<Props>();

const show = computed(() => {
  return props.errors.length;
});

</script>

<template>
  <div v-if="show" class="sr-only">
    <ul>
      <li v-for="error in errors" :key="error">{{ error }}</li>
    </ul>
  </div>
</template>
