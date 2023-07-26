<script setup lang="ts">
import { fetchChats } from "@/lib/fetchers";
import { useChat } from "@/stores/useChat";
import { onMounted } from "vue";
import { useToast } from "vue-toast-notification";
import { useSearchUsers } from "@/stores/useSearchUsers";
import ChatListItem from "./ChatListItem.vue";

const searchUsers = useSearchUsers();
const toast = useToast();
const chatStore = useChat();

onMounted(async () => {
  const res = await fetchChats();
  if (res.chats) chatStore.setChat(res.chats);
  else toast.error(res.message || "");
});
</script>

<template>
  <section
    class="flex-grow overflow-y-auto scrollbar-hide px-2"
    :class="{
      'hidden ': searchUsers.isOpen,
    }"
  >
    <ChatListItem v-for="chat of chatStore.data" :key="chat._id" :chat="chat" />
  </section>
</template>
