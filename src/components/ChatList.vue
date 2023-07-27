<script setup lang="ts">
import { useChat } from "@/stores/useChat";
import { onMounted } from "vue";
import { useToast } from "vue-toast-notification";
import { useSearchUsers } from "@/stores/useSearchUsers";
import ChatListItem from "./ChatListItem.vue";
import ChatListSkeleton from "./skeletons/ChatListSkeleton.vue";

const searchUsers = useSearchUsers();
const toast = useToast();
const chatStore = useChat();

onMounted(async () => {
  const { error } = await chatStore.fetchChatInitially();
  if (error) {
    toast.clear();
    toast.error(error);
  }
});
</script>

<template>
  <section
    class="flex-grow overflow-y-auto scrollbar-hide px-2 flex flex-col"
    :class="{
      'hidden ': searchUsers.isOpen,
    }"
  >
    <div v-if="!chatStore.isLoading">
      <ChatListItem
        v-for="chat of chatStore.data"
        :key="chat._id"
        :chat="chat"
      />
    </div>
    <ChatListSkeleton v-else />
  </section>
</template>
