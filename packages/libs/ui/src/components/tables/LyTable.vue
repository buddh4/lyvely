<script setup lang="ts"></script>

<template>
  <table class="w-full text-left text-sm">
    <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-700">
      <slot name="head"></slot>
    </thead>
    <tbody>
      <slot name="body"></slot>
    </tbody>
  </table>
</template>

<style scoped></style>
