<script setup lang="ts">
import { dummyUserImage } from "@/lib/constants";
import { useAddToGroup } from "@/stores/useAddToGroup";
import { ref, watch } from "vue";
// @ts-ignore
import CloseIcon from "vue-material-design-icons/CloseCircle.vue";

let timeout: number | null = null;

const addToGroupModal = useAddToGroup();
const input = ref("");

const preventCloseModal = (e: Event) => {
  e.stopPropagation();
};

watch(input, () => {
  if (timeout) clearTimeout(timeout);

  setTimeout(() => {
    addToGroupModal.fetchUsers(input.value);
  }, 200);
});
</script>
<template>
  <section
    @click="addToGroupModal.close"
    v-show="addToGroupModal.isOpen"
    class="absolute inset-0 bg-black/30 z-40 grid place-items-center font-poppins filter backdrop-blur-md"
  >
    <div
      @click="preventCloseModal"
      class="w-full max-w-sm p-4 bg-white/90 filter backdrop-blur-3xl rounded-md space-y-2 h-full max-h-[440px] md:max-h-[600px] flex flex-col"
    >
      <input
        v-model="input"
        type="text"
        placeholder="Search users..."
        class="w-full p-2 rounded-lg border-2 border-neutral-200 bg-transparent text-sm"
      />

      <div class="text-xs px-2 pt-2 flex justify-between">
        <p class="font-semibold">Selected Users</p>
        <button
          v-if="addToGroupModal.selectedUsers.length"
          @click="addToGroupModal.deselectAllUsers"
          class="text-rose-500"
        >
          Clear All
        </button>
      </div>

      <div v-auto-animate class="flex flex-wrap">
        <div
          v-for="user of addToGroupModal.selectedUsers"
          :key="user._id"
          class="w-8 h-8 relative mx-1 cursor-pointer"
          @click="addToGroupModal.deselectUser(user)"
        >
          <img
            :src="user.picture?.url || dummyUserImage"
            alt=""
            class="w-full h-full rounded-full object-cover"
          />
          <button class="absolute text-white top-0 right-0">
            <CloseIcon :size="16" />
          </button>
        </div>
      </div>

      <p class="text-xs font-semibold px-2">Results</p>
      <div
        v-auto-animate
        class="space-y-2 flex-grow overflow-y-auto scrollbar-hide"
      >
        <button
          v-for="user of addToGroupModal.users"
          :key="user._id"
          @click="addToGroupModal.selectUser(user)"
          class="flex items-center space-x-2 w-full hover:bg-neutral-200/50 p-2 rounded-lg"
        >
          <img
            :src="user.picture?.url || dummyUserImage"
            class="h-8 w-8 rounded-full object-cover"
            alt=""
          />
          <div class="flex flex-col items-start text-sm">
            <p class="font-semibold text-sm">{{ user.name }}</p>
            <p class="text-gray-500 text-xs">{{ user.email }}</p>
          </div>
        </button>
      </div>

      <div class="flex flex-col items-center text-xs">
        <button
          class="px-4 py-2 rounded-lg bg-sky-600 text-white active:scale-95 transition"
        >
          {{ addToGroupModal.createMode ? "Create Group" : "Update Group" }}
        </button>
        <button @click="addToGroupModal.close" class="text-rose-500 px-4 py-2">
          Cancel
        </button>
      </div>
    </div>
  </section>
</template>
