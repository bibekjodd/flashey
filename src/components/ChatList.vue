<script setup lang="ts">
import { fetchChats } from "@/lib/fetchers";
import moment from "moment";
import { useChat } from "@/stores/useChat";
import { useUser } from "@/stores/useUser";
import { onMounted } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useToast } from "vue-toast-notification";
import {
  getChatImage,
  hasOtherUserReadMessage,
  hasReadMessage,
  lastViewerImage,
} from "@/lib/chatUtils";
import { getChatName } from "@/lib/chatUtils";
// @ts-ignore
import CheckAllIcon from "vue-material-design-icons/CheckAll.vue";
import { useSearchUsers } from "@/stores/useSearchUsers";

const searchUsers = useSearchUsers();
const toast = useToast();
const user = useUser();
const chatStore = useChat();
const route = useRoute();

onMounted(async () => {
  const res = await fetchChats();
  if (res.chats) chatStore.setChat(res.chats);
  else toast.error(res.message || "");
});

const messageHighlight = (message?: Message): string => {
  if (!message) return "";
  if (message.text && message.text !== "") {
    return message.text;
  }

  if (message.image) {
    if (message.sender._id === user.data?._id) return "You sent a photo";
    const indexOfSpace = message.sender.name.indexOf(" ");
    const senderName = message.sender.name.slice(0, indexOfSpace);
    return `${senderName} sent a photo`;
  }
  return "";
};
</script>

<template>
  <section
    class="flex-grow overflow-y-auto px-2"
    :class="{
      'hidden ': searchUsers.isOpen,
    }"
  >
    <RouterLink
      :to="`/chat/${chat._id}`"
      v-for="chat of chatStore.data"
      :key="chat._id"
      class="flex rounded-lg items-center space-x-2.5 px-3 xs:px-4 py-2.5 sm:px-5 hover:bg-neutral-50 relative"
      :class="{
        'bg-neutral-200/50': route.path === `/chat/${chat._id}`,
      }"
    >
      <img
        :src="getChatImage(chat, user.data)"
        alt=""
        loading="lazy"
        class="w-8 h-8 xs:w-10 xs:h-10 rounded-full object-cover bg-gradient-to-tr from-fuchsia-700 to-sky-600"
      />
      <div class="flex flex-col flex-grow">
        <span class="font-semibold text-sm text-neutral-800">{{
          getChatName(chat, user.data)
        }}</span>
        <span class="text-xs text-gray-500 line-clamp-1">
          {{ messageHighlight(chat.latestMessage) }}
        </span>
      </div>

      <div class="flex text-xs items-center space-x-2">
        <span class="text-gray-500 w-fit whitespace-nowrap">
          {{ moment(chat.updatedAt).format("LT") }}
        </span>

        <div
          class="h-4 w-4 grid place-items-center text-gray-500"
          :class="{
            'opacity-0': chat.messages.length === 0,
          }"
        >
          <span
            v-if="!hasReadMessage(chat, user.data)"
            class="h-1 w-1 rounded-full bg-sky-500"
          ></span>
          <CheckAllIcon v-else-if="!hasOtherUserReadMessage(chat)" :size="16" />
          <img
            v-else-if="hasOtherUserReadMessage(chat)"
            :src="lastViewerImage(chat)"
            alt=""
            class="w-3 h-3 rounded-full object-cover"
          />
        </div>
      </div>
    </RouterLink>
  </section>
</template>
