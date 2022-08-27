<script lang="ts" setup>
interface Props {
  title?: string,
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined
});
</script>

<template>
  <section class="bg-slate-50 flex p-4 justify-center rounded h-full">
    <div class="bg-white dark:bg-gray-800 prose w-full max-w-sm p-4 border rounded shadow-xl m-auto">
      <h2 class="text-center">
        <slot name="title">{{ $t(props.title) }}</slot>
      </h2>
      <slot></slot>
    </div>
  </section>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
