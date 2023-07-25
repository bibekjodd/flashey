<script setup lang="ts">
import MessageComponent from "@/components/MessageComponent.vue";
import { getChatName } from "@/lib/chatUtils";
import { dummyUserImage } from "@/lib/constants";
import { accessChat } from "@/lib/fetchers";
import { useChat } from "@/stores/useChat";
import { useUser } from "@/stores/useUser";
import { ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
// @ts-ignore
import ArrowLeftIcon from "vue-material-design-icons/ArrowLeft.vue";
// @ts-ignore
import InformationIcon from "vue-material-design-icons/Information.vue";
// @ts-ignore
import TripledotsIcon from "vue-material-design-icons/DotsVertical.vue";
import SendMessage from "@/components/SendMessage.vue";
const userStore = useUser();
const chatStore = useChat();
const route = useRoute();
const chat = ref(chatStore.getChatById(route.params.chatId as string));

watchEffect(async () => {
  const chat = chatStore.getChatById(route.params.chatId as string);
  if (chat?.isMessagesFetched) return;

  const res = await accessChat(route.params.chatId as string);
  if (res.chat) {
    chatStore.updateMessages(res.chat, res.messages || []);
  }
});

watchEffect(() => {
  chat.value = chatStore.getChatById(route.params.chatId as string);
});
</script>

<template>
  <div class="h-screen flex flex-col w-full ">
    <div
      class="py-3  px-3.5 xs:px-4 sm:px-5 mb-5 flex items-center h-20 shadow-sm shadow-neutral-300/80"
    >
      <RouterLink
        to="/"
        class="mdp:hidden"
        :class="{
          'pr-3': !chat?.isGroupChat,
        }"
      >
        <ArrowLeftIcon class="text-blue-600" />
      </RouterLink>

      <div
        class="flex"
        :class="{
          '-space-x-5': chat?.isGroupChat,
        }"
      >
        <div v-for="user of chat?.users.slice(0, 4)" :key="user._id">
          <img
            v-if="user._id !== userStore.data?._id"
            :src="user.picture?.url || dummyUserImage"
            alt=""
            class="h-10 w-10 rounded-full object-cover ring-2 ring-white mr-3"
          />
        </div>
      </div>

      <div>
        <p class="font-semibold">
          {{ getChatName(chat, userStore.data) }}
        </p>

        <p v-if="chat?.isGroupChat" class="text-sm text-neutral-500">
          {{ chat?.users.length }}
          members
        </p>
      </div>

      <div class="ml-auto">
        <button v-if="chat?.isGroupChat" class="text-blue-600">
          <InformationIcon />
        </button>

        <button v-else class="text-neutral-700">
          <TripledotsIcon />
        </button>
      </div>
    </div>

    <div
      class="flex flex-col-reverse scrollbar-hide w-full h-full  overflow-y-auto "
      id="messages"
    >
      <MessageComponent
        v-for="message of chat?.messages.reverse()"
        :key="message._id"
        :message="message"
      />
    </div>

    <SendMessage :chat-id="chat?._id || ''" />
  </div>
</template>
