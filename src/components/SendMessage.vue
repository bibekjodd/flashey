<script setup lang="ts">
const props = defineProps<{ chatId: string }>();
import { imageToDataUri } from "@/lib/imageToDataUri";
import { ref } from "vue";
// @ts-ignore
import ImageIcon from "vue-material-design-icons/Image.vue";
// @ts-ignore
import SendIcon from "vue-material-design-icons/Send.vue";
// @ts-ignore
import CloseIcon from "vue-material-design-icons/Close.vue";
import { useToast } from "vue-toast-notification";
import { sendMessage } from "@/lib/fetchers";
import { scrollToBottom } from "../lib/scrollToBottom";

const toast = useToast();
const image = ref<string>("");
const input = ref<string>("");
const isMessageSending = ref<boolean>(false);

const handleImageChange = async (e: Event) => {
  const imageInputElement = e.target as HTMLInputElement;
  if (!imageInputElement.files) return;

  const imageFile = imageInputElement.files[0];
  image.value = await imageToDataUri(imageFile);
};

const unpickImage = () => {
  image.value = "";
};

const handleMessageSubmit = async (e: Event) => {
  e.preventDefault();
  isMessageSending.value = true;
  if (input.value) {
    const { message } = await sendMessage({
      chatId: props.chatId,
      text: input.value,
    });
    if (message) {
      toast.error(message);
    } else {
      input.value = "";
    }
    scrollToBottom();
  }

  if (image.value) {
    const { message } = await sendMessage({
      chatId: props.chatId,
      image: image.value,
    });
    if (message) {
      toast.error(message);
    } else {
      image.value = "";
    }
    scrollToBottom();
  }

  isMessageSending.value = false;
};
</script>

<template>
  <div class="p-3">
    <form
      @submit="handleMessageSubmit"
      v-auto-animate
      action=""
      class="w-full bg-neutral-200/80 pl-3 rounded-lg relative"
      :class="{ 'pt-1': !!image }"
    >
      <div v-if="image" class="rounded-md py-3 relative w-fit">
        <img :src="image" alt="" class="h-16 max-w-[120px]" />
        <div
          @click="unpickImage"
          class="absolute cursor-pointer top-1 right-0 bg-white rounded-full"
        >
          <CloseIcon size="14" />
        </div>
      </div>

      <div class="w-full flex items-center">
        <label for="image" class="text-sky-500">
          <ImageIcon />
        </label>
        <input
          @change="handleImageChange"
          type="file"
          name="image"
          accept="image/*"
          id="image"
          class="hidden"
        />

        <input
          v-model="input"
          type="text"
          placeholder="Type Message"
          class="w-full bg-transparent p-2.5"
        />
        <button
          v-if="!isMessageSending"
          :disabled="!input && !image"
          type="submit"
          class="py-1 px-3 rounded-md text-blue-500 disabled:opacity-50"
        >
          <SendIcon />
        </button>
        <span v-else class="isMessageLoading p-2 mx-3"> </span>
      </div>
    </form>
  </div>
</template>

<style>
.isMessageLoading {
  border: 2px solid rgb(59 130 246);
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
