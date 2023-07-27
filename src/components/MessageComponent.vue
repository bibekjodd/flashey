<script setup lang="ts">
import { dummyUserImage } from "@/lib/constants";
import { updateMessageViewed } from "@/lib/apiActions";
import { getViewersIds, isSentByMe } from "@/lib/messageUtils";
import { useChat } from "@/stores/useChat";
import { useUser } from "@/stores/useUser";
import moment from "moment";
import { ref, watch } from "vue";
import AddReaction from "./AddReaction.vue";
const user = useUser();
const props = defineProps<{ message: Message; chatId: string }>();
const chat = useChat();

const messageElement = ref<HTMLDivElement | null>(null);
let observer: IntersectionObserver | null = null;
watch([chat, messageElement], () => {
  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(async (entry) => {
        const ratio = entry.intersectionRatio;
        if (ratio < 0.7) return;

        const target = entry.target as HTMLDivElement;
        const data = target.dataset as {
          _id: string;
          viewers: string;
        };

        await updateMessageViewed({
          messageId: data._id,
          chatId: props.chatId,
          user: user.data,
          viewers: data.viewers,
        });
      });
    },
    {
      root: document.getElementById("messages"),
      rootMargin: "0px",
      threshold: 1.0,
    }
  );
  if (messageElement.value) {
    observer.observe(messageElement.value);
  }
});
</script>

<template>
  <div
    ref="messageElement"
    class="flex text-sm px-3.5 xs:px-4 sm:px-5 w-full max-w-[90%] relative mb-10"
    :class="{
      'self-end  justify-end': isSentByMe(user.data, message),
      'self-start justify-start': !isSentByMe(user.data, message),
    }"
    :data-_id="message._id"
    :data-viewers="JSON.stringify(getViewersIds(message))"
  >
    <img
      loading="lazy"
      :src="message.sender.picture?.url || dummyUserImage"
      alt=""
      class="bg-gradient-to-tr from-fuchsia-700 to-sky-800 h-8 w-8 md:w-10 md:h-10 rounded-full object-cover"
      :class="{
        'order-1 ml-3': isSentByMe(user.data, message),
        'mr-3': !isSentByMe(user.data, message),
      }"
    />

    <div class="space-y-2">
      <div
        class="space-x-2 w-fit"
        :class="{
          'ml-auto': isSentByMe(user.data, message),
          'mr-auto': !isSentByMe(user.data, message),
        }"
      >
        <span class="font-medium text-sm text-neutral-700">
          {{ isSentByMe(user.data, message) ? "You" : message.sender.name }}
        </span>

        <span class="text-gray-400 font-extralight text-xs">{{
          moment(message.createdAt).fromNow()
        }}</span>
      </div>

      <div class="relative w-fit group " tabindex="0">
        <div class="space-y-2 w-fit">
          <img
            loading="lazy"
            v-if="message.image?.url"
            :src="message.image?.url"
            alt=""
            class="rounded-md w-full max-w-sm max-h-96"
          />

          <p
            v-if="message.text"
            class="px-4 py-2.5 rounded-xl w-fit  text-base"
            :class="{
              'bg-sky-500 text-white rounded-tr-none ml-auto': isSentByMe(
                user.data,
                message
              ),
              'bg-neutral-200/50 rounded-tl-none mr-auto': !isSentByMe(
                user.data,
                message
              ),
            }"
          >
            {{ message.text }}
          </p>
          <AddReaction :message-id="message._id" :is-sent-by-me="isSentByMe(user.data, message)" :chat-id="chatId" :user-reactions="message.reactions" />
        </div>
      </div>
    </div>
  </div>
</template>
