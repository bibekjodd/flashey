<script setup lang="ts">
import { dummyUserImage } from "@/lib/constants";
import { useSearchUsers } from "@/stores/useSearchUsers";

const searchUsers = useSearchUsers();
</script>

<template>
  <section v-show="searchUsers.isOpen" class="px-3.5 sm:px-4">
    <div class="flex flex-col" v-auto-animate>
      <p v-if="searchUsers.users.length===0" class="text-sm px-2 mt-3 text-rose-600">No results found</p>
      <div
        v-for="user of searchUsers.users"
        :key="user._id"
        class="flex items-center space-x-2 py-2 hover:bg-neutral-200/50 cursor-pointer rounded-lg px-2"
      >
        <img
          :src="user.picture?.url || dummyUserImage"
          alt=""
          class="h-8 w-8 rounded-full object-cover"
        />
        <div class="flex flex-col">
          <p class="text-neutral-800 font-semibold">{{ user.name }}</p>
          <p class="text-neutral-500/70 text-xs">{{ user.email }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
