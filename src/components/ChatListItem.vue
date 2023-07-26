<script setup lang="ts">
const props = defineProps<{ chat: Chat }>();

import moment from "moment";
import { getChatImage, getChatName } from "@/lib/chatUtils";
import {
  messageHighlight,
  hasOtherUsersReadMessage,
  haveIReadMessage,
  isSentByMe,
  lastViewersImage,
} from "@/lib/messageUtils";
// @ts-ignore
import CheckAllIcon from "vue-material-design-icons/CheckAll.vue";
import { useUser } from "@/stores/useUser";
import { RouterLink, useRoute } from "vue-router";
import { ref, watch } from "vue";

const route = useRoute();
const user = useUser();

const latestMessage = ref(props.chat.latestMessage);

watch(props, () => {
  latestMessage.value = props.chat.latestMessage;
});
</script>

<template>
  <RouterLink
    :to="`/chat/${chat._id}`"
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
        {{ messageHighlight(user.data, latestMessage) }}
      </span>
    </div>

    <div class="flex text-xs items-center space-x-2">
      <span class="text-gray-500 w-fit whitespace-nowrap">
        {{ moment(chat.updatedAt).format("LT") }}
      </span>

      <div class="h-4 w-4 grid place-items-center text-gray-500">
        <CheckAllIcon
          :size="16"
          v-if="
            isSentByMe(user.data, latestMessage) &&
            !hasOtherUsersReadMessage(user.data, latestMessage)
          "
        />
        <span
          v-if="
            !isSentByMe(user.data, latestMessage) &&
            !haveIReadMessage(user.data, latestMessage)
          "
          class="h-1 w-1 rounded-full bg-sky-500"
        >
        </span>
        <img
          v-if="
            isSentByMe(user.data, latestMessage) &&
            hasOtherUsersReadMessage(user.data, latestMessage)
          "
          :src="lastViewersImage(user.data, latestMessage)"
          class="w-3 h-3 rounded-full object-cover"
        />
      </div>
    </div>
  </RouterLink>
</template>
