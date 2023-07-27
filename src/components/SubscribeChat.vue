<script setup lang="ts">
import { EVENTS } from "@/lib/constants";
import pusher from "@/lib/pusher";
import { useChat } from "@/stores/useChat";
import { useUser } from "@/stores/useUser";
import { watch } from "vue";

const chatStore = useChat();
const user = useUser();

watch([user, chatStore], (newValue, oldValue) => {
  const oldChatStore = oldValue[1];
  const newChatStore = newValue[1];

  for (const chat of oldChatStore.data) {
    pusher.unsubscribe(chat._id);
    pusher.unbind_all();
  }

  for (const chat of newChatStore.data) {
    const channel = pusher.subscribe(chat._id);

    channel.bind(EVENTS.MESSAGE_SENT, (message: Message) => {
      chatStore.messageArrived(chat._id, message);
    });

    channel.bind(
      EVENTS.REACTION_ADDED,
      (data: { chatId: string; messageId: string; reaction: {userId:string,value:string} }) => {
        chatStore.reactionAdded(data);
      }
    );
  }
});
</script>

<template>{{ "" }}</template>
