<script setup lang="ts">
import { useUser } from "@/stores/useUser";

const user = useUser();
</script>

<template>
  <section class="p-4">
    <div class="flex justify-between">
      <span class="font-semibold text-lg">Inbox</span>
      <img
        :src="
          user.data?.picture?.url ||
          'https://avatars.githubusercontent.com/u/110604197?v=4'
        "
        class="h-8 w-8 rounded-full object-contain bg-gradient-to-tr from-fuchsia-700 to-sky-600"
      />
    </div>

    <div class="my-3">
      <input
        type="text"
        name="searchbox"
        id="searchbox"
        placeholder="Search for Conversations"
        class="text-sm w-full bg-neutral-200/80 p-3 rounded-full"
      />
    </div>

    <span class="text-xs text-neutral-600">All Conversations</span>
  </section>
</template>
