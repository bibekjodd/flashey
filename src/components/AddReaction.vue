<script setup lang="ts">
const props = defineProps<{
  isSentByMe: boolean;
  userReactions?: { user: User; value: string }[];
  chatId: string;
  messageId: string;
}>();
import { addReactionToMessage } from "@/lib/apiActions";
import { mapReactions, reactions } from "@/lib/constants";
import { useToast } from "vue-toast-notification";
import { prepareReactions } from "../lib/messageUtils";

const toast = useToast();
const addReaction = async (reaction: string) => {
  const { error } = await addReactionToMessage({
    reaction,
    messageId: props.messageId,
    chatId: props.chatId,
  });

  if (error) toast.error(error);
};
</script>

<template>
  <div
    class="absolute -bottom-7 py-1 px-2 rounded-lg text-base"
    :class="{
      'right-0': isSentByMe,
      'left-0': !isSentByMe,
    }"
  >
    <!-- add reactions -->
    <div class="hidden group-hover:flex group-focus:flex space-x-1">
      <button
        v-for="reaction of reactions"
        :key="reaction[0]"
        @click="addReaction(reaction[0])"
        class="transition hover:scale-125 active:scale-[2] ease-in"
      >
        {{ reaction[1] }}
      </button>
    </div>

    <!-- added reactions -->
    <div
      v-if="userReactions"
      class="group-hover:hidden group-focus:hidden flex space-x-1"
    >
      <span
        v-for="reaction of prepareReactions(userReactions)"
        :key="reaction[0]"
        class="flex space-x-0.5 items-center"
      >
        <span>
          {{ mapReactions[reaction[0]] }}
        </span>
        <span
          class="text-xs font-semibold text-neutral-700 dark:text-neutral-400"
          >{{ reaction[1] }}</span
        >
      </span>
    </div>
  </div>
</template>
