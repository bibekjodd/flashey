<script setup lang="ts">
const dummyArrray = [1, 2, 3, 4, 5, 6];
</script>

<template>
  <div class="flex flex-col px-3 sm:px-4 space-y-5 py-2">
    <div
      v-for="item of dummyArrray"
      :key="`${item}chatlistskeleton`"
      class="w-full flex space-x-2 animate-pulse"
    >
      <div class="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800"></div>
      <div class="flex flex-col space-y-3 flex-grow">
        <div class="w-full block h-6 bg-neutral-200 dark:bg-neutral-800 rounded-md"></div>
        <div class="w-full block h-4 bg-neutral-200 dark:bg-neutral-800 rounded-md"></div>
      </div>
    </div>
  </div>
</template>
