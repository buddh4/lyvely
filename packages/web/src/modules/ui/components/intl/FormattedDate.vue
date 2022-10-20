<script lang="ts" setup>
import { computed } from 'vue';

interface IProps {
  date: Date|string;
}

const props = defineProps<IProps>();

const dateObj = computed(() => (typeof props.date === 'string' ? new Date(props.date) : props.date));
</script>

<template>
  {{ new Intl.DateTimeFormat().format(dateObj) }}
</template>

<style scoped>

</style>
