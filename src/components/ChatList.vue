<script setup lang="ts">
// import { getChatImageAndName } from "@/lib/chat";
import { fetchChats } from "@/lib/fetchers";
import moment from "moment";
import { useChat } from "@/stores/useChat";
import { useUser } from "@/stores/useUser";
import { onMounted } from "vue";
import { RouterLink } from "vue-router";
import { useToast } from "vue-toast-notification";
import { getChatImage } from "@/lib/chatUtils";
import { getChatName } from "@/lib/chatUtils";
const toast = useToast();
const { data: user } = useUser();
const chatStore = useChat();

onMounted(async () => {
  const res = await fetchChats();
  if (res.chats) chatStore.setChat(res.chats);
  else toast.error(res.message || "");
});
</script>

<template>
  <section class="flex-grow overflow-y-auto">
    <p class="text-xs text-neutral-600 px-3.5 xs:px-4 sm:px-5">
      All Conversations
    </p>

    <RouterLink
      :to="`/chat/${chat._id}`"
      v-for="chat of chatStore.data"
      :key="chat._id"
      class="flex items-center space-x-2.5 px-3.5 xs:px-4 py-2.5 sm:px-5 hover:bg-neutral-100 active:bg-neutral-200"
    >
      <img
        :src="getChatImage(chat, user)"
        alt=""
        loading="lazy"
        class="w-10 h-10 rounded-full object-cover bg-gradient-to-tr from-fuchsia-700 to-sky-600"
      />
      <div class="flex flex-col flex-grow">
        <span class="font-semibold text-sm">{{ getChatName(chat, user) }}</span>
        <span class="text-xs text-gray-500">
          <span v-if="chat.latestMessage?.text">{{
            chat.latestMessage.text
          }}</span>
          <span v-if="chat.latestMessage?.image">
            {{ getChatName(chat, user) }} sent a photo</span
          >
        </span>
      </div>

      <div class="flex flex-col text-xs">
        <span class="mb-5 text-gray-500">
          {{ moment(chat.updatedAt).fromNow() }}
        </span>
        <span></span>
      </div>
    </RouterLink>
  </section>
</template>
