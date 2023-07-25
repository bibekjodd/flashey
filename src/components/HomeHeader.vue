<script setup lang="ts">
import { dummyUserImage } from "@/lib/constants";
import { useUser } from "@/stores/useUser";
import { ref } from "vue";

const user = useUser();
const searchInput = ref("");
</script>

<template>
  <section class="p-3.5 xs:p-4 sm:px-5">
    <div class="flex justify-between">
      <span class="font-semibold text-lg">Inbox</span>
      <RouterLink to="/">
        <img
          :src="user.data?.picture?.url || dummyUserImage"
          class="h-8 w-8 rounded-full object-contain bg-gradient-to-tr from-fuchsia-700 to-sky-600"
        />
      </RouterLink>
    </div>

    <div class="my-3">
      <input
        type="text"
        v-model="searchInput"
        name="searchbox"
        id="searchbox"
        placeholder="Search For Conversation"
        class="text-sm w-full bg-neutral-100/80 px-4 py-3 rounded-full"
      />
    </div>
  </section>
</template>
