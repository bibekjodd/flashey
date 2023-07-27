<script setup lang="ts">
import { dummyUserImage } from "@/lib/constants";
import { useChat } from "@/stores/useChat";
import { useUser } from "@/stores/useUser";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const router = useRouter();
const userStore = useUser();
const chatStore = useChat();

onMounted(async () => {
  await userStore.fetchSuggestedUsers();
});

const handleProfileClicked = async (otherUser: User) => {
  toast.clear();
  const id = await chatStore.chatExists(userStore.data, otherUser);
  if (id) {
    router.push(`/chat/${id}`);
    return;
  }

  toast.error("Unexpected error occurred while accessing chat");
};
</script>

<template>
  <section
    v-if="userStore.suggestedUsers?.length !== 0"
    class="px-2 my-3 space-y-2 pb-3 pt-1"
  >
    <p class="font-inter text-sm text-gray-600">Suggested Users</p>
    <div class="flex items-center w-full overflow-x-auto space-x-2">
      <button
        v-for="user of userStore.suggestedUsers.slice(0, 6)"
        @click="handleProfileClicked(user)"
        class=""
        :key="`suggesteduser${user._id}`"
      >
        <img
          alt=""
          :src="user.picture?.url || dummyUserImage"
          class="w-9 h-9 rounded-full object-cover bg-white"
          loading="lazy"
        />
      </button>
    </div>
  </section>
</template>
