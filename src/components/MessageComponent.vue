<script setup lang="ts">
import { dummyUserImage } from "@/lib/constants";
import { updateMessageViewed } from "@/lib/apiActions";
import { getViewersIds, isSentByMe } from "@/lib/messageUtils";
import { useChat } from "@/stores/useChat";
import { useUser } from "@/stores/useUser";
import moment from "moment";
import { ref, watch } from "vue";
const user = useUser();
defineProps<{ message: Message }>();
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
          id: data._id,
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
    class="flex text-sm px-3.5 xs:px-4 sm:px-5 w-full max-w-[90%] pb-5"
    :class="{
      'self-end  justify-end': isSentByMe(message, user.data),
      'self-start justify-start': !isSentByMe(message, user.data),
    }"
    :data-_id="message._id"
    :data-viewers="JSON.stringify(getViewersIds(message))"
  >
    <img
      :src="message.sender.picture?.url || dummyUserImage"
      alt=""
      class="bg-gradient-to-tr from-fuchsia-700 to-sky-800 h-8 w-8 md:w-10 md:h-10 rounded-full object-cover"
      :class="{
        'order-1 ml-3': isSentByMe(message, user.data),
        'mr-3': !isSentByMe(message, user.data),
      }"
    />

    <div class="space-y-2">
      <div
        class="space-x-2 w-fit"
        :class="{
          'ml-auto': isSentByMe(message, user.data),
          'mr-auto': !isSentByMe(message, user.data),
        }"
      >
        <span class="font-medium text-sm text-neutral-700">
          {{ isSentByMe(message, user.data) ? "You" : message.sender.name }}
        </span>

        <span class="text-gray-400 font-extralight text-xs">{{
          moment(message.createdAt).fromNow()
        }}</span>
      </div>

      <div class="">
        <p
          v-if="message.text"
          class="px-4 py-2.5 rounded-xl w-fit text-base"
          :class="{
            'bg-sky-500 text-neutral-100 rounded-tr-none ml-auto': isSentByMe(
              message,
              user.data
            ),
            'bg-neutral-200/50 rounded-tl-none mr-auto': !isSentByMe(
              message,
              user.data
            ),
          }"
        >
          {{ message.text }}
        </p>

        <img
          v-if="message.image?.url"
          :src="message.image?.url"
          alt=""
          class="rounded-md w-full max-w-sm max-h-96"
        />
      </div>
    </div>
  </div>
</template>
