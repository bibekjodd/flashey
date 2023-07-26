<script setup lang="ts">
import { dummyUserImage } from "@/lib/constants";
import { useCreateGroup } from "@/stores/useCreateGroup";
import { useUser } from "@/stores/useUser";
import { ref } from "vue";
// @ts-ignore
import CreateGroupIcon from "vue-material-design-icons/AccountGroupOutline.vue";

const user = useUser();
const searchInput = ref("");
const createGroupModal = useCreateGroup();
</script>

<template>
  <section class="px-3 xs:px-4 pt-3 xs:pt-4 sm:px-5">
    <div class="flex">
      <span class="font-semibold text-lg">Inbox</span>

      <button @click="createGroupModal.open" class="ml-auto mr-4 text-sky-700">
        <CreateGroupIcon :size="24" />
      </button>
      <RouterLink to="/">
        <img
          :src="user.data?.picture?.url || dummyUserImage"
          class="h-7 w-7 rounded-full object-contain bg-gradient-to-tr from-fuchsia-700 to-sky-600"
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
    <p class="text-xs text-neutral-600 px-3.5 xs:px-4 sm:px-5 pb-1">
      All Conversations
    </p>
  </section>
</template>
