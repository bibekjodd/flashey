<script setup lang="ts">
import { useAuthModal } from "@/stores/useAuthModal";
import { useUser } from "@/stores/useUser";

const user = useUser();
const authModal = useAuthModal();
const logoutUser = async () => {
  await user.logOut();
  authModal.open();
};
</script>

<template>
  <button @click="logoutUser">
    <slot></slot>
  </button>
</template>
