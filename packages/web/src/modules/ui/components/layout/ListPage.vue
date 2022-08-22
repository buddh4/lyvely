<script lang="ts" setup>
import Icon from "@/modules/ui/components/icon/Icon.vue";

interface Props {
  title: string,
  icon?: string
}

defineProps<Props>();

</script>

<template>
    <div class="list-page-root border border-divide rounded divide-y">
      <div class="prose py-2 px-3 ">
        <h4><Icon v-if="icon" :name="icon" class="mr-2" /> {{ $t(title) }}</h4>
      </div>

      <slot></slot>
    </div>
</template>

<style scoped>
.list-page-root > :last-child {
  @apply rounded-b
}
</style>
