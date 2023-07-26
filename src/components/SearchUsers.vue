<script setup lang="ts">
import { dummyUserImage } from "@/lib/constants";
import { useChat } from "@/stores/useChat";
import { useSearchUsers } from "@/stores/useSearchUsers";
import { useUser } from "@/stores/useUser";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";

const searchUsers = useSearchUsers();
const chatStore = useChat();
const user = useUser();
const router = useRouter();
const toast = useToast();

const handleProfileClicked = async (otherUser: User) => {
  toast.clear();
  const id = await chatStore.chatExists(user.data, otherUser);
  if (id) {
    router.push(`/chat/${id}`);
    return;
  }

  toast.error("Unexpected error occurred while accessing chat");
};
</script>

<template>
  <section v-show="searchUsers.isOpen" class="px-3.5 sm:px-4">
    <div class="flex flex-col" v-auto-animate>
      <p
        v-if="!searchUsers.isLoading && searchUsers.users.length === 0"
        class="text-sm px-2 text-rose-600"
      >
        No results found
      </p>

      <p v-else class="text-sm px-2 text-neutral-800 ">Results</p>

      <div
        v-if="searchUsers.isLoading"
        class="flex items-center justify-between text-sm mb-2 px-2 text-neutral-700"
      >
        <p>Searching users...</p>
        <span class="animatedLoader h-4 w-4 border-2 border-sky-600"></span>
      </div>



      <button
        v-for="user of searchUsers.users"
        :key="user._id"
        @click="handleProfileClicked(user)"
        class="flex items-center space-x-2 py-2 hover:bg-neutral-200/50 cursor-pointer rounded-lg px-2"
      >
        <img
          :src="user.picture?.url || dummyUserImage"
          alt=""
          class="h-8 w-8 rounded-full object-cover"
        />

        <div class="flex flex-col items-start">
          <p class="text-neutral-800 font-semibold">{{ user.name }}</p>

          <p class="text-neutral-500/70 text-xs">{{ user.email }}</p>
        </div>
      </button>
    </div>
  </section>
</template>
