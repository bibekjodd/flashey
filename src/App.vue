<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import AuthModal from "./components/modals/AuthModal.vue";
import InitialOverlay from "./components/InitialOverlay.vue";
import HomeHeader from "./components/HomeHeader.vue";
import ChatList from "./components/ChatList.vue";
import { useUser } from "./stores/useUser";
import CreateGroupModal from "./components/modals/CreateGroupModal.vue";
import SearchUsers from "./components/SearchUsers.vue";
import SubscribeChat from "./components/SubscribeChat.vue";
import UtilityNav from "./components/UtilityNav.vue";
import { onMounted } from "vue";

const user = useUser();
const route = useRoute();

onMounted(() => {
  const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
  const htmlElement = document.querySelector("html");
  if (colorScheme.matches) {
    if (!htmlElement?.classList.contains("dark"))
      htmlElement?.classList.add("dark");
  } else {
    htmlElement?.classList.remove("dark");
  }
});
</script>

<template>
  <div class="bg-white dark:bg-neutral-900 dark:text-white">
    <InitialOverlay v-if="user.isLoading" />
    <CreateGroupModal />

    <div v-if="user.data" class="w-full flex">
      <!-- Chat Section -->
      <section
        class="font-poppins w-full mdp:max-w-[40%] lg:max-w-md mdp:border-r dark:border-gray-700 text-neutral-900 border-neutral-200 h-screen flex flex-col"
        :class="{
          'hidden mdp:flex': route.path !== '/',
        }"
      >
        <HomeHeader />
        <SearchUsers />
        <ChatList />
        <UtilityNav />
      </section>

      <!-- Message section -->
      <section
        class="flex-grow text-neutral-900"
        :class="{
          'hidden mdp:block': $route.path === '/',
        }"
      >
        <RouterView />
      </section>
    </div>

    <AuthModal v-else />
    <SubscribeChat />
  </div>
</template>
