<script setup lang="ts">
import MessageComponent from "@/components/MessageComponent.vue";
import { getChatImage, getChatName, isGroupAdmin } from "@/lib/chatUtils";
import { useChat } from "@/stores/useChat";
import { useUser } from "@/stores/useUser";
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
// @ts-ignore
import ArrowLeftIcon from "vue-material-design-icons/ArrowLeft.vue";
// @ts-ignore
import InformationIcon from "vue-material-design-icons/InformationOutline.vue";
// @ts-ignore
import TripledotsIcon from "vue-material-design-icons/DotsVertical.vue";
// @ts-ignore
import EditGroupIcon from "vue-material-design-icons/PencilCircleOutline.vue";
import SendMessage from "@/components/SendMessage.vue";

const userStore = useUser();
const chatStore = useChat();
const route = useRoute();
const chat = ref(chatStore.getChatById(route.params.chatId as string));

watch([route, chatStore], () => {
  chat.value = chatStore.getChatById(route.params.chatId as string);
});

onMounted(() => {
  chat.value = chatStore.getChatById(route.params.chatId as string);
});
</script>

<template>
  <div v-if="chatStore.data" class="h-screen flex flex-col w-full font-inter">
    <div
      class="py-3 px-3.5 xs:px-4 sm:px-5 flex items-center h-24 shadow-sm shadow-neutral-300/80"
    >
      <RouterLink to="/" class="mdp:hidden mr-3">
        <ArrowLeftIcon class="text-blue-600" />
      </RouterLink>

      <div
        class="flex"
        :class="{
          '-space-x-5': chat?.isGroupChat,
        }"
      >
        <img
          :src="getChatImage(chat, userStore.data)"
          alt=""
          class="h-10 w-10 rounded-full object-cover ring-2 ring-white mr-3"
        />
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

      <div class="ml-auto space-x-2">
        <button v-if="chat?.isGroupChat" class="text-sky-600">
          <InformationIcon />
        </button>

        <button
          v-if="chat?.isGroupChat && isGroupAdmin(chat, userStore.data)"
          class="text-sky-600"
        >
          <EditGroupIcon />
        </button>

        <button v-if="!chat?.isGroupChat" class="text-neutral-700">
          <TripledotsIcon />
        </button>
      </div>
    </div>

    <div
      class="flex flex-col-reverse scrollbar-hide w-full h-full overflow-y-auto pt-5"
      id="messages"
    >
      <MessageComponent
        :message="message"
        v-for="message of chat?.messages"
        :key="message._id"
      />
    </div>

    <SendMessage :chat-id="chat?._id || ''" />
  </div>
</template>
@/stores/useAddToGroup @/stores/useCreateGroup
