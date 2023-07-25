<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import LoginModal from "./components/modals/LoginModal.vue";
import InitialOverlay from "./components/InitialOverlay.vue";
import HomeHeader from "./components/HomeHeader.vue";
import ChatList from "./components/ChatList.vue";
import { useUser } from "./stores/useUser";

const user = useUser();
const route = useRoute();



</script>

<template>
  <InitialOverlay v-if="user.isLoading" />
  <div v-if="user.data" class="w-full flex">
    <!-- Chat Section -->
    <section
      class="font-poppins w-full mdp:max-w-[40%] lg:max-w-md mdp:border-r text-neutral-900 border-neutral-200 h-screen flex flex-col"
      :class="{
        'hidden mdp:flex': route.path !== '/',
      }"
    >
      <HomeHeader />
      <ChatList />
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

  <LoginModal v-else />
</template>
