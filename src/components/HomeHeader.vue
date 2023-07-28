<script setup lang="ts">
import { dummyUserImage } from "@/lib/constants";
import { useSearchUsers } from "@/stores/useSearchUsers";
import { useUser } from "@/stores/useUser";
import { ref, watch } from "vue";
// @ts-ignore
import SearchIcon from "vue-material-design-icons/Magnify.vue";
// @ts-ignore
import CloseIcon from "vue-material-design-icons/Close.vue";
import SuggestedUsers from "./SuggestedUsers.vue";
let timeout: number | null = null;
const user = useUser();
const searchInput = ref("");
const searchUsers = useSearchUsers();

const clearSearchInput = () => {
  searchInput.value = "";
};

watch(searchInput, () => {
  if (timeout) clearTimeout(timeout);
  setTimeout(async () => {
    await searchUsers.fetchUsers(searchInput.value);
  }, 200);
});
</script>

<template>
  <section class="px-3 xs:px-4 pt-3 xs:pt-4 sm:px-5 dark:text-white">
    <div class="flex py-3">
      <RouterLink
        to="/"
        class="font-semibold text-2xl font-poppins mr-auto text-transparent bg-gradient-to-r from-sky-500 to-fuchsia-600 bg-clip-text"
        >flashey</RouterLink
      >

      <RouterLink to="/">
        <img
          loading="lazy"
          :src="user.data?.picture?.url || dummyUserImage"
          class="h-7 w-7 rounded-full object-contain bg-gradient-to-tr from-fuchsia-700 to-sky-600"
        />
      </RouterLink>
    </div>

    <div
      class="my-3 group text-sm bg-neutral-100/80 dark:bg-neutral-800 px-4 rounded-full flex items-center space-x-2"
    >
      <label
        :hidden="!!searchInput"
        for="searchbox"
        class="text-neutral-600 group-focus-within:hidden dark:text-neutral-400"
      >
        <SearchIcon :size="20" />
      </label>

      <input
        type="text"
        v-model="searchInput"
        name="searchbox"
        id="searchbox"
        placeholder="Search For Conversation"
        class="py-3 bg-transparent w-full dark:text-neutral-400 dark:placeholder:text-neutral-400"
      />

      <button
        :hidden="!searchInput"
        @click="clearSearchInput"
        type="button"
        class="text-neutral-600"
      >
        <CloseIcon :size="18" />
      </button>
    </div>

    <SuggestedUsers v-if="!searchUsers.isOpen" />

    <p
      v-if="!searchUsers.isOpen"
      class="text-sm text-gray-600 dark:text-gray-500 px-2 pb-0.5"
    >
      All Conversations
    </p>
  </section>
</template>
