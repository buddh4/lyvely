<script lang="ts" setup>
import Badge from "@/modules/ui/components/badge/Badge.vue";
import randomcolor from "randomcolor";
import {useProfileStore} from "@/modules/user/store/profile.store";

interface Props {
  tagIds: string[],
  feature?: string
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

function select(tagId: string) {
  emit('selected', tagId);
}

if(props.tagIds.length) {
  console.log(props.tagIds);
  console.log(useProfileStore().getTags(props.feature))
}

const tags = useProfileStore().getTags(props.feature).filter(tag => props.tagIds.includes(tag.id));
</script>

<template>
  <div v-if="tags.length">
    <Badge
v-for="tag in tags"
           :key="tag.name"
           :color="color(tag.name)"
           @click="select(tag.id)">
      {{ tag.name }}
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
