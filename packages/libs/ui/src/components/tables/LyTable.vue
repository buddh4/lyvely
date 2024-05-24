<script setup lang="ts"></script>

<template>
  <table class="w-full text-left text-sm">
    <thead class="bg-gray-50 text-xs uppercase dark:bg-gray-700">
      <slot name="head"></slot>
    </thead>
    <tbody>
      <slot name="body"></slot>
    </tbody>
  </table>
</template>

<style scoped></style>
