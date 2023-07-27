<script setup lang="ts">
const dummyArrray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
</script>

<template>
  <div class="flex flex-col px-3 sm:px-4 space-y-7 py-2">
    <div
      v-for="item of dummyArrray"
      :key="`${item}chatlistskeleton`"
      class="w-full flex space-x-2 animate-pulse"
    >
      <div class="w-10 h-10 rounded-full bg-neutral-200"></div>
      <div class="flex flex-col space-y-3 flex-grow">
        <div class="w-full block h-8 bg-neutral-200 rounded-md"></div>
        <div class="w-full block h-5 bg-neutral-200 rounded-md"></div>
      </div>
    </div>
  </div>
</template>
