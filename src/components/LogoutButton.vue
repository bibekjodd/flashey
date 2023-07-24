<script setup lang="ts">
import { logout } from "@/lib/auth";
import { useUser } from "@/stores/useUser";

const user = useUser();

const logoutUser = async () => {
  await logout();
  user.clearUser();
};
</script>

<template>
  <button @click="logoutUser">
    <slot></slot>
  </button>
</template>
