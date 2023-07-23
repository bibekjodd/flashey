<script setup lang="ts">
import { RouterView } from "vue-router";
import LoginModal from "./components/modals/LoginModal.vue";
import { onMounted } from "vue";
import { fetchUser } from "@/lib/auth";
import { useUser } from "./stores/useUser";

const user = useUser();

onMounted(async () => {
  const res = await fetchUser();
  if (res.data) {
    user.setUser(res.data);
  }
});
</script>

<template>
  <div class="flex w-full h-screen">
    <RouterView />
  </div>

  <LoginModal />
</template>
