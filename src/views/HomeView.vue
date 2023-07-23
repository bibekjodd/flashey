<script setup lang="ts">
import { useUser } from "@/stores/useUser";

const user = useUser();
</script>

<template>
  <main>
    <h1>Home Page</h1>
    <div v-if="user.data !== null">
      <p>name: {{ user.data.name }}</p>
      <p>email: {{ user.data.email }}</p>
      <img
        :src="user.data?.picture?.url || ''"
        alt=""
        class="h-10 w-10 rounded-full object-cover"
      />
    </div>
  </main>
</template>
