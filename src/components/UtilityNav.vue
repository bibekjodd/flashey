<script setup lang="ts">
// @ts-ignore
import LogoutIcon from "vue-material-design-icons/Logout.vue";
// @ts-ignore
import CreateGroupIcon from "vue-material-design-icons/AccountGroup.vue";
// @ts-ignore
import MoonIcon from "vue-material-design-icons/WeatherNight.vue";
// @ts-ignore
import SunIcon from "vue-material-design-icons/WhiteBalanceSunny.vue";

import { useUser } from "@/stores/useUser";
import { useCreateGroup } from "@/stores/useCreateGroup";
import { onMounted, ref } from "vue";
import LogoutButton from "./LogoutButton.vue";

const user = useUser();
const createGroupModal = useCreateGroup();
const isDarkTheme = ref(false);

const switchTheme = () => {
  if (isDarkTheme.value) {
    document.querySelector("html")?.classList.remove("dark");
    isDarkTheme.value = false;
  } else {
    document.querySelector("html")?.classList.add("dark");
    isDarkTheme.value = true;
  }
};

onMounted(() => {
  const htmlElement = document.querySelector("html");
  if (htmlElement?.classList.contains("dark")) {
    isDarkTheme.value = true;
  } else {
    isDarkTheme.value = false;
  }
});
</script>

<template>
  <div
    class="px-3 sm:px-4 py-2 flex flex-col text-sm font-inter text-neutral-800 mt-auto"
  >
    <button
      @click="switchTheme"
      class="flex items-center hover:bg-neutral-200/50 z-40 py-3 px-2 rounded-lg space-x-2 font-medium transition active:scale-95"
    >
      <MoonIcon v-if="!isDarkTheme" :size="20" />
      <SunIcon v-else :size="20" />
      <span>Switch Theme</span>
    </button>

    <button
      @click="createGroupModal.open"
      v-if="user.data"
      class="flex items-center hover:bg-neutral-200/50 z-40 py-3 px-2 rounded-lg space-x-2 font-medium transition active:scale-95"
    >
      <CreateGroupIcon :size="20" />
      <span>Create Group</span>
    </button>

    <LogoutButton
      class="flex items-center hover:bg-neutral-200/50 z-40 py-3 px-2 rounded-lg space-x-2 font-medium transition active:scale-95"
    >
      <LogoutIcon :size="20" />
      <span>Logout</span>
    </LogoutButton>
  </div>
</template>
