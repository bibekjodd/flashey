<script setup lang="ts">
const props = defineProps<{ chat: Chat | null }>();
import { shouldShowTyping } from "@/lib/chatUtils";
import { useUser } from "@/stores/useUser";

const userStore = useUser();
</script>
<template>
  <div
    v-if="shouldShowTyping(userStore.data, props.chat?.isTyping)"
    class="pb-20 px-6"
  >
    <div
      class="bg-neutral-200/80 dark:bg-neutral-100 white py-2.5 rounded-lg rounded-tl-none flex w-fit space-x-3 px-3"
    >
      <span class="italic text-xs">typing...</span>
    </div>
  </div>
</template>

<style>
.animation-delay-1 {
  animation-delay: 333ms;
}
.animation-delay-2 {
  animation-delay: 666ms;
}
</style>
