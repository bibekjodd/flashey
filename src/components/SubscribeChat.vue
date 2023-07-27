<script setup lang="ts">
import { EVENTS } from "@/lib/constants";
import pusher from "@/lib/pusher";
import { useChat } from "@/stores/useChat";
import { useUser } from "@/stores/useUser";
import { watch } from "vue";

const chatStore = useChat();
const user = useUser();

watch([user, chatStore], () => {
  for (const chat of chatStore.data) {
    pusher.unsubscribe(chat._id);
    pusher.unbind_all();
  }

  for (const chat of chatStore.data) {
    const channel = pusher.subscribe(chat._id);

    channel.bind(EVENTS.MESSAGE_SENT, (message: Message) => {
      chatStore.messageArrived(chat._id, message);
    });
  }
});
</script>

<template>{{ "" }}</template>
