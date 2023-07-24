<script setup lang="ts">
import { RouterView } from "vue-router";
import LoginModal from "./components/modals/LoginModal.vue";
import InitialOverlay from "./components/InitialOverlay.vue";
import HomeHeader from "./components/HomeHeader.vue";
import ChatList from "./components/ChatList.vue";
import { useUser } from "./stores/useUser";
import { useAuthModal } from "./stores/useAuthModal";
import { watch } from "vue";

const user = useUser();
const authModal = useAuthModal();
watch(user, (oldUser, newUser) => {
  if (newUser.data) authModal.close();
  else authModal.open();
});
</script>

<template>
  <InitialOverlay />
  <div class="w-full h-screen">
    <!-- Chat Section -->
    <section class="font-poppins">
      <HomeHeader />
      <ChatList />
    </section>

    <!-- Message section -->
    <RouterView />
  </div>

  <LoginModal />
</template>
