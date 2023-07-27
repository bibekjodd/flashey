<script setup lang="ts">
const props = defineProps<{ chatId: string }>();
import { imageToDataUri } from "@/lib/imageToDataUri";
import { ref } from "vue";
// @ts-ignore
import ImageIcon from "vue-material-design-icons/ImageOutline.vue";
// @ts-ignore
import SendIcon from "vue-material-design-icons/Send.vue";
// @ts-ignore
import CloseIcon from "vue-material-design-icons/Close.vue";
import { useToast } from "vue-toast-notification";
import { scrollToBottom } from "../lib/scrollToBottom";
import { sendMessage } from "@/lib/apiActions";

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
  if (isMessageSending.value) return;
  e.preventDefault();
  isMessageSending.value = true;

  if (input.value || image.value) {
    const { error } = await sendMessage({
      chatId: props.chatId,
      text: input.value,
      image: image.value,
    });
    if (error) {
      toast.error(error);
    } else {
      input.value = "";
      image.value = "";
    }
    scrollToBottom();
  }

  isMessageSending.value = false;
};
</script>

<template>
  <div class="p-3 fixed bottom-0 left-0 w-full flex z-40">
    <div class="w-0 mdp:w-full mdp:max-w-[40%] lg:max-w-md"></div>
    <div class="w-full bg-white pl-2 lg:pl-0">
      <form
        @submit="handleMessageSubmit"
        v-auto-animate
        action=""
        class="w-full bg-neutral-200/30 pl-3 rounded-lg relative flex-grow"
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
            :disabled="!input && !image.valueOf()"
            type="submit"
            class="py-1 px-3 rounded-md text-sky-500 disabled:opacity-50"
          >
            <SendIcon />
          </button>
          <span v-else class="isMessageLoading p-2 mx-3"> </span>
        </div>
      </form>
    </div>
  </div>
</template>

<style>
.isMessageLoading {
  border: 2px solid rgb(59 130 246);
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: messageLoading 1s linear infinite;
}

@keyframes messageLoading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
