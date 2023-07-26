<script setup lang="ts">
import { dummyUserImage } from "@/lib/constants";
import { imageToDataUri } from "@/lib/imageToDataUri";
import { useCreateGroup } from "@/stores/useCreateGroup";
import { ref, watch } from "vue";
// @ts-ignore
import CloseIcon from "vue-material-design-icons/CloseCircle.vue";
// @ts-ignore
import ImageIcon from "vue-material-design-icons/ImageOutline.vue";
import { useToast } from "vue-toast-notification";

let timeout: number | null = null;
const toast = useToast();

const createGroupModal = useCreateGroup();
const input = ref("");
const groupName = ref("");
const image = ref("");

const preventCloseModal = (e: Event) => {
  e.stopPropagation();
};

const handleImageChange = async (e: Event) => {
  const inputElement = e.target as HTMLInputElement;
  if (inputElement.files) {
    image.value = await imageToDataUri(inputElement.files[0]);
  }
};

const handleCreateGroupClick = async () => {
  const { error, message } = await createGroupModal.createGroupAction(
    groupName.value,
    image.value
  );
  if (error) toast.error(error);
  else if (message) toast.success(message);
};

watch(input, () => {
  if (timeout) clearTimeout(timeout);

  setTimeout(() => {
    createGroupModal.fetchUsers(input.value);
  }, 200);
});
</script>
<template>
  <section
    @click="createGroupModal.close"
    v-show="createGroupModal.isOpen"
    class="absolute inset-0 bg-black/30 z-40 grid place-items-center font-poppins filter backdrop-blur-md"
  >
    <div
      @click="preventCloseModal"
      class="w-full max-w-sm p-4 bg-white/90 filter backdrop-blur-3xl rounded-md space-y-2 h-full max-h-[440px] md:max-h-[500px] flex flex-col text-xs"
    >
      <label for="groupImage" class="space-y-1 flex flex-col items-center">
        <span  class="font-semibold pl-1">Group Image</span>
        <img
          v-if="image"
          :src="image"
          alt=""
          class="h-7 w-7 rounded-full object-cover"
        />
        <label v-else for="groupImage" class="text-gray-800">
          <ImageIcon :size="28" />
        </label>
        <input
          type="file"
          @change="handleImageChange"
          accept="image/*"
          id="groupImage"
          class="hidden"
        />
        <input
          v-model="groupName"
          type="text"
          name="groupName"
          id="groupName"
          placeholder="Group Name"
          class="w-full p-2 rounded-lg border-2 border-neutral-200 bg-transparent"
        />
      </label>

      <input
        v-model="input"
        type="text"
        placeholder="Search users..."
        class="w-full p-2 rounded-lg border-2 border-neutral-200 bg-transparent"
      />

      <div class="text-xs px-2 pt-2 flex justify-between">
        <p class="font-semibold">Selected Users</p>
        <button
          v-if="createGroupModal.selectedUsers.length"
          @click="createGroupModal.deselectAllUsers"
          class="text-rose-500"
        >
          Clear All
        </button>
      </div>

      <div v-auto-animate class="flex flex-wrap">
        <div
          v-for="user of createGroupModal.selectedUsers"
          :key="user._id"
          class="w-8 h-8 relative mx-1 cursor-pointer"
          @click="createGroupModal.deselectUser(user)"
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
          v-for="user of createGroupModal.users"
          :key="user._id"
          @click="createGroupModal.selectUser(user)"
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
          :disabled="createGroupModal.isCreating"
          @click="handleCreateGroupClick"
          class="px-4 relative py-2 rounded-lg bg-sky-600 text-white active:scale-95 transition disabled:opacity-70"
        >
          <span
            :class="{
              'opacity-0': createGroupModal.isCreating,
            }"
          >
            Create Group
          </span>
          <div
            :class="{
              'opacity-0': !createGroupModal.isCreating,
            }"
            class="absolute inset-0 grid place-items-center"
          >
            <span class="isCreating text-white h-4 w-4"></span>
          </div>
        </button>
        <button @click="createGroupModal.close" class="text-rose-500 px-4 py-2">
          Cancel
        </button>
      </div>
    </div>
  </section>
</template>

<style>
.isCreating {
  border: 2px solid #fff;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: creating 1s linear infinite;
}

@keyframes creating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
