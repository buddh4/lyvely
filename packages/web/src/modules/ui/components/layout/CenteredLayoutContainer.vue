<script lang="ts" setup>
interface IProps {
  title?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  title: undefined,
});
</script>

<template>
  <section class="flex p-4 justify-center rounded h-screen w-full">
    <div
      class="bg-main main w-full max-w-sm p-4 border border-divide rounded shadow-xl m-auto"
    >
      <h1 class="text-center text-xl mb-4">
        <slot name="title">{{ $t(props.title) }}</slot>
      </h1>
      <slot></slot>
    </div>
  </section>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
