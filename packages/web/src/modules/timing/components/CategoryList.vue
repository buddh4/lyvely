<script lang="ts" setup>
import Badge from "@/modules/ui/components/badge/Badge.vue";
import randomcolor from "randomcolor";
import { toRefs } from 'vue';

interface Props {
  categories: string[]
}

const props = defineProps<Props>();

const emit = defineEmits(['selected']);

const colors: { [key: string]: string } = {};

function color(category: string) {
  if (!colors[category]) {
    colors[category] = randomcolor({luminosity: "dark"});
  }

  return colors[category];
}

function select(category: string) {
  // TODO: maybe use timingstore or a category store to filter categories
  emit('selected', category);
}

const { categories } = toRefs(props);
</script>

<template>
  <div v-if="categories.length">
    <Badge v-for="category in categories"
           :key="category"
           :color="color(category)"
           @click="select(category)">
      {{ category }}
    </Badge>
  </div>
  <div v-else>
    <br />
  </div>
</template>

<style scoped>
.badge-category {
  font-weight: normal;
  cursor: pointer;
}
</style>
