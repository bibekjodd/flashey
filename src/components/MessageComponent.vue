<script setup lang="ts">
import { dummyUserImage } from "@/lib/constants";
import { isSentByMe } from "@/lib/messageUtils";
import { useUser } from "@/stores/useUser";
import moment from "moment";

const user = useUser();
defineProps<{ message: Message }>();
</script>

<template>
  <div
    class="flex text-sm px-3.5 xs:px-4 sm:px-5 w-full max-w-[90%] pb-5"
    :class="{
      'self-end  justify-end': isSentByMe(message, user.data),
      'self-start justify-start': !isSentByMe(message, user.data),
    }"
  >
    <img
      :src="message.sender.picture?.url || dummyUserImage"
      alt=""
      class="bg-gradient-to-tr from-fuchsia-700 to-sky-800 w-10 h-10 rounded-full object-cover"
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
        <span class="font-medium">
          {{ isSentByMe(message, user.data) ? "You" : message.sender.name }}
        </span>

        <span class="text-gray-400 font-extralight">{{
          moment(message.createdAt).fromNow()
        }}</span>
      </div>

      <div class="">
        <p
          v-if="message.text"
          class="px-4 py-2.5 rounded-xl w-fit text-base"
          :class="{
            'bg-blue-500 text-neutral-100 rounded-tr-none ml-auto': isSentByMe(
              message,
              user.data
            ),
            'bg-neutral-200/80 rounded-tl-none mr-auto': !isSentByMe(
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
